import { Resend } from "resend";
import {
  createSimpleEmailTemplate,
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

export async function sendVerificationEmail(
  to: string,
  token: string,
  websiteName: string
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-ownership?token=${token}`;

  const htmlContent = createSimpleEmailTemplate(
    "אימות בעלות על אתר",
    `<p style="margin:0 0 24px 0;font-size:16px;line-height:1.6;color:#4b5563;">
      אנא לחצו על הקישור למטה כדי לאמת את הבעלות שלכם על <strong style="color:#111827;">${websiteName}</strong>:
    </p>
    <p style="margin:0 0 24px 0;font-size:14px;line-height:1.5;color:#6b7280;">
      קישור זה יפוג תוך 24 שעות.
    </p>`,
    "אמת בעלות",
    verificationUrl
  );

  const textContent = `אימות בעלות על אתר

אנא לחצו על הקישור הבא כדי לאמת את הבעלות שלכם על ${websiteName}:
${verificationUrl}

קישור זה יפוג תוך 24 שעות.${getPlainTextFooter()}`;

  return sendEmail({
    to,
    subject: `אימות בעלות על ${websiteName}`,
    html: htmlContent,
    text: textContent,
  });
}
