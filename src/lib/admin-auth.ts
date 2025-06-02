import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

const ADMIN_EMAILS = ["sharon.mishayev@gmail.com", "liamrose1220@gmail.com", "ed123@gmail.com"];

export async function checkAdminAuth(): Promise<NextResponse | null> {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
      return new NextResponse("Unauthorized - Admin access required", {
        status: 401,
      });
    }

    return null; // No error, user is authorized
  } catch (error) {
    console.error("Error checking admin auth:", error);
    return new NextResponse("Authentication error", { status: 500 });
  }
}

export function isAdminEmail(email: string | null | undefined): boolean {
  return email ? ADMIN_EMAILS.includes(email) : false;
}
