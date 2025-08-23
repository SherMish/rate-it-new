export const revalidate = 60; // Update every 60 seconds

import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  Star,
  Calendar,
  ExternalLink,
  CreditCard,
  Code2,
  Clock,
  ArrowRight,
  Radar as RadarIcon,
  Info,
  Award,
  ThumbsUp,
  Sparkles,
  AlertTriangle,
  Facebook,
  Instagram,
  Twitter,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import connectDB from "@/lib/mongodb";
import Website from "@/lib/models/Website";
import Review from "@/lib/models/Review";
import { Types } from "mongoose";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import categoriesData from "@/lib/data/categories.json";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { ReviewsSection } from "@/components/reviews-section";
import Link from "next/link";
import { Document } from "mongoose";
import { Card } from "@/components/ui/card";
import WriteReviewButton from "@/app/components/WriteReviewButton";
import { PricingModel } from "@/lib/types/website";
import { WebsiteCard } from "@/components/website-card";
import { SuggestedToolCard } from "@/components/suggested-tool-card";
import { ClaimToolButton } from "@/app/components/claim-tool-button";
import { trackEvent } from "@/lib/analytics";
import {
  VisitToolButtonDesktop,
  VisitToolButtonMobile,
} from "@/app/components/VisitToolButton";
import { TrackPageVisit } from "@/app/components/TrackPageVisit";
import trustStatuses from "@/lib/data/trustStatuses.json";
import { FaTiktok } from "react-icons/fa6";
import SocialMediaSection from "@/app/components/SocialMediaSection";
import { VerifiedBadge } from "@/components/verified-badge";
import "@/lib/models/User"; // Ensure User model is registered before populate calls
import { WriteFirstReviewButton } from "./components/WriteFirstReviewButton";
import { WebsiteLogo } from "@/components/website-logo";
import { TruncatedDescription } from "./components/TruncatedDescription";
import RatingTiles from "@/components/ui/rating-tiles";

interface WebsiteDoc {
  _id: Types.ObjectId;
  name: string;
  url: string;
  isVerified: boolean;
  relatedCategory: { name: string };
  owner: { name: string };
  radarTrust?: number;
  pricingModel?: PricingModel;
}

interface ReviewDoc extends Document {
  _id: Types.ObjectId;
  title: string;
  body: string;
  rating: number;
  createdAt: Date;
  isVerified: boolean;
  relatedWebsite: Types.ObjectId;
  relatedUser?: { _id: Types.ObjectId; name: string; image?: string };
  helpfulCount?: number;
  businessResponse?: {
    text: string;
    lastUpdated: Date;
  };
}

interface Review {
  _id: string;
  title: string;
  body: string;
  rating: number;
  createdAt: string;
  helpfulCount?: number;
  relatedUser?: {
    name: string;
  };
  isVerified?: boolean;
}

interface PageProps {
  params: {
    url: string;
  };
}

// Consolidated data fetching function with error handling and optimization
async function getToolPageData(url: string) {
  try {
    await connectDB();

    // Single aggregation pipeline to get website with all related data
    const websiteWithStats = await Website.aggregate([
      { $match: { url: url } },
      {
        $lookup: {
          from: "reviews",
          localField: "_id", 
          foreignField: "relatedWebsite",
          as: "reviews",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "relatedUser",
                foreignField: "_id",
                as: "user",
                pipeline: [{ $project: { name: 1 } }]
              }
            },
            {
              $addFields: {
                relatedUser: { $arrayElemAt: ["$user", 0] }
              }
            },
            {
              $project: {
                title: 1,
                body: 1,
                rating: 1,
                createdAt: 1,
                helpfulCount: 1,
                isVerified: 1,
                businessResponse: 1,
                relatedUser: 1
              }
            },
            { $sort: { createdAt: -1 } }
          ]
        }
      },
      {
        $addFields: {
          reviewCount: { $size: "$reviews" },
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: { $avg: "$reviews.rating" },
              else: 0
            }
          }
        }
      }
    ]);

    if (!websiteWithStats || websiteWithStats.length === 0) {
      notFound();
    }

    const website = websiteWithStats[0];

    // Process categories from JSON data
    const categoryDataList = website.categories
      ? website.categories
          .map((categoryId: string) => {
            const categoryData = categoriesData.categories.find(
              (cat) => cat.id === categoryId
            );
            if (categoryData) {
              const Icon = categoryData.icon
                ? (Icons[categoryData.icon as keyof typeof Icons] as LucideIcon)
                : null;
              return {
                ...categoryData,
                Icon: Icon as LucideIcon,
              };
            }
            return null;
          })
          .filter(Boolean)
      : [];

    // Process reviews data
    const processedReviews = website.reviews.map((review: any) => ({
      _id: review._id.toString(),
      title: review.title,
      body: review.body,
      rating: review.rating,
      helpfulCount: review.helpfulCount,
      createdAt: review.createdAt.toISOString(),
      relatedUser: review.relatedUser
        ? {
            name: review.relatedUser.name,
          }
        : undefined,
      isVerified: review.isVerified || false,
      businessResponse: review.businessResponse ?? undefined,
    }));

    // Get suggested tools in the same query if we have a category
    let suggestedTools: any[] = [];
    if (categoryDataList.length > 0) {
      try {
        suggestedTools = await Website.find({
          url: { $ne: url },
          categories: categoryDataList[0].id,
        })
          .select("name url description averageRating reviewCount logo isVerified")
          .limit(3)
          .lean();
      } catch (error) {
        console.error("Error fetching suggested tools:", error);
        // Continue without suggested tools rather than failing
      }
    }

    return {
      website: {
        ...website,
        _id: website._id.toString(),
        averageRating: Math.round((website.averageRating || 0) * 10) / 10,
        categories: categoryDataList,
        category: categoryDataList[0] || null,
        pricingModel: website.pricingModel || PricingModel.BASIC,
      },
      reviews: processedReviews,
      suggestedTools: suggestedTools.map(tool => ({
        ...tool,
        _id: tool._id.toString()
      })),
    };
  } catch (error) {
    console.error("Database error in getToolPageData:", error);
    
    // For development, you might want to throw the error
    if (process.env.NODE_ENV === 'development') {
      throw error;
    }
    
    // In production, return a graceful fallback or redirect to error page
    notFound();
  }
}

// Remove the old inefficient functions
// async function getWebsiteData(url: string) { ... } - REMOVED
// const getReviews = async (websiteId: string) => { ... } - REMOVED
// async function getSuggestedTools(...) { ... } - REMOVED

function getRatingStatus(rating: number): { label: string; color: string } {
  if (rating === 0) return { label: "ניטרלי", color: "text-zinc-500" };
  // 4.5–5.0 dark green – Excellent
  if (rating >= 4.5) return { label: "מצוין", color: "text-emerald-600" };
  // 4.0–4.4 light green – Very Good
  if (rating >= 4.0) return { label: "טוב מאוד", color: "text-emerald-500" };
  // 3.0–3.9 amber – Good
  if (rating >= 3.0) return { label: "טוב", color: "text-amber-500" };
  // 2.0–2.9 orange-red – Poor
  if (rating >= 2.0) return { label: "מתחת לממוצע", color: "text-orange-600" };
  // 1.0–1.9 red – Very Poor
  if (rating >= 1.0) return { label: "חלש", color: "text-red-600" };
  return { label: "ניטרלי", color: "text-zinc-500" };
}

// Create a pure metadata generator without database operations
function generateToolMetadata(
  website: any, 
  reviews: any[], 
  params: { url: string }
): Metadata {
  if (!website) {
    return {
      title: "עסק לא נמצא | רייט-איט",
    };
  }

  const averageRating = website.averageRating?.toFixed(1) || "0.0";
  const reviewCount = website.reviewCount || 0;
  const reviewText = `${reviewCount} ${
    reviewCount === 1 ? "ביקורת" : "ביקורות"
  }`;
  const categoryName = website.category?.name || "עסקים";

  // Better title that includes search intent
  const title =
    reviewCount > 0
      ? `${website.name} ביקורות - ${averageRating}★ (${reviewText}) | רייט-איט`
      : `${website.name} ביקורות - האם כדאי? | רייט-איט`;

  // More compelling description that addresses buyer concerns
  const description =
    reviewCount > 0
      ? `לפני שקונים ב${website.name} - קראו ${reviewText} של לקוחות אמיתיים. דירוג ${averageRating}/5 כוכבים. בדקו מה אומרים על איכות ושירות.`
      : `מתכננים לקנות ב${website.name}? בדקו ביקורות וחוות דעת לקוחות לפני הרכישה. קראו על איכות השירות והמוצרים.`;

  // Enhanced keywords targeting purchase intent and common search patterns
  const keywords = [
    `${website.name} ביקורות`,
    `${website.name} חוות דעת`,
    `${website.name} האם כדאי`,
    `ביקורות ${website.name}`,
    `חוות דעת ${website.name}`,
    `האם כדאי ${website.name}`,
    `${website.name} ביקורות לקוחות`,
    `${website.name} דעות`,
    `קנייה ב${website.name}`,
    `אמינות ${website.name}`,
    `${website.name} איכות שירות`,
    categoryName.toLowerCase(),
    "ביקורות לפני קנייה",
    "חוות דעת לקוחות",
    "דירוגי אתרים",
    "קנייה בטוחה אונליין",
  ].filter(Boolean);

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: `${website.name} ביקורות - כדאי לקנות?`,
      description:
        reviewCount > 0
          ? `${reviewText} אמיתיות על ${website.name}. דירוג ${averageRating}/5. קראו לפני הקנייה!`
          : `ביקורות וחוות דעת על ${website.name}. בדקו לפני הקנייה!`,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/tool/${params.url}`,
      siteName: "רייט-איט",
      locale: "he_IL",
      // images: [
      //   {
      //     url:
      //       website.logo || `${process.env.NEXT_PUBLIC_APP_URL}/logo_new.png`,
      //     width: 1200,
      //     height: 630,
      //     alt: `${website.name} - ביקורות וחוות דעת`,
      //   },
      // ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${website.name} ביקורות - ${averageRating}★`,
      description:
        reviewCount > 0
          ? `${reviewText} אמיתיות. קראו לפני הקנייה!`
          : `ביקורות וחוות דעת על ${website.name}`,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/tool/${params.url}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// Simplified generateMetadata that provides basic fallback metadata
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const decodedUrl = decodeURIComponent(params.url);
  
  // Provide basic metadata without database operations
  // The actual dynamic metadata will be handled by the page component
  return {
    title: `ביקורות עסק | רייט-איט`,
    description: "קראו ביקורות אמיתיות על עסקים דיגיטליים בישראל לפני הקנייה",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/tool/${params.url}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Add export for static params if you want to pre-render some pages
export async function generateStaticParams() {
  await connectDB();
  const websites = await Website.find()
    .select("url")
    .limit(100) // Limit to most important tools
    .lean();

  return websites.map((website) => ({
    url: website.url,
  }));
}

// Function to get trust status based on score
function getTrustStatus(score: number) {
  const status = trustStatuses.find(
    (status) => score >= status.from && score <= status.to
  );
  return (
    status || {
      status: "לא מדורג",
      description: "עסק זה עדיין לא דורג.",
    }
  );
}

// Function to get the appropriate icon based on trust level
function getTrustStatusIcon(score: number) {
  if (score >= 8.6) return Award; // מוביל בתעשייה
  if (score >= 7.1) return ThumbsUp; // מאושר שוק
  if (score >= 5.1) return Sparkles; // שחקן מתפתח
  return AlertTriangle; // אמון שוק נמוך
}

function formatWhatsAppLink(whatsapp: string): string {
  if (!whatsapp) return "";

  // If it's already a full URL (including WhatsApp API links), return as is
  if (
    whatsapp.startsWith("https://wa.me/") ||
    whatsapp.startsWith("http://wa.me/") ||
    whatsapp.startsWith("https://api.whatsapp.com/send/") ||
    whatsapp.startsWith("http://api.whatsapp.com/send/")
  ) {
    return whatsapp;
  }

  // Remove all non-digit characters
  const numbersOnly = whatsapp.replace(/[^\d]/g, "");

  // If it starts with 0, replace with 972 (Israel country code)
  if (numbersOnly.startsWith("0")) {
    return `https://wa.me/972${numbersOnly.slice(1)}`;
  }

  // If it already starts with 972 or any other country code, keep as is
  return `https://wa.me/${numbersOnly}`;
}

export default async function ToolPage({ params }: PageProps) {
  const decodedUrl = decodeURIComponent(params.url);
  
  // Single consolidated database operation
  const { website, reviews, suggestedTools } = await getToolPageData(decodedUrl);

  const ratingStatus = getRatingStatus(website.averageRating || 0);

  // Add structured data for rich results
  const positiveReviews = reviews?.filter((review: any) => review.rating > 3) || [];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: website.name,
    description: website.description,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/tool/${params.url}`,
    aggregateRating:
      website.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: website.averageRating,
            reviewCount: website.reviewCount,
            bestRating: "5",
            worstRating: "1",
          }
        : undefined,
    review: positiveReviews.map((review: any) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: "5",
        worstRating: "1",
      },
      author: {
        "@type": "Person",
        name: review.relatedUser?.name || "לקוח מאומת",
      },
      reviewBody: review.body,
      datePublished: review.createdAt,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Tracking component */}
      <TrackPageVisit websiteId={website._id.toString()} />
      <div className="min-h-screen bg-background relative" dir="rtl">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,#3b82f615,transparent_70%),radial-gradient(ellipse_at_bottom,#6366f115,transparent_70%)] pointer-events-none" />

        <div className="relative container max-w-6xl mx-auto py-6 lg:py-8">
          {/* Header Section */}
          <div className="bg-white rounded-xl border border-border shadow-sm mb-6">
            <div className="p-6 space-y-6">
              {/* Logo and Basic Info */}
              <div>
                <div className="flex flex-col gap-3 lg:gap-0">
                  {/* Mobile Layout */}
                  <div className="lg:hidden">
                    <div className="flex items-start gap-4 mb-3" style={{ height: "75px" }}>
                      <WebsiteLogo
                        logo={website.logo}
                        name={website.name}
                        size="lg"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-center h-full gap-1">
                        <h1
                          className="text-2xl font-bold leading-tight"
                          style={{ fontFamily: "inherit" }}
                        >
                          {website.name}
                        </h1>
                        <div className="flex justify-start">
                          <VerifiedBadge
                            isVerified={website.isVerified ?? false}
                            pricingModel={website.pricingModel ?? PricingModel.BASIC}
                            licenseValidDate={website.licenseValidDate}
                            isVerifiedByRateIt={website.isVerifiedByRateIt ?? false}
                            showUnverified={true}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tags Row - Categories only */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-4">
                      {/* Categories as individual tags */}
                      {website.categories &&
                        website.categories.length > 0 &&
                        website.categories.map((category: any, index: number) =>
                          category ? (
                            <Link
                              key={category.id}
                              href={`/category/${category.id}`}
                              className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground transition-colors bg-muted/50 px-2 py-1 rounded-md"
                              style={{ fontFamily: "inherit" }}
                            >
                              {category.Icon && (
                                <category.Icon className="w-3 h-3" />
                              )}
                              <span>{category.name}</span>
                            </Link>
                          ) : null
                        )}
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden lg:flex items-start gap-6">
                    <WebsiteLogo
                      logo={website.logo}
                      name={website.name}
                      size="lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between flex-col lg:flex-row gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h1
                              className="text-3xl font-bold"
                              style={{ fontFamily: "inherit" }}
                            >
                              {website.name}
                            </h1>
                            <VerifiedBadge
                              isVerified={website.isVerified ?? false}
                              pricingModel={
                                website.pricingModel ?? PricingModel.BASIC
                              }
                              licenseValidDate={website.licenseValidDate}
                              isVerifiedByRateIt={
                                website.isVerifiedByRateIt ?? false
                              }
                              showUnverified={true}
                            />
                          </div>
                          {website.categories &&
                            website.categories.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {website.categories.map((category: any, index: number) =>
                                  category ? (
                                    <Link
                                      key={category.id}
                                      href={`/category/${category.id}`}
                                      className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground transition-colors bg-muted/50 px-2 py-1 rounded-md"
                                      style={{ fontFamily: "inherit" }}
                                    >
                                      {category.Icon && (
                                        <category.Icon className="w-3 h-3" />
                                      )}
                                      <span>{category.name}</span>
                                    </Link>
                                  ) : null
                                )}
                              </div>
                            )}
                        </div>
                        <div className="hidden lg:flex flex-row gap-3">
                          <VisitToolButtonMobile
                            websiteId={website._id.toString()}
                            url={website.url}
                            buttonText="בקר באתר"
                          />
                          <WriteReviewButton
                            url={params.url}
                            buttonText="כתוב ביקורת"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile buttons - Write Review as full width CTA */}
                  <div className="lg:hidden space-y-3">
                    <WriteReviewButton
                      url={params.url}
                      buttonText="כתוב ביקורת"
                      className="w-full"
                    />
                    <div className="flex justify-center">
                      <VisitToolButtonDesktop
                        websiteId={website._id.toString()}
                        url={website.url}
                        buttonText="בקר באתר"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Overview */}
              <div className="p-4 rounded-lg border border-border bg-background/50">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                  {/* User Rating Column - Only show if there are reviews */}
                  {website.reviewCount > 0 && (
                    <div className="flex flex-col items-center justify-center text-center md:w-48">
                      <div className="text-5xl font-bold mb-2">
                        {website.averageRating
                          ? website.averageRating.toFixed(1)
                          : "0"}
                      </div>
                      <div className="mb-2">
                        <RatingTiles
                          value={website.averageRating || 0}
                          size={24}
                          starFontSize={16}
                          gap={2}
                          filledColor="#494bd6"
                          emptyColor="#e2e8f0"
                          tileRadius={4}
                          useDynamicColor
                        />
                      </div>
                      <div
                        className={`text-sm font-medium ${ratingStatus.color} mb-1`}
                      >
                        {ratingStatus.label}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        על בסיס {website.reviewCount} ביקורות
                      </div>
                    </div>
                  )}

                  {/* Description Column */}
                  <div className="flex-1 space-y-1">
                    <h3
                      className="text-lg font-semibold"
                      style={{ fontFamily: "inherit" }}
                    >
                      אודות {website.name}
                    </h3>
                    <div className="space-y-4 text-muted-foreground">
                      {website.description ? (
                        <>
                          {/* Mobile: Truncated description */}
                          <div className="md:hidden">
                            <TruncatedDescription
                              description={website.description}
                              maxLength={150}
                              style={{ fontFamily: "inherit" }}
                            />
                          </div>
                          {/* Desktop: Full description */}
                          <div className="hidden md:block">
                            <p style={{ fontFamily: "inherit" }}>
                              {website.description}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <p style={{ fontFamily: "inherit" }}>תיאור לא זמין</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Reviews Section */}
              <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                {reviews.length > 0 ? (
                  <ReviewsSection reviews={reviews} />
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      אין ביקורות עדיין
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      היה הראשון לשתף את החוויה שלך עם {website.name} ועזור
                      לאחרים לקבל החלטות מושכלות.
                    </p>
                    <WriteFirstReviewButton toolUrl={params.url} />
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Social Media */}
              {website.socialUrls &&
                Object.values(website.socialUrls).some((url) => url) && (
                  <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                    <SocialMediaSection socialUrls={website.socialUrls} />
                  </div>
                )}

              {/* Contact Information */}
              {website.contact &&
                (website.contact.email ||
                  website.contact.phone ||
                  website.contact.whatsapp) && (
                  <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">יצירת קשר</h3>
                    <div className="space-y-4">
                      {website.contact.email && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-blue-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              אימייל
                            </div>
                            <a
                              href={`mailto:${website.contact.email}`}
                              className="text-sm text-foreground hover:text-primary transition-colors underline"
                            >
                              {website.contact.email}
                            </a>
                          </div>
                        </div>
                      )}

                      {website.contact.phone && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-green-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              טלפון
                            </div>
                            <a
                              href={`tel:${website.contact.phone}`}
                              className="text-sm text-foreground hover:text-primary transition-colors underline"
                            >
                              {website.contact.phone}
                            </a>
                          </div>
                        </div>
                      )}

                      {website.contact.whatsapp && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-green-600"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.513" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              וואטסאפ
                            </div>
                            <a
                              href={formatWhatsAppLink(
                                website.contact.whatsapp
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-foreground hover:text-primary transition-colors underline"
                            >
                              שלח הודעה
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Details Card */}
              {(website.launchYear || website.address) && (
                <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">פרטים נוספים</h3>
                  <div className="space-y-4">
                    {website.launchYear && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            שנת השקה
                          </div>
                          <div className="font-medium">
                            {website.launchYear}
                          </div>
                        </div>
                      </div>
                    )}

                    {website.address && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Globe className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            כתובת
                          </div>
                          <div>{website.address}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Similar Tools */}
              {suggestedTools.length > 0 && (
                <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">עסקים דומים</h3>
                  <div className="space-y-3">
                    {suggestedTools.map((tool) => (
                      <SuggestedToolCard
                        key={tool._id.toString()}
                        website={tool}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Claim ownership section */}
              {!website.isVerified && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-800 mb-2">
                        האם אתם הבעלים של עסק זה?
                      </p>
                      <ClaimToolButton websiteUrl={website.url} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
