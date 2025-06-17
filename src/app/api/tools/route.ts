import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Website from "@/lib/models/Website";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to create a website" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      url,
      name,
      categories,
      description,
      shortDescription,
      logo,
      radarTrust,
    } = body;

    // Validate required fields
    if (!url || !name || !categories || categories.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate radarTrust if provided
    if (radarTrust !== undefined) {
      const trustScore = Number(radarTrust);
      if (isNaN(trustScore) || trustScore < 1 || trustScore > 10) {
        return NextResponse.json(
          { error: "RadarTrust must be a number between 1 and 10" },
          { status: 400 }
        );
      }
    }

    await connectDB();

    // Normalize URL before checking
    const normalizedUrl = url
      .toLowerCase()
      .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
      .split("/")[0]
      .split(":")[0];

    // Check if website with same URL exists
    const existingWebsite = await Website.findOne({ url: normalizedUrl });
    if (existingWebsite) {
      return NextResponse.json(
        { error: "This website has already been added" },
        { status: 400 }
      );
    }

    // Create website
    const website = await Website.create({
      name,
      url: url.toLowerCase(),
      categories,
      description: description || undefined,
      shortDescription: shortDescription || undefined,
      logo:
        process.env.NEXT_PUBLIC_IS_PRODUCTION === "false"
          ? logo || undefined
          : undefined,
      radarTrust: radarTrust || 0, // Default to 5 if not provided
      createdBy: session.user.id,
      isActive: true,
    });

    return NextResponse.json(
      {
        message: "Website added successfully",
        url: website.url, // Return normalized URL for redirection
        id: website._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating website:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to add website",
      },
      { status: 500 }
    );
  }
}
