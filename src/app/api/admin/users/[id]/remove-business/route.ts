import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import Website from "@/lib/models/Website";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  try {
    await connectDB();
    const body = await request.json();
    const { websiteId } = body;

    if (!websiteId) {
      return NextResponse.json(
        { error: "Website ID is required" },
        { status: 400 }
      );
    }

    // Update user document - remove all business associations
    const user = await User.findByIdAndUpdate(
      params.id,
      {
        role: "user",
        relatedWebsite: null,
        isWebsiteOwner: false,
        isVerifiedWebsiteOwner: false,
        websites: null
      },
      { new: true }
    ).select("-hashedPassword -resetToken");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update website document - remove verification
    try {
      await Website.findByIdAndUpdate(websiteId, {
        isVerified: false,
        owner: null,
      });
    } catch (websiteError) {
      console.error("Error updating website:", websiteError);
      // Continue even if website update fails
    }

    return NextResponse.json({
      success: true,
      user,
      message: "User removed from business successfully",
    });
  } catch (error: any) {
    console.error("Error removing user from business:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
