import { NextResponse } from "next/server";
import Review from "@/lib/models/Review";
import { Types } from "mongoose";
import connectDB from "@/lib/mongodb";

interface ReviewDoc {
  _id: Types.ObjectId;
  title: string;
  body: string;
  rating: number;
  createdAt: Date;
  helpfulCount?: number;
  relatedUser?: { name: string };
  isVerified?: boolean;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get("websiteId");

    if (!websiteId) {
      return NextResponse.json({ error: "Missing websiteId" }, { status: 400 });
    }

    await connectDB();
    
    const reviews = await Review.find({ relatedWebsite: websiteId })
      .select("title body rating createdAt helpfulCount relatedUser isVerified")
      .populate("relatedUser", "name")
      .lean<ReviewDoc[]>();

    const formattedReviews = reviews.map((review) => ({
      _id: review._id.toString(),
      title: review.title,
      body: review.body,
      rating: review.rating,
      helpfulCount: review.helpfulCount,
      createdAt: review.createdAt.toISOString(),
      relatedUser: review.relatedUser
        ? { name: review.relatedUser.name }
        : undefined,
      isVerified: review.isVerified || false,
    }));

    return NextResponse.json(formattedReviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
} 