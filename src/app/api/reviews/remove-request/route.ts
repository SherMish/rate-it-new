import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/lib/models/Review";
import Website from "@/lib/models/Website";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import nodemailer from "nodemailer";

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

    // Send email to admin
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
      secure: process.env.EMAIL_SERVER_PORT === "465",
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const adminEmail = process.env.ADMIN_EMAIL || "admin@rateit.app";

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: adminEmail,
      cc: businessEmail, // Send a copy to the business owner
      subject: `Review Removal Request: ${businessName}`,
      html: `
        <h1>Review Removal Request</h1>
        <p><strong>Business:</strong> ${businessName}</p>
        <p><strong>Requested by:</strong> ${session.user.email}</p>
        <p><strong>Review ID:</strong> ${reviewId}</p>
        <p><strong>Review Rating:</strong> ${review.rating}/5</p>
        <p><strong>Review Title:</strong> ${review.title}</p>
        <p><strong>Review Content:</strong> ${review.body}</p>
        <p><strong>Review by:</strong> ${
          review.relatedUser?.name || "Anonymous"
        }</p>
        <p><strong>Reason for Removal Request:</strong> ${reason}</p>
        <p>Please review this request and take appropriate action.</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message:
        "Removal request submitted successfully. Our team will review it shortly.",
    });
  } catch (error) {
    console.error("Error in review removal request API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
