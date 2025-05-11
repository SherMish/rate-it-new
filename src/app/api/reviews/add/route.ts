import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Review } from '@/lib/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Get the authenticated user's session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const reviewData = await request.json();
    
    await connectDB();
    
    const review = await Review.create({
      ...reviewData,
      relatedUser: session.user.id, // Use the actual user ID from the session
      isVerified: false,
    });
    
    return NextResponse.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
} 