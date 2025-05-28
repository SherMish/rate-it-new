import { NextResponse } from "next/server";
import { Resend } from "resend";
import { randomBytes } from "crypto";
import User from "@/lib/models/User";
import mongoose from "mongoose";
import { sendEmail } from "@/lib/email";
import {
  createSimpleEmailTemplate,
  getPlainTextFooter,
} from "@/lib/email-templates";

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

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    const htmlContent = createSimpleEmailTemplate(
      "איפוס סיסמה",
      `<p style="margin:0 0 24px 0;font-size:16px;line-height:1.6;color:#4b5563;">
        קיבלנו בקשה לאיפוס הסיסמה שלך. לחץ על הכפתור למטה כדי להגדיר סיסמה חדשה.
      </p>
      <p style="margin:0 0 24px 0;font-size:14px;line-height:1.5;color:#6b7280;">
        הקישור יהיה תקף למשך 60 דקות. אם לא ביקשת איפוס סיסמה, אנא התעלם מהודעה זו.
      </p>`,
      "איפוס סיסמה",
      resetUrl
    );

    const textContent = `איפוס סיסמה

קיבלנו בקשה לאיפוס הסיסמה שלך. לחץ על הקישור למטה כדי להגדיר סיסמה חדשה:
${resetUrl}

הקישור יהיה תקף למשך 60 דקות. אם לא ביקשת איפוס סיסמה, אנא התעלם מהודעה זו.${getPlainTextFooter()}`;

    // Add timeout to email sending
    await sendEmail({
      to: email,
      subject: "איפוס סיסמה - Rate-It",
      html: htmlContent,
      text: textContent,
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
