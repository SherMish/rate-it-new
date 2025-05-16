export const revalidate = 200; // Update every 10 seconds

import { useState, useRef, useEffect } from "react";
import {
  Search,
  PlusCircle,
  Star,
  MessageSquare,
  Image as ImageIcon,
  Code,
  Music,
  Video,
  Database,
  Brain,
  Sparkles,
  Palette,
  Bot,
  Shield,
  Radar as RadarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { Review, Website } from "@/lib/models";
import connectDB from "@/lib/mongodb";
import { SearchSection } from "./components/search-section";
import { CategoriesSection } from "./components/categories-section";

import { Metadata } from "next";
import { Types, Document } from "mongoose";

import { LatestToolCard } from "@/app/components/latest-tool-card";
import { LatestToolsContent } from "@/app/components/latest-tools-content";

const categories = [
  { name: "יצירת טקסט", icon: MessageSquare, count: 156 },
  { name: "יצירת תמונות", icon: ImageIcon, count: 89 },
  { name: "יצירת קוד", icon: Code, count: 67 },
  { name: "עיבוד אודיו", icon: Music, count: 45 },
  { name: "יצירת וידאו", icon: Video, count: 34 },
  { name: "ניתוח נתונים", icon: Database, count: 78 },
  { name: "למידת מכונה", icon: Brain, count: 92 },
  { name: "כלים יצירתיים", icon: Palette, count: 123 },
  { name: "אוטומציה", icon: Bot, count: 56 },
  { name: "בינה מלאכותית כללית", icon: Sparkles, count: 145 },
];

interface ReviewDoc extends Document {
  _id: Types.ObjectId;
  body: string;
  rating: number;
  createdAt: Date;
  relatedWebsite: {
    _id: Types.ObjectId;
    name: string;
    url: string;
  };
  relatedUser?: {
    _id: Types.ObjectId;
    name: string;
  };
  __v: number;
}

async function getLatestReviews() {
  await connectDB();

  const reviews = await Review.find()
    .populate("relatedWebsite", "name url")
    .populate("relatedUser", "name")
    .sort({ createdAt: -1 })
    .limit(10)
    .lean<ReviewDoc[]>();

  return reviews.map((review) => ({
    ...review,
    _id: review._id.toString(),
    relatedWebsite: {
      ...review.relatedWebsite,
      _id: review.relatedWebsite._id.toString(),
    },
    relatedUser: review.relatedUser
      ? {
          name: review.relatedUser.name,
        }
      : undefined,
  }));
}

interface Suggestion {
  _id: string;
  name: string;
  url: string;
}

async function getLatestTools(limit = 6) {
  await connectDB();

  const tools = await Website.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return tools;
}

export const metadata: Metadata = {
  title: "AI Tools Directory & Reviews | Find the Best AI Tools, AI Radar",
  description:
    "Discover and compare the best AI tools with authentic user reviews. Find AI software for content creation, image generation, coding, productivity, and more. Real ratings and user experiences.",
  keywords: [
    "best AI tools",
    "AI software reviews",
    "top AI tools",
    "artificial intelligence tools",
    "AI tool comparison",
    "AI software directory",
    "ChatGPT alternatives",
    "AI image generators",
    "AI writing tools",
    "AI coding tools",
    "AI productivity tools",
    "best AI software",
    "AI tools for business",
    "AI tool ratings",
    "AI software recommendations",
    "user-reviewed AI tools",
    "AI tool reviews",
    "AI software comparison",
    "best AI applications",
    "top-rated AI software",
  ],
  openGraph: {
    type: "website",
    title: "Find the Best AI Tools - User Reviews & Ratings",
    description:
      "Compare top AI tools with authentic user reviews. Discover AI software for content creation, image generation, coding, and more.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "AI Tools Directory",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "AI Tools Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find the Best AI Tools - User Reviews & Ratings",
    description:
      "Compare top AI tools with authentic user reviews. Discover the best AI software for your needs.",
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/og-image.png`],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
};

// Add structured data for rich results
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ספריית כלי בינה מלאכותית",
  description:
    "מצא והשווה את כלי הבינה מלאכותית הטובים ביותר עם ביקורות אמיתיות",
  url: process.env.NEXT_PUBLIC_APP_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  about: {
    "@type": "Thing",
    name: "כלי בינה מלאכותית",
    description:
      "ספריית כלים ואפליקציות מבוססי בינה מלאכותית עם ביקורות משתמשים",
  },
};

export default async function Home() {
  const latestReviews = await getLatestReviews();
  const latestTools = await getLatestTools();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="relative min-h-screen" dir="rtl">
        {/* Main background gradient */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,#3b82f620,transparent_70%),radial-gradient(ellipse_at_bottom,#6366f115,transparent_70%)] pointer-events-none" />

        {/* Radar Section */}
        <div className="absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center -z-10">
          <div className="relative w-[200px] h-[200px] mb-[182vh]">
            {/* <RadarAnimation /> */}
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          {/* Search Section - Added px-4 for mobile padding */}
          <div className="pt-12 px-4 sm:px-6 lg:px-8">
            <SearchSection />
          </div>

          {/* Add Tool Section - Subtle Version */}
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto flex items-center justify-center"></div>
          </div>

          {/* Categories Section - Added px-4 for mobile padding */}
          <div className="px-4 sm:px-6 lg:px-8">
            <CategoriesSection />
          </div>

          {/* Latest Reviews Section - Added px-4 for mobile padding */}
          {/* <div className="px-4 sm:px-6 lg:px-8">
            <LatestReviewsCarousel reviews={latestReviews} />
          </div> */}

          {/* Latest Tools Section */}
          <section className="py-12 bg-secondary/80 border-y border-border/50">
            <div className="container max-w-6xl mx-auto px-4">
              <div className="grid lg:grid-cols-[1fr,400px] gap-12">
                {/* Right Column - Content (was Left) */}
                <div className="grid gap-6 md:grid-cols-2 order-2 lg:order-1">
                  {latestTools.map((tool, index) => (
                    <LatestToolCard
                      key={tool._id.toString()}
                      website={tool}
                      index={index}
                    />
                  ))}
                </div>

                {/* Left Column - Cards (was Right) */}
                <div className="order-1 lg:order-2">
                  <LatestToolsContent />
                </div>
              </div>
            </div>
          </section>

          {/* Marketing Section - Added px-4 for mobile padding
          <div className="px-4 sm:px-6 lg:px-8">
            <MarketingSection />
          </div> */}

          {/* TrustRadar Section */}
        </div>
      </main>
      {/* <RandomBlogPosts /> */}
    </>
  );
}
