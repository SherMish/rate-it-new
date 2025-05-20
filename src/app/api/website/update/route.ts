import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Website from "@/lib/models/Website";

export async function POST(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { url, metadata, ...updateData } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const cleanUrl = url
      .toLowerCase()
      .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
      .split("/")[0]
      .split(":")[0];

    // Prepare update data
    const websiteData = {
      ...updateData,
      ...(metadata || {}), // Spread metadata if it exists
      url: cleanUrl,
      updatedAt: new Date()
    };


    const website = await Website.findOneAndUpdate(
      { url: cleanUrl },
      { $set: websiteData },
      { upsert: true, new: true }
    );

    return NextResponse.json(website);
  } catch (error) {
    console.error('Error in website update:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 