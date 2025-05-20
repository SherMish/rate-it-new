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
    subject: `Verify ownership of ${websiteName}`,
    html: `
      <h1>Website Ownership Verification</h1>
      <p>Please click the link below to verify your ownership of ${websiteName}:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 24 hours.</p>
    `,
  });
}
