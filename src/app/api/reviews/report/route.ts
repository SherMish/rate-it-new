import { NextResponse } from "next/server";
import { Resend } from "resend";
import { sendUnifiedEmail } from "@/lib/email";
import { emailStyles } from "@/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const {
      reviewId,
      reviewTitle,
      reviewBody,
      reviewAuthor,
      reporterEmail,
      message,
    } = await req.json();

    const additionalContent = `
      <div style="${emailStyles.warningBox}">
          <p style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#92400e;">פרטי המדווח:</p>
          <p style="margin:0;font-size:14px;color:#92400e;">${reporterEmail}</p>
      </div>
      
      ${
        message
          ? `
      <div style="margin-bottom:24px;">
          <p style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#374151;">הודעת המדווח:</p>
          <p style="margin:0;font-size:14px;color:#4b5563;background-color:#f9fafb;padding:12px;border-radius:6px;">${message}</p>
      </div>
      `
          : ""
      }
      
      <div style="border-top:1px solid #e5e7eb;padding-top:24px;">
          <h2 style="${emailStyles.subheading}">פרטי הביקורת המדווחת:</h2>
          
          <div style="${emailStyles.errorBox}">
              <p style="margin:0 0 8px 0;font-size:14px;"><strong>מזהה ביקורת:</strong> ${reviewId}</p>
              <p style="margin:0 0 8px 0;font-size:14px;"><strong>מחבר:</strong> ${reviewAuthor}</p>
              <p style="margin:0 0 8px 0;font-size:14px;"><strong>כותרת:</strong> ${reviewTitle}</p>
              <p style="margin:0;font-size:14px;"><strong>תוכן:</strong></p>
              <p style="margin:8px 0 0 0;font-size:14px;color:#4b5563;">${reviewBody}</p>
          </div>
      </div>`;

    await sendUnifiedEmail({
      to: "hello@rate-it.co.il",
      subject: `דיווח על ביקורת: ${reviewTitle}`,
      title: "דיווח על ביקורת",
      body: "קיבלת דיווח חדש על ביקורת הדורש בדיקה.",
      additionalContent,
      preheader: "דיווח חדש על ביקורת",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Report submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit report" },
      { status: 500 }
    );
  }
}
