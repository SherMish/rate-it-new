import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { error, route } = await req.json();

    console.error(`[Error Logged] Route: ${route}, Message: ${error}`);

    // Optionally, send this error via email using Resend, SendGrid, or another service
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "noreply@ai-radar.co",
        to: "admin@ai-radar.co",
        subject: "NextAuth Error Alert",
        html: `<p>Error in route: ${route}</p><p>${error}</p>`,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to log auth error:", err);
    return NextResponse.json({ error: "Failed to log error" }, { status: 500 });
  }
}