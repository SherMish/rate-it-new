import { NextResponse } from "next/server";
import { Resend } from "resend";

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

    await resend.emails.send({
      from: "noreply@rate-it.co.il",
      to: "hello@rate-it.co.il",
      subject: `Review Report: ${reviewTitle}`,
      html: `
        <h2>Review Report</h2>
        <p><strong>Reporter Email:</strong> ${reporterEmail}</p>
        <p><strong>Message:</strong> ${message || "No message provided"}</p>
        <hr />
        <h3>Reported Review Details:</h3>
        <p><strong>Review ID:</strong> ${reviewId}</p>
        <p><strong>Author:</strong> ${reviewAuthor}</p>
        <p><strong>Title:</strong> ${reviewTitle}</p>
        <p><strong>Content:</strong> ${reviewBody}</p>
      `,
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