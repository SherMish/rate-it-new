import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ToolAnalytics from "@/lib/models/ToolAnalytics";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get("websiteId");
    const eventType = searchParams.get("eventType");

    if (!websiteId || !eventType) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    await connectDB();

    const analytics = await ToolAnalytics.find({
      websiteId,
      eventType,
    });

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
