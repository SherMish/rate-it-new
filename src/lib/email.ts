import { Resend } from "resend";
import {
  createUnifiedEmailTemplate,
  getPlainTextFooter,
} from "./email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  // Add timeout to email sending like in forgot-password route
  return Promise.race([
    resend.emails.send({
      from: "no-reply@rate-it.co.il", // Match the working from address
      to,
      subject,
      html,
      text,
      react: null,
    }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Email sending timeout")), 5000)
    ),
  ]);
}

interface UnifiedEmailData {
  to: string;
  subject: string;
  title: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
  preheader?: string;
  additionalContent?: string;
}

export async function sendUnifiedEmail({
  to,
  subject,
  title,
  body,
  ctaText,
  ctaUrl,
  preheader,
  additionalContent,
}: UnifiedEmailData) {
  const { html, text } = createUnifiedEmailTemplate({
    subject,
    title,
    body,
    ctaText,
    ctaUrl,
    preheader,
    additionalContent,
  });

  return sendEmail({
    to,
    subject,
    html,
    text,
  });
}

export async function sendVerificationEmail(
  to: string,
  token: string,
  websiteName: string
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-ownership?token=${token}`;

  return sendUnifiedEmail({
    to,
    subject: `אימות בעלות על ${websiteName}`,
    title: "אימות בעלות על אתר",
    body: `אנא לחצו על הכפתור למטה כדי לאמת את הבעלות שלכם על <strong>${websiteName}</strong>.<br><br>
           <small style="color:#6b7280;">קישור זה יפוג תוך 24 שעות.</small>`,
    ctaText: "אמת בעלות",
    ctaUrl: verificationUrl,
    preheader: `אמת את הבעלות שלך על ${websiteName}`,
  });
}
