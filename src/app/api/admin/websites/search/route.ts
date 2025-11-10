import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Website from "@/lib/models/Website";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    // Search websites by name or URL
    const websites = await Website.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { url: { $regex: query, $options: "i" } },
      ],
    })
      .select("_id name url logo")
      .limit(10)
      .lean();

    return NextResponse.json(websites);
  } catch (error: any) {
    console.error("Error searching websites:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
