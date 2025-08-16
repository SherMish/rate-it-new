import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Review } from "@/lib/models";
import User from "@/lib/models/User";
import { updateWebsiteReviewStats } from "@/lib/models/Website";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Get the authenticated user's session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reviewData = await request.json();

    await connectDB();

    // Rate limit: one review per user per website per 30 days
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000; // Approximation of a month
    const sinceDate = new Date(Date.now() - THIRTY_DAYS_MS);

    const existingRecentReview = (await Review.findOne({
      relatedUser: session.user.id,
      relatedWebsite: reviewData.relatedWebsite,
      createdAt: { $gte: sinceDate },
    })
      .select("_id createdAt")
      .lean()) as { _id: string; createdAt: Date } | null;

    if (existingRecentReview) {
      const nextAllowedDate = new Date(
        existingRecentReview.createdAt.getTime() + THIRTY_DAYS_MS
      );
      return NextResponse.json(
        {
          error: "RATE_LIMIT",
          message:
            "כבר כתבת ביקורת על עסק זה במהלך החודש האחרון. ניתן לכתוב ביקורת נוספת רק לאחר 30 ימים.",
          nextAllowedDate,
        },
        { status: 429 }
      );
    }

    const review = await Review.create({
      ...reviewData,
      relatedUser: session.user.id, // Use the actual user ID from the session
      isVerified: false,
    });

    // Update website review statistics
    try {
      await updateWebsiteReviewStats(reviewData.relatedWebsite);
    } catch (error) {
      console.error("Failed to update website stats:", error);
      // Don't fail the request if stats update fails
    }

    // Update user review count
    try {
      await User.findByIdAndUpdate(
        session.user.id,
        { $inc: { reviewCount: 1 } },
        { new: true }
      );
      console.log(`Incremented review count for user: ${session.user.id}`);
    } catch (error) {
      console.error("Failed to update user review count:", error);
      // Don't fail the request if user stats update fails
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "FAILED", message: "Failed to create review" },
      { status: 500 }
    );
  }
}
