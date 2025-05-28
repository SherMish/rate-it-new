import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/lib/models/Review";
import Website from "@/lib/models/Website";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendUnifiedEmail } from "@/lib/email";
import { emailStyles } from "@/lib/email-templates";

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

    const additionalContent = `
      <div style="${emailStyles.infoBox}">
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
          <h2 style="${emailStyles.subheading}">פרטי הביקורת:</h2>
          
          <div style="${emailStyles.errorBox}">
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
      
      <div style="${emailStyles.warningBox}">
          <p style="margin:0;font-size:14px;color:#92400e;">
              אנא בדקו את הבקשה ופעלו בהתאם למדיניות הפלטפורמה.
          </p>
      </div>`;

    // Send email to admin with copy to business
    await sendUnifiedEmail({
      to: `${adminEmail}, ${businessEmail}`,
      subject: `בקשת הסרת ביקורת: ${businessName}`,
      title: "בקשת הסרת ביקורת",
      body: "קיבלת בקשה חדשה להסרת ביקורת הדורשת בדיקה.",
      additionalContent,
      preheader: "בקשת הסרת ביקורת חדשה",
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
