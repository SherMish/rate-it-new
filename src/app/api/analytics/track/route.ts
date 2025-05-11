import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ToolAnalytics from "@/lib/models/ToolAnalytics";

export async function POST(req: Request) {
  await connectDB();
  const { websiteId, eventType} = await req.json();

  if (!websiteId) {
    return NextResponse.json({ error: "Missing websiteId" }, { status: 400 });
  }

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM 
  try {
    const analytics = await ToolAnalytics.findOneAndUpdate(
      { websiteId, month: currentMonth, eventType: eventType },
      { $inc: { visitors: 1 } }, // Increment visitor count
      { upsert: true, new: true }
    );
    return NextResponse.json({ success: true, visitors: analytics.visitors });
  } catch (error) {
    return NextResponse.json({ error: "Failed to track visit" }, { status: 500 });
  }
}