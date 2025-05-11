import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Review } from '@/lib/models';

export async function POST(request: Request) {
  try {
    const { reviewId } = await request.json();
    
    await connectDB();
    
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );
    
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ helpfulCount: review.helpfulCount });
  } catch (error) {
    console.error('Error updating helpful count:', error);
    return NextResponse.json(
      { error: 'Failed to update helpful count' },
      { status: 500 }
    );
  }
} 