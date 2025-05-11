import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/lib/models/Review';

export async function GET(
  request: Request,
  { params }: { params: { websiteId: string } }
) {
  try {
    await connectDB();
    
    const reviews = await Review.find({ relatedWebsite: params.websiteId })
      .select('title body rating createdAt helpfulCount relatedUser isVerified')
      .populate('relatedUser', 'name profilePicture')
      .sort({ createdAt: -1 });
    
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
} 