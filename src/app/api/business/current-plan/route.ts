import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Website from "@/lib/models/Website";
import User from "@/lib/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Find the user
    const user = await User.findOne({ email: session.user.email });
    if (!user || !user.isWebsiteOwner) {
      return NextResponse.json(
        { error: "User not found or not a website owner" },
        { status: 404 }
      );
    }

    // Find the user's website
    const website = await Website.findOne({ 
      $or: [
        { createdBy: user._id },
        { owner: user._id }
      ]
    }).select('pricingModel licenseValidDate isVerifiedByRateIt');

    if (!website) {
      return NextResponse.json(
        { error: "Website not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      currentPlan: website.pricingModel,
      licenseValidDate: website.licenseValidDate,
      isVerified: website.isVerifiedByRateIt,
    });

  } catch (error) {
    console.error("Error fetching website plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
