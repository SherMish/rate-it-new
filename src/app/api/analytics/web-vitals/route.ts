import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

// Web Vitals Schema
const WebVitalsSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  value: { type: Number, required: true },
  rating: { type: String, enum: ['good', 'needs-improvement', 'poor'], required: true },
  id: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
  url: { type: String, required: true },
  userAgent: { type: String },
  sessionId: { type: String },
}, {
  timestamps: true,
});

// Create compound index for better query performance
WebVitalsSchema.index({ name: 1, timestamp: -1 });
WebVitalsSchema.index({ rating: 1, name: 1 });

const WebVitals = mongoose.models.WebVitals || mongoose.model('WebVitals', WebVitalsSchema);

export async function POST(req: Request) {
  try {
    const {
      name,
      value,
      rating,
      id,
      timestamp,
      url,
      userAgent,
    } = await req.json();

    // Validate required fields
    if (!name || typeof value !== 'number' || !rating || !id || !url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate metric name
    const validMetrics = ['CLS', 'FID', 'FCP', 'LCP', 'TTFB', 'INP'];
    if (!validMetrics.includes(name)) {
      return NextResponse.json(
        { error: "Invalid metric name" },
        { status: 400 }
      );
    }

    // Validate rating
    const validRatings = ['good', 'needs-improvement', 'poor'];
    if (!validRatings.includes(rating)) {
      return NextResponse.json(
        { error: "Invalid rating" },
        { status: 400 }
      );
    }

    await connectDB();

    // Create new Web Vitals record
    const webVitalsRecord = new WebVitals({
      name,
      value,
      rating,
      id,
      timestamp: new Date(timestamp || Date.now()),
      url,
      userAgent,
    });

    await webVitalsRecord.save();

    return NextResponse.json({ 
      success: true, 
      message: "Web Vitals data saved successfully",
      data: {
        name,
        value,
        rating,
        timestamp: webVitalsRecord.timestamp,
      }
    });

  } catch (error) {
    console.error("Error saving Web Vitals data:", error);
    return NextResponse.json(
      { error: "Failed to save Web Vitals data" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const metric = searchParams.get("metric");
    const rating = searchParams.get("rating");
    const limit = parseInt(searchParams.get("limit") || "100");
    const days = parseInt(searchParams.get("days") || "7");

    await connectDB();

    // Build query
    const query: any = {};
    
    if (metric) {
      query.name = metric;
    }
    
    if (rating) {
      query.rating = rating;
    }

    // Filter by date range
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);
    query.timestamp = { $gte: dateLimit };

    // Get Web Vitals data
    const webVitalsData = await WebVitals
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    // Get aggregated statistics
    const stats = await WebVitals.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            name: "$name",
            rating: "$rating"
          },
          count: { $sum: 1 },
          avgValue: { $avg: "$value" },
          minValue: { $min: "$value" },
          maxValue: { $max: "$value" }
        }
      },
      {
        $group: {
          _id: "$_id.name",
          ratings: {
            $push: {
              rating: "$_id.rating",
              count: "$count",
              avgValue: "$avgValue",
              minValue: "$minValue",
              maxValue: "$maxValue"
            }
          },
          totalCount: { $sum: "$count" }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: webVitalsData,
      stats,
      summary: {
        totalRecords: webVitalsData.length,
        dateRange: {
          from: dateLimit,
          to: new Date()
        }
      }
    });

  } catch (error) {
    console.error("Error fetching Web Vitals data:", error);
    return NextResponse.json(
      { error: "Failed to fetch Web Vitals data" },
      { status: 500 }
    );
  }
}
