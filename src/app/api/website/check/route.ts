import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Website from "@/lib/models/Website";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    await connectDB();
    
    const cleanUrl = url
      .toLowerCase()
      .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
      .split("/")[0]
      .split(":")[0];

    const website = await Website.findOne({ url: cleanUrl }).lean();
    
    if (website) {
      // Serialize ObjectIds to strings for client components
      const serializedWebsite = {
        ...website,
        _id: website._id.toString(),
        createdBy: website.createdBy?.toString() || null,
        owner: website.owner?.toString() || null,
      };
      return NextResponse.json(serializedWebsite);
    }
    
    return NextResponse.json({});
  } catch (error) {
    console.error("Error checking website:", error);
    return NextResponse.json({ error: "Failed to check website" }, { status: 500 });
  }
} 