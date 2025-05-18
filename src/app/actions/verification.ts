"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import Website from "@/lib/models/Website";
import { generateToken } from "@/lib/utils";
import { sendEmail } from "@/lib/email";

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

    const verificationToken = generateToken();
    const expires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    // Update user with verification token
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          verification: {
            token: verificationToken,
            expires: expires,
            websiteUrl: websiteUrl,
            businessName: businessName,
          },
        },
      },
      { new: true, upsert: true }
    );

    if (!user) {
      throw new Error("User not found");
    }
    console.log(`/business/register?token=${verificationToken}&step=4"`);
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/business/register?token=${verificationToken}&step=4`;

    // Send verification email
    await sendEmail({
      to: email,
      subject: "אמת את הבעלות על הדומיין שלך",
      html: `
        <div style="font-family: sans-serif;">
          <h2>אמת את הבעלות על הדומיין שלך</h2>
          <p>לחץ על הכפתור למטה כדי לאמת את הבעלות על הדומיין עבור ${websiteUrl}:</p>
          <p style="color: #666;"> שימו לב! לצורך המשך תהליך הרשמה תקין וחלק, יש לפתוח את הלינק במכשיר ובדפדפן בהם התחלת את ההרשמה.</p>

          <a 
            href="${verificationUrl}"
            style="display: inline-block; background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 16px 0;"
          >
            אמת דומיין
          </a>
          <p style="color: #666;"> אם הכפתור לא עובד, העתק והדבק את הקישור הזה:</p>
          <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error in verification process:", error);
    throw error;
  }
}

export async function verifyDomain(token: string) {
  try {
    await connectDB();
    console.log("Verifying token:", token);

    // Find user with this verification token
    const user = await User.findOne({
      "verification.token": token,
      "verification.expires": { $gt: new Date() },
    });

    //check if its the current logged in user
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (user?.id !== userId) {
      throw new Error("User mismatch! token doesnt belong");
    }

    console.log("Found user:", user ? "Yes" : "No");

    if (!user) {
      throw new Error("Invalid or expired verification token");
    }

    const websiteUrl = user.verification.websiteUrl;
    const businessName = user.verification.businessName;

    // Clean the URL to match storage format
    const cleanUrl = websiteUrl
      .toLowerCase()
      .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
      .split("/")[0]
      .split(":")[0];

    console.log("Clean URL:", cleanUrl);

    // Update website and user only if not already verified
    // if (!user.isVerifiedWebsiteOwner) {
    const website = await Website.findOneAndUpdate(
      { url: cleanUrl },
      {
        $set: {
          url: cleanUrl,
          isVerified: true,
          owner: user._id,
          verifiedAt: new Date(),
          name: businessName,
        },
      },
      { upsert: true, new: true }
    );
    // }
    await User.findByIdAndUpdate(user._id, {
      $set: {
        isWebsiteOwner: true,
        isVerifiedWebsiteOwner: true,
      },
    });

    return { success: true, websiteUrl };
  } catch (error) {
    console.error("Error verifying domain:", error);
    if (error instanceof Error) {
      throw new Error(`Verification failed: ${error.message}`);
    }
    throw new Error("Failed to verify domain");
  }
}
