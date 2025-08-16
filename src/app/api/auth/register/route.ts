import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import * as z from 'zod';
import { sendUserSignupAlert } from '@/lib/telegram';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  isAgreeMarketing: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();


    const { name, email, password, isAgreeMarketing } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with marketing preference
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      hashedPassword,
      isAgreeMarketing: isAgreeMarketing === true, // Explicitly convert to boolean
    });

    // Send Telegram alert for new user signup
    try {
      await sendUserSignupAlert({
        name: user.name,
        email: user.email,
        isAgreeMarketing: isAgreeMarketing === true,
        signupMethod: 'אימייל'
      });
    } catch (error) {
      console.error("Failed to send Telegram signup alert:", error);
      // Don't fail the request if Telegram alert fails
    }

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // More specific error handling
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Registration failed' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Something went wrong during registration' },
      { status: 500 }
    );
  }
} 