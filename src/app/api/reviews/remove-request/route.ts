import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/lib/models/Review";
import Website from "@/lib/models/Website";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import {
  wrapEmailContent,
  emailStyles,
  getPlainTextFooter,
} from "@/lib/email-templates";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reviewId, reason, businessName, businessEmail } =
      await request.json();

    if (!reviewId || !reason || !businessEmail) {
      return NextResponse.json(
        { error: "Review ID, reason, and business email are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Get the review
    const review = await Review.findById(reviewId).populate(
      "relatedUser",
      "name"
    );
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Get the website to check if the user is authorized to request removal
    const websiteId = review.relatedWebsite;
    const website = await Website.findById(websiteId);

    // Check if user is the website owner
    if (
      !website ||
      !website.owner ||
      website.owner.toString() !== session.user.id
    ) {
      return NextResponse.json(
        { error: "Not authorized to request removal of this review" },
        { status: 403 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL || "hello@rate-it.co.il";

    const htmlContent = wrapEmailContent(
      `
      <!-- Logo Header -->
      <tr>
          <td align="center" style="padding:0 0 30px 0;">
              <img src="https://rate-it.co.il/logo_new.png" alt="Rate-It" width="150" height="28" style="${
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
                              בקשת הסרת ביקורת
                          </h1>
                          
                          <div style="background-color:#f0f9ff;border:1px solid #0ea5e9;border-radius:8px;padding:16px;margin-bottom:24px;">
                              <p style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#0c4a6e;">פרטי העסק:</p>
                              <p style="margin:0 0 4px 0;font-size:14px;color:#0c4a6e;"><strong>שם העסק:</strong> ${businessName}</p>
                              <p style="margin:0;font-size:14px;color:#0c4a6e;"><strong>נשלח על ידי:</strong> ${
                                session.user.email
                              }</p>
                          </div>
                          
                          <div style="margin-bottom:24px;">
                              <p style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#374151;">סיבת הבקשה:</p>
                              <p style="margin:0;font-size:14px;color:#4b5563;background-color:#f9fafb;padding:12px;border-radius:6px;">${reason}</p>
                          </div>
                          
                          <div style="border-top:1px solid #e5e7eb;padding-top:24px;">
                              <h2 style="margin:0 0 16px 0;font-size:18px;font-weight:600;color:#111827;">פרטי הביקורת:</h2>
                              
                              <div style="background-color:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:16px;">
                                  <p style="margin:0 0 8px 0;font-size:14px;"><strong>מזהה ביקורת:</strong> ${reviewId}</p>
                                  <p style="margin:0 0 8px 0;font-size:14px;"><strong>דירוג:</strong> ${
                                    review.rating
                                  }/5</p>
                                  <p style="margin:0 0 8px 0;font-size:14px;"><strong>כותרת:</strong> ${
                                    review.title
                                  }</p>
                                  <p style="margin:0 0 8px 0;font-size:14px;"><strong>מחבר:</strong> ${
                                    review.relatedUser?.name || "אנונימי"
                                  }</p>
                                  <p style="margin:0;font-size:14px;"><strong>תוכן:</strong></p>
                                  <p style="margin:8px 0 0 0;font-size:14px;color:#4b5563;">${
                                    review.body
                                  }</p>
                              </div>
                          </div>
                          
                          <div style="background-color:#fffbeb;border:1px solid #f59e0b;border-radius:8px;padding:16px;margin-top:24px;">
                              <p style="margin:0;font-size:14px;color:#92400e;">
                                  אנא בדקו את הבקשה ופעלו בהתאם למדיניות הפלטפורמה.
                              </p>
                          </div>
                      </td>
                  </tr>
              </table>
          </td>
      </tr>`,
      "בקשת הסרת ביקורת חדשה"
    );

    const textContent = `בקשת הסרת ביקורת

פרטי העסק:
שם העסק: ${businessName}
נשלח על ידי: ${session.user.email}

סיבת הבקשה: ${reason}

פרטי הביקורת:
מזהה ביקורת: ${reviewId}
דירוג: ${review.rating}/5
כותרת: ${review.title}
מחבר: ${review.relatedUser?.name || "אנונימי"}
תוכן: ${review.body}

אנא בדקו את הבקשה ופעלו בהתאם למדיניות הפלטפורמה.${getPlainTextFooter()}`;

    // Send email to admin with copy to business
    await sendEmail({
      to: `${adminEmail}, ${businessEmail}`,
      subject: `בקשת הסרת ביקורת: ${businessName}`,
      html: htmlContent,
      text: textContent,
    });

    return NextResponse.json({
      success: true,
      message: "בקשת ההסרה נשלחה בהצלחה. הצוות שלנו יבדוק אותה בהקדם.",
    });
  } catch (error) {
    console.error("Error in review removal request API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
