import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Website from '@/lib/models/Website';

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  try {
    await connectDB();

    // Find user with valid verification token
    const user = await User.findOne({
      'verification.token': params.token,
      'verification.expires': { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.redirect('/business/register?error=invalid_token');
    }

    const websiteUrl = user.verification.websiteUrl;

    // Update website ownership and verification
    await Website.findOneAndUpdate(
      { url: websiteUrl },
      { 
        $set: {
          owner: user._id,
          isVerified: true,
          verifiedAt: new Date()
        }
      }
    );

    // Update user and remove verification data
    await User.findByIdAndUpdate(user._id, {
      $set: {
        isWebsiteOwner: true,
        isVerifiedWebsiteOwner: true
      },
      $unset: {
        verification: 1
      }
    });

    return NextResponse.redirect('/business/register?step=pricing');
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.redirect('/business/register?error=verification_failed');
  }
} 