"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import Website from "@/lib/models/Website";
import { sendEmail } from "@/lib/email";
import { PricingModel } from "@/lib/types/website";

// Generate 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendVerificationEmail(
  email: string,
  websiteUrl: string,
  businessName: string
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const verificationCode = generateVerificationCode();
    const expires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    // Update user with verification code
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          verification: {
            code: verificationCode,
            attempts: 0,
            expires: expires,
            websiteUrl: websiteUrl,
            businessName: businessName,
            email: email,
          },
        },
      },
      { new: true, upsert: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    // Send verification email with code
    await sendEmail({
      to: email,
      subject: "אמת את הבעלות על הדומיין שלך",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">אמת את הבעלות על הדומיין שלך</h2>
          <p style="color: #666; font-size: 16px;">הזן את הקוד הבא כדי לאמת את הבעלות על הדומיין עבור ${websiteUrl}:</p>
          
          <div style="background-color: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
            <div style="font-size: 32px; font-weight: bold; color: #0070f3; letter-spacing: 8px; font-family: monospace;">
              ${verificationCode}
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            <strong>שימו לב:</strong> לצורך המשך תהליך הרשמה תקין וחלק, יש להזין את הקוד במכשיר ובדפדפן בהם התחלתם את ההרשמה.
          </p>
          <p style="color: #999; font-size: 12px;">הקוד תקף למשך שעה אחת בלבד.</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error in verification process:", error);
    throw error;
  }
}

// New function to verify code instead of token
export async function verifyCode(code: string) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    // Find user with this verification code
    const user = await User.findOne({
      email: session.user.email,
      "verification.code": code,
      "verification.expires": { $gt: new Date() },
    });

    if (!user) {
      // Increment attempts for the current user if they exist
      await User.findOneAndUpdate(
        {
          email: session.user.email,
          "verification.expires": { $gt: new Date() },
        },
        { $inc: { "verification.attempts": 1 } }
      );
      throw new Error("Invalid or expired verification code");
    }

    // Check attempts limit
    if (user.verification.attempts >= 2) {
      // 2 previous attempts + this one = 3 total
      throw new Error("Maximum attempts exceeded");
    }

    const websiteUrl = user.verification.websiteUrl;
    const businessName = user.verification.businessName;

    if (!websiteUrl || !businessName) {
      throw new Error("Missing verification data");
    }

    // Clean the URL to match storage format
    const cleanUrl = websiteUrl
      .toLowerCase()
      .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
      .split("/")[0]
      .split(":")[0];

    // Check if website already exists and if it's owned by someone else
    const existingWebsite = await Website.findOne({ url: cleanUrl });
    if (existingWebsite?.owner && existingWebsite.owner.toString() !== (user._id as any)?.toString()) {
      throw new Error("האתר כבר משויך למשתמש אחר");
    }

    // Create or update website with complete business registration logic
    const websitePayload = {
      ...(existingWebsite ?? {}),
      url: cleanUrl,
      owner: user._id,
      isVerified: true,
      pricingModel: PricingModel.FREE, // Default to free plan
      verifiedAt: new Date(),
      name: existingWebsite?.name ?? businessName,
      categories: existingWebsite?.categories ?? ["other"],
      isActive: true,
    };

    const website = await Website.findOneAndUpdate(
      { url: cleanUrl },
      { $set: websitePayload },
      { upsert: true, new: true }
    );

    // Update user with complete business owner permissions
    await User.findByIdAndUpdate(user._id, {
      $set: {
        role: "business_owner",
        isWebsiteOwner: true,
        isVerifiedWebsiteOwner: true,
        relatedWebsite: cleanUrl,
        currentPricingModel: PricingModel.FREE,
        websites: website._id, // Single website ID, not an array
      },
      $unset: {
        verification: 1,
      },
    });

    return { success: true, websiteUrl: cleanUrl, websiteId: website._id.toString() };
  } catch (error) {
    console.error("Error verifying code:", error);
    if (error instanceof Error) {
      throw new Error(`Verification failed: ${error.message}`);
    }
    throw new Error("Failed to verify code");
  }
}

// Keep the old verifyDomain function for backward compatibility, but it should not be used anymore
export async function verifyDomain(token: string) {
  throw new Error(
    "Token-based verification is deprecated. Use code verification instead."
  );
}
