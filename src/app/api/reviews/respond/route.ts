import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/lib/models/Review";
import Website from "@/lib/models/Website";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reviewId, responseText } = await request.json();

    if (!reviewId || !responseText) {
      return NextResponse.json(
        { error: "Review ID and response text are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Get the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Get the website to check if the user is authorized to respond
    const websiteId = review.relatedWebsite;
    const website = await Website.findById(websiteId);

    // Check if user is the website owner
    if (
      !website ||
      !website.owner ||
      website.owner.toString() !== session.user.id
    ) {
      return NextResponse.json(
        { error: "Not authorized to respond to this review" },
        { status: 403 }
      );
    }

    // Update review with business response
    review.businessResponse = {
      text: responseText,
      lastUpdated: new Date(),
    };

    await review.save();

    return NextResponse.json({
      success: true,
      message: "Response added successfully",
    });
  } catch (error) {
    console.error("Error in review response API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
