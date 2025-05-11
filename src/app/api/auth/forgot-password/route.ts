import { NextResponse } from "next/server";
import { Resend } from "resend";
import { randomBytes } from "crypto";
import User from "@/lib/models/User";
import mongoose from "mongoose";

const resend = new Resend(process.env.RESEND_API_KEY);

export const maxDuration = 10; // Set max duration to 10 seconds
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Ensure database connection
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const user = await User.findOne({ email }).maxTimeMS(8000); // MongoDB operation timeout

    if (!user) {
      // Return success even if user doesn't exist for security
      return NextResponse.json({ success: true });
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Add timeout to the database update
    await User.updateOne(
      { email },
      { 
        resetToken,
        resetTokenExpiry,
      }
    ).maxTimeMS(8000);
    console.log("Reset token:", resetToken);
    console.log("Email:", email);
    console.log("Sending email to:", email);
    console.log("Reset token expiry:", resetTokenExpiry);
    // Add timeout to email sending
    await Promise.race([
      resend.emails.send({
        from: "noreply@ai-radar.co",
        to: email,
        subject: "Reset Your Password - AI Radar",
        html: `
          <h2>Reset Your Password</h2>
          <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email sending timeout')), 5000)
      )
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password reset error:", error);
    
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
      // Add connection state to error message if it's a database timeout
      if (errorMessage.includes('Database timeout')) {
        errorMessage += ` (Connection state: ${mongoose.connection.readyState})`;
      }
    }

    return NextResponse.json(
      { 
        error: "Failed to process password reset",
        details: errorMessage
      },
      { status: 500 }
    );
  }
} 