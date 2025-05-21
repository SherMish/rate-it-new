import { Resend } from "resend";

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

  return sendEmail({
    to,
    subject: `אימות בעלות על ${websiteName}`,
    html: `
      <h1>אימות בעלות על אתר</h1>
      <p>אנא לחצו על הקישור למטה כדי לאמת את הבעלות שלכם על ${websiteName}:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>קישור זה יפוג תוך 24 שעות.</p>
    `,
    text: `
  אימות בעלות על אתר
  
  אנא לחצו על הקישור הבא כדי לאמת את הבעלות שלכם על ${websiteName}:
  ${verificationUrl}
  
  קישור זה יפוג תוך 24 שעות.
    `,
  });
}
