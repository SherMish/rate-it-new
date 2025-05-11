import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Website from '@/lib/models/Website';
import User from '@/lib/models/User';
import PendingVerification from '@/lib/models/PendingVerification';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    await connectDB();
    
    const pendingVerification = await PendingVerification.findOne({
      verificationToken: token,
      expiresAt: { $gt: new Date() },
    });
    
    if (!pendingVerification) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }
    
    // Update website ownership
    await Website.findByIdAndUpdate(pendingVerification.websiteId, {
      owner: pendingVerification.userId,
      isVerified: true,
    });
    
    // Update user status
    await User.findByIdAndUpdate(pendingVerification.userId, {
      $set: {
        isWebsiteOwner: true,
        isVerifiedWebsiteOwner: true,
      },
      $addToSet: {
        ownedWebsites: pendingVerification.websiteId,
      },
    });
    
    // Delete the pending verification
    await PendingVerification.deleteOne({ _id: pendingVerification._id });
    
    return NextResponse.json({
      message: 'Website ownership verified successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to verify ownership' },
      { status: 500 }
    );
  }
} 