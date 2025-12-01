import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Review } from "@/lib/models";
import { updateWebsiteReviewStats } from "@/lib/models/Website";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reviewId, title, body, rating } = await request.json();

    if (!reviewId) {
      return NextResponse.json(
        { error: "INVALID_REQUEST", message: "Review ID is required" },
        { status: 400 }
      );
    }

    // Validate inputs
    if (!title?.trim()) {
      return NextResponse.json(
        { error: "INVALID_REQUEST", message: "Title is required" },
        { status: 400 }
      );
    }

    if (title.length > 100) {
      return NextResponse.json(
        { error: "INVALID_REQUEST", message: "Title must be 100 characters or less" },
        { status: 400 }
      );
    }

    if (!body || body.length < 10) {
      return NextResponse.json(
        { error: "INVALID_REQUEST", message: "Review body must be at least 10 characters" },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "INVALID_REQUEST", message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the review and verify ownership
    const review = await Review.findById(reviewId);

    if (!review) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Review not found" },
        { status: 404 }
      );
    }

    // Check if the user owns this review
    if (review.relatedUser.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "FORBIDDEN", message: "You can only edit your own reviews" },
        { status: 403 }
      );
    }

    // Update the review
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        title,
        body,
        rating,
      },
      { new: true }
    );

    // Update website review statistics if rating changed
    if (review.rating !== rating) {
      try {
        await updateWebsiteReviewStats(review.relatedWebsite);
      } catch (error) {
        console.error("Failed to update website stats:", error);
      }
    }

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "FAILED", message: "Failed to update review" },
      { status: 500 }
    );
  }
}
