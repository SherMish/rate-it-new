import { NextResponse } from "next/server";
import { Resend } from "resend";
import { randomBytes } from "crypto";
import User from "@/lib/models/User";
import mongoose from "mongoose";
import { sendEmail } from "@/lib/email";

const resend = new Resend(process.env.RESEND_API_KEY);

export const maxDuration = 10; // Set max duration to 10 seconds
export const dynamic = "force-dynamic";

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
    // Add timeout to email sending
    await sendEmail({
      to: email,
      subject: "איפוס סיסמא",
      html: `
        <h2>אפסו את סיסמתכם</h2>
        <p>לחץ/י כאן על מנת לאפס את סיסמתך. תוקף הקישור - 60 דקות.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}">איפוס סיסמא</a>
      `,
      text: `
        איפוס סיסמא
        
        לחץ/י כאן על מנת לאפס את סיסמתך. תוקף הקישור - 60 דקות.
        ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password reset error:", error);

    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
      // Add connection state to error message if it's a database timeout
      if (errorMessage.includes("Database timeout")) {
        errorMessage += ` (Connection state: ${mongoose.connection.readyState})`;
      }
    }

    return NextResponse.json(
      {
        error: "Failed to process password reset",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
