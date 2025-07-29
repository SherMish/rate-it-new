import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  // Token-based verification has been deprecated in favor of 6-digit code verification
  // Redirect users to the registration page to start the new verification process
  return NextResponse.redirect(new URL("/business/register", req.url));
}
