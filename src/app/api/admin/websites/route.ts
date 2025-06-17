import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Website from "@/lib/models/Website";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkAdminAuth } from "@/lib/admin-auth";
import categoriesData from "@/lib/data/categories.json";

export async function GET(request: Request) {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    await connectDB();

    const [websites, total] = await Promise.all([
      Website.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Website.countDocuments(),
    ]);

    return NextResponse.json({
      websites: websites.map((website) => ({
        ...website,
        _id: website._id.toString(),
        createdAt: website.createdAt?.toISOString(),
        updatedAt: website.updatedAt?.toISOString(),
      })),
      total,
    });
  } catch (error) {
    console.error("Error fetching websites:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch websites" }),
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  try {
    await connectDB();
    const body = await request.json();

    const {
      url,
      name,
      categories,
      description,
      shortDescription,
      logo,
      launchYear,
      address,
      contact,
      socialUrls,
      pricingModel,
      isVerified,
      isVerifiedByRateIt,
      licenseValidDate,
      isActive,
    } = body;

    // Check if website already exists
    const existingWebsite = await Website.findOne({ url });
    if (existingWebsite) {
      return new NextResponse(
        JSON.stringify({ error: "Website already exists" }),
        { status: 400 }
      );
    }

    // Get current user
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Create website with all provided data
    const websiteData = {
      url,
      name,
      categories: categories || ["other"], // Default to ['other'] if not provided
      description: description || "",
      shortDescription: shortDescription || "",
      logo: logo || "",
      launchYear: launchYear || null,
      address: address || "",
      contact: contact || "",
      socialUrls: socialUrls || {},
      pricingModel: pricingModel || "FREE",
      isVerified: isVerified || false,
      isVerifiedByRateIt: isVerifiedByRateIt || false,
      licenseValidDate: licenseValidDate ? new Date(licenseValidDate) : null,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: userId || "000000000000000000000000",
    };

    const website = await Website.create(websiteData);

    return NextResponse.json(website);
  } catch (error) {
    console.error("Error creating website:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create website" }),
      { status: 500 }
    );
  }
}
