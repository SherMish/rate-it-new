import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Website } from "@/lib/models";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // For development - skip auth check
    // const session = await getServerSession(authOptions);
    // if (!session?.user) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    const body = await request.json();
    const { name, url, relatedCategory, description } = body;

    if (!name || !url || !relatedCategory) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await connectDB();

    // Check if website already exists
    const existingWebsite = await Website.findOne({ url });
    if (existingWebsite) {
      return new NextResponse("Website already exists", { status: 409 });
    }

    // Create new website without owner field
    const website = await Website.create({
      name,
      url,
      relatedCategory,
      description
      // owner field omitted for development
    });

    return NextResponse.json(website);
  } catch (error) {
    console.error("Error in website creation:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 