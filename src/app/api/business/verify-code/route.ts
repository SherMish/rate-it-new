import { NextResponse } from "next/server";
import { verifyCode } from "@/app/actions/verification";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: "Invalid code format. Code must be 6 digits." },
        { status: 400 }
      );
    }

    const result = await verifyCode(code);

    if (result.success) {
      return NextResponse.json({
        success: true,
        websiteUrl: result.websiteUrl,
      });
    } else {
      return NextResponse.json(
        { error: "Verification failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Code verification error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Verification failed";

    if (errorMessage.includes("Maximum attempts exceeded")) {
      return NextResponse.json(
        { error: "Maximum attempts exceeded", maxAttemptsExceeded: true },
        { status: 429 }
      );
    }

    if (errorMessage.includes("Invalid or expired")) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
