"use server";

import { Website } from "@/lib/models";
import connectDB from "@/lib/mongodb";
import { WebsiteType } from "@/lib/models/Website";

export async function fetchLatestWebsites(limit: number = 2) {
  await connectDB();

  try {
    const websites = await Website.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Serialize ObjectIds to strings for client components
    return websites.map((website) => ({
      ...website,
      _id: website._id.toString(),
      createdBy: website.createdBy?.toString() || null,
      owner: website.owner?.toString() || null,
    }));
  } catch (error) {
    console.error("Error fetching latest websites:", error);
    return [];
  }
}

export async function checkWebsiteExists(
  url: string
): Promise<WebsiteType | null> {
  try {
    await connectDB();

    const cleanUrl = url
      .toLowerCase()
      .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
      .split("/")[0]
      .split(":")[0];

    const website = await Website.findOne({ url: cleanUrl });

    if (!website) {
      return null;
    }

    // Safely convert ObjectIds to strings, handling optional/nullable fields
    return {
      ...website.toObject(),
      _id: website._id.toString(),
      createdBy: website.createdBy?.toString() || null, // Make optional
      owner: website.owner?.toString() || null, // Make optional
    } as unknown as WebsiteType;
  } catch (error) {
    console.error("Error checking website:", error);
    throw error;
  }
}
