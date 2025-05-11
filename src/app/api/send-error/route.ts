import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const maxDuration = 10; // Set max duration to 10 seconds
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { message, stack, url, userAgent } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Missing error message" }, { status: 400 });
    }

    console.log("🚨 Captured Error:", message);
    console.log("📍 Error Location:", url);
    console.log("💻 User Agent:", userAgent);

    // Send the error report via email with a timeout
    await Promise.race([
      resend.emails.send({
        from: "alerts@ai-radar.co",
        to: "info.airadar@gmail.com", // Replace with your email
        subject: "🚨 AI-Radar Error Report",
        html: `
          <h2>🚨 AI-Radar Error Alert</h2>
          <p><strong>Error Message:</strong> ${message}</p>
          <p><strong>Stack Trace:</strong></p>
          <pre style="background: #eee; padding: 10px; border-radius: 5px;">${stack || "No stack trace available"}</pre>
          <p><strong>📍 Page URL:</strong> ${url}</p>
          <p><strong>💻 User Agent:</strong> ${userAgent}</p>
          <p><strong>🕒 Time:</strong> ${new Date().toLocaleString()}</p>
        `,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email sending timeout")), 5000)
      ),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("🚨 Error reporting failed:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to send error report", details: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to send error report", details: "Unknown error" },
        { status: 500 }
      );
    }
  }
}