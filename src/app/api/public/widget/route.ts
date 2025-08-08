import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/lib/models/Review";
import Website from "@/lib/models/Website";

export const revalidate = 3600; // ISR hint

function addCors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

export async function OPTIONS() {
  return addCors(NextResponse.json({}, { status: 200 }));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get("websiteId");
    if (!websiteId) {
      return addCors(
        NextResponse.json({ error: "Missing websiteId" }, { status: 400 })
      );
    }

    await connectDB();

    const website = await Website.findById(websiteId).select("_id name url");
    if (!website) {
      return addCors(
        NextResponse.json({ error: "Website not found" }, { status: 404 })
      );
    }

    // Compute average rating and count
    const agg = await Review.aggregate([
      { $match: { relatedWebsite: website._id } },
      {
        $group: {
          _id: "$relatedWebsite",
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const averageRating = agg[0]?.avg || 0;
    const reviewCount = agg[0]?.count || 0;

    const body = { averageRating, reviewCount };
    const res = NextResponse.json(body, { status: 200 });

    // Cache for one hour at edge/CDN and allow public caching
    res.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=600"
    );

    return addCors(res);
  } catch (e) {
    console.error("Widget data error:", e);
    return addCors(
      NextResponse.json({ averageRating: 0, reviewCount: 0 }, { status: 200 })
    );
  }
}
