import { NextRequest, NextResponse } from "next/server";
import { sendUnifiedEmail } from "@/lib/email";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { to, subject, title, message, ctaText, ctaUrl } = body;

    if (!to || !subject || !title || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send email using the unified email function (same as forgot-password and other working endpoints)
    await sendUnifiedEmail({
      to,
      subject,
      title,
      body: message,
      ctaText,
      ctaUrl,
      preheader: `הודעה חדשה מצוות Rate-It`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
