import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  wrapEmailContent,
  emailStyles,
  getPlainTextFooter,
} from "@/lib/email-templates";

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

    const htmlContent = wrapEmailContent(
      `
      <!-- Logo Header -->
      <tr>
          <td align="center" style="padding:0 0 30px 0;">
              <img src="https://rate-it.co.il/logo_new.png" alt="Rate-It" width="300" height="150" style="${
                emailStyles.logo
              }">
          </td>
      </tr>
      
      <!-- Main Content Card -->
      <tr>
          <td style="${emailStyles.card}">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                      <td style="padding:40px 40px 30px 40px;direction:rtl;text-align:right;">
                          <h1 style="${emailStyles.heading}">
                              דיווח על ביקורת
                          </h1>
                          
                          <div style="background-color:#fef3c7;border:1px solid #fbbf24;border-radius:8px;padding:16px;margin-bottom:24px;">
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
                              <h2 style="margin:0 0 16px 0;font-size:18px;font-weight:600;color:#111827;">פרטי הביקורת המדווחת:</h2>
                              
                              <div style="background-color:#f9fafb;border-radius:8px;padding:16px;">
                                  <p style="margin:0 0 8px 0;font-size:14px;"><strong>מזהה ביקורת:</strong> ${reviewId}</p>
                                  <p style="margin:0 0 8px 0;font-size:14px;"><strong>מחבר:</strong> ${reviewAuthor}</p>
                                  <p style="margin:0 0 8px 0;font-size:14px;"><strong>כותרת:</strong> ${reviewTitle}</p>
                                  <p style="margin:0;font-size:14px;"><strong>תוכן:</strong></p>
                                  <p style="margin:8px 0 0 0;font-size:14px;color:#4b5563;">${reviewBody}</p>
                              </div>
                          </div>
                      </td>
                  </tr>
              </table>
          </td>
      </tr>`,
      "דיווח חדש על ביקורת"
    );

    const textContent = `דיווח על ביקורת

פרטי המדווח: ${reporterEmail}
${message ? `הודעת המדווח: ${message}` : ""}

פרטי הביקורת המדווחת:
מזהה ביקורת: ${reviewId}
מחבר: ${reviewAuthor}
כותרת: ${reviewTitle}
תוכן: ${reviewBody}${getPlainTextFooter()}`;

    await resend.emails.send({
      from: "noreply@rate-it.co.il",
      to: "hello@rate-it.co.il",
      subject: `דיווח על ביקורת: ${reviewTitle}`,
      html: htmlContent,
      text: textContent,
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
