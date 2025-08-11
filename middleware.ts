import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

interface CustomToken {
  role?: string;
  websites?: string;
  name?: string;
  email?: string;
}

export async function middleware(request: NextRequest) {
  // Add secret and secure cookie options
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  // For /business route (not dashboard)
  if (
    request.nextUrl.pathname === "/business" ||
    request.nextUrl.pathname === "/business/register"
  ) {
    console.log("in middleware", token, token?.role, token?.websites);
    // Check both role and websites to ensure complete setup
    if (token?.role === "business_owner" && token?.websites) {
      return NextResponse.redirect(new URL("/business/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // For dashboard routes
  if (request.nextUrl.pathname.startsWith("/business/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/business", request.url));
    }

    // Check both role and websites
    console.log("token.role", token)
    if (token.role !== "business_owner" || !token.websites) {
      return NextResponse.redirect(new URL("/business/register", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/business", "/business/register", "/business/dashboard/:path*"],
};
