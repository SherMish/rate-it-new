import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Website from "@/lib/models/Website";
import User from "@/lib/models/User";
import { PricingModel } from "@/lib/types/website";
import { PRICING_CONFIG } from "@/lib/pricing";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { plan, couponCode, billing } = await request.json();

    if (!["plus", "pro"].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
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

    console.log("Found user:", user._id, "isWebsiteOwner:", user.isWebsiteOwner);

    // Find the user's website
    const website = await Website.findOne({ 
      $or: [
        { createdBy: user._id },
        { owner: user._id }
      ]
    });

    if (!website) {
      console.log("No website found for user:", user._id);
      return NextResponse.json(
        { error: "Website not found" },
        { status: 404 }
      );
    }

    console.log("Found website:", website._id, "current plan:", website.pricingModel);

    // Check if already on the requested plan
    const targetPlan = plan.toUpperCase();
    if (website.pricingModel === targetPlan) {
      return NextResponse.json(
        { error: `Already on ${plan} plan` },
        { status: 400 }
      );
    }

    // Calculate license expiry
    let licenseValidDate = new Date();
    
    if (couponCode === PRICING_CONFIG.coupons.EARLYPLUS) {
      // Free month with coupon
      licenseValidDate.setMonth(licenseValidDate.getMonth() + 1);
    } else if (billing === "annual") {
      // Annual subscription
      licenseValidDate.setFullYear(licenseValidDate.getFullYear() + 1);
    } else {
      // Monthly subscription
      licenseValidDate.setMonth(licenseValidDate.getMonth() + 1);
    }

    console.log("Updating website to plan:", targetPlan, "license valid until:", licenseValidDate);

    // Update website plan
    const updatedWebsite = await Website.findByIdAndUpdate(
      website._id, 
      {
        pricingModel: targetPlan,
        licenseValidDate: licenseValidDate,
        isVerifiedByRateIt: true, // Plus/Pro users get verified badge
      },
      { new: true } // Return the updated document
    );

    if (!updatedWebsite) {
      console.log("Failed to update website:", website._id);
      return NextResponse.json(
        { error: "Failed to update website plan" },
        { status: 500 }
      );
    }

    console.log("Website updated successfully:", updatedWebsite._id, "new plan:", updatedWebsite.pricingModel);

    return NextResponse.json({
      success: true,
      message: "Plan upgraded successfully",
      plan: plan,
      validUntil: licenseValidDate,
      websiteId: website._id,
    });

  } catch (error) {
    console.error("Error upgrading plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
