import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Website from '@/lib/models/Website';
import User from '@/lib/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';
import PendingVerification from '@/lib/models/PendingVerification';
import crypto from 'crypto';

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { websiteId, verificationEmail } = await request.json();
    
    await connectDB();
    
    const website = await Website.findById(websiteId);
    if (!website) {
      return NextResponse.json(
        { error: 'Website not found' },
        { status: 404 }
      );
    }

    if (website.owner) {
      return NextResponse.json(
        { error: 'Website already has an owner' },
        { status: 400 }
      );
    }

    const verificationToken = generateToken();
    
    // Create pending verification record
    await PendingVerification.create({
      userId: session.user.id,
      websiteId,
      verificationToken,
      verificationEmail,
    });

    // Send verification email
    await sendVerificationEmail(verificationEmail, verificationToken, website.name);
    
    return NextResponse.json({
      message: 'Verification email sent',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process ownership claim' },
      { status: 500 }
    );
  }
} 