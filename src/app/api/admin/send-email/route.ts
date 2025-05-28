import { NextRequest, NextResponse } from "next/server";
import { createUnifiedEmailTemplate } from "@/lib/email-templates";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  if (process.env.IS_PRODUCTION === "true") {
    return new NextResponse("Not authorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { to, subject, title, message, ctaText, ctaUrl } = body;

    if (!to || !subject || !title || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create email template
    const { html, text } = createUnifiedEmailTemplate({
      subject,
      title,
      body: message,
      ctaText,
      ctaUrl,
      preheader: `הודעה חדשה מצוות Rate-It`,
    });

    // Send email
    await sendEmail({
      to,
      subject,
      html,
      text,
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
