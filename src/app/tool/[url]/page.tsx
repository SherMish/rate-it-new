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

async function getWebsiteData(url: string) {
  await connectDB();

  // Get website data
  const website = await Website.findOne({ url: url }).lean();

  if (!website) {
    notFound();
  }

  // Calculate average rating and review count from reviews
  const reviews = await Review.find({ relatedWebsite: website._id });
  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviewCount
      : 0;

  // Update website with calculated stats
  await Website.findByIdAndUpdate(website._id, {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    reviewCount,
  });

  // Find the category data from categories.json
  const categoryData = categoriesData.categories.find(
    (cat) => cat.id === website.category
  );
  const Icon = categoryData?.icon
    ? (Icons[categoryData.icon as keyof typeof Icons] as LucideIcon)
    : null;

  return {
    ...website,
    pricingModel: (website.pricingModel as PricingModel) || PricingModel.FREE,
    _id: website._id.toString(),
    averageRating: Math.round(averageRating * 10) / 10,
    reviewCount,
    category: categoryData
      ? {
          ...categoryData,
          Icon: Icon as LucideIcon,
        }
      : null,
  };
}

const getReviews = async (websiteId: string) => {
  const reviews = await Review.find({ relatedWebsite: websiteId })
    .select(
      "title body rating createdAt helpfulCount relatedUser isVerified businessResponse"
    )
    .populate("relatedUser", "name")
    .lean<ReviewDoc[]>();

  return reviews.map((review) => ({
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
  })) as Review[];
};

function getRatingStatus(rating: number): { label: string; color: string } {
  if (rating === 0) return { label: "ניטרלי", color: "text-zinc-500" };
  if (rating >= 4.5) return { label: "מצוין", color: "text-emerald-500" };
  if (rating >= 4.0) return { label: "טוב מאוד", color: "text-green-500" };
  if (rating >= 3.5) return { label: "טוב", color: "text-blue-500" };
  if (rating >= 3.0) return { label: "ממוצע", color: "text-yellow-500" };
  if (rating >= 2.0) return { label: "מתחת לממוצע", color: "text-orange-500" };
  return { label: "חלש", color: "text-red-500" };
}

// Generate metadata for SEO
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const decodedUrl = decodeURIComponent(params.url);
  const website = await getWebsiteData(decodedUrl);

  if (!website) {
    return {
      title: "עסק לא נמצא",
    };
  }

  const averageRating = website.averageRating?.toFixed(1) || "אין";
  const reviewText = `${website.reviewCount} ${
    website.reviewCount === 1 ? "ביקורת" : "ביקורות"
  }`;

  return {
    title: `${website.name} ביקורות - ${averageRating}★ דירוג (${reviewText})`,
    description:
      website.description ||
      `קרא ${reviewText} על ${website.name}. דירוגי משתמשים, משוב, וביקורות מפורטות. דירוג ממוצע: ${averageRating} מתוך 5 כוכבים.`,
    keywords: [
      website.name,
      `${website.name} ביקורות`,
      `${website.name} דירוגים`,
      `${website.name} ביקורות משתמשים`,
      `${website.name} משוב`,
      website.category?.name || "",
      "ביקורות עסקים",
      "ביקורות שירות",
      "ביקורות משתמשים",
      "דירוגים וביקורות",
    ].filter(Boolean),
    openGraph: {
      title: `${website.name} - ביקורות ודירוגים`,
      description:
        website.description ||
        `קרא ביקורות ודירוגי משתמשים עבור ${website.name}. דירוג ממוצע: ${averageRating} מתוך 5 כוכבים על בסיס ${reviewText}.`,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/tool/${params.url}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${website.name} ביקורות ודירוגים`,
      description: `${averageRating}★ דירוג על בסיס ${reviewText}`,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/tool/${params.url}`,
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

async function getSuggestedTools(
  currentToolUrl: string,
  category: { id: string },
  limit = 3
) {
  try {
    const tools = await Website.find({
      url: { $ne: currentToolUrl }, // exclude current tool
      category: category.id, // use just the category ID
    })
      .limit(limit)
      .lean();

    return tools;
  } catch (error) {
    console.error("Error fetching suggested tools:", error);
    return [];
  }
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

// Function to get styles based on trust level
function getTrustStatusStyles(score: number) {
  if (score >= 8.6) {
    return {
      badge: "bg-blue-50 border-blue-200 text-blue-700",
      icon: "text-blue-600",
      gradient: "from-blue-100 to-blue-50",
    };
  }
  if (score >= 7.1) {
    return {
      badge: "bg-green-50 border-green-200 text-green-700",
      icon: "text-green-600",
      gradient: "from-green-100 to-green-50",
    };
  }
  if (score >= 5.1) {
    return {
      badge: "bg-yellow-50 border-yellow-200 text-yellow-700",
      icon: "text-yellow-600",
      gradient: "from-yellow-100 to-yellow-50",
    };
  }
  return {
    badge: "bg-red-50 border-red-200 text-red-700",
    icon: "text-red-600",
    gradient: "from-red-100 to-red-50",
  };
}

export default async function ToolPage({ params }: PageProps) {
  const decodedUrl = decodeURIComponent(params.url);
  const website = await getWebsiteData(decodedUrl);
  const reviews = await getReviews(website._id.toString());

  const ratingStatus = getRatingStatus(website.averageRating || 0);

  // Add structured data for rich results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: website.name,
    description: website.description,
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
    review:
      reviews && reviews.length > 0
        ? reviews.map((review) => ({
            "@type": "Review",
            reviewRating: {
              "@type": "Rating",
              ratingValue: review.rating,
            },
            author: {
              "@type": "Person",
              name: review.relatedUser?.name || "אנונימי",
            },
            reviewBody: review.body,
          }))
        : undefined,
  };

  const suggestedTools = website.category
    ? await getSuggestedTools(decodedUrl, website.category, 3)
    : [];

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

        <div className="relative container max-w-6xl mx-auto sm:px-4 py-8">
          <div className="rounded-lg border border-border bg-white shadow-sm">
            <div className="p-6 space-y-5">
              {/* Full width sections */}
              <div>
                {/* Header */}
                <div className="mb-8">
                  <div className="flex flex-col gap-6 lg:gap-0">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-[64px] h-[64px] rounded-xl bg-secondary border border-border flex items-center justify-center overflow-hidden">
                        {website.logo ? (
                          <Image
                            src={website.logo}
                            alt={website.name}
                            width={64}
                            height={64}
                            className="rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">
                              {website.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
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
                                  website.pricingModel ?? PricingModel.FREE
                                }
                                licenseValidDate={website.licenseValidDate}
                                isVerifiedByRateIt={
                                  website.isVerifiedByRateIt ?? false
                                }
                                showUnverified={true}
                              />
                            </div>
                            {website.category && (
                              <Link
                                href={`/category/${website.category.id}`}
                                className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground transition-colors"
                                style={{ fontFamily: "inherit" }}
                              >
                                {website.category.Icon && (
                                  <website.category.Icon className="w-4 h-4" />
                                )}
                                <span>{website.category.name}</span>
                              </Link>
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
                    <div className="grid grid-cols-2 gap-3 lg:hidden">
                      <VisitToolButtonDesktop
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

                {/* Rating Overview */}
                <div className="p-6 rounded-lg border border-border bg-background/50">
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* User Rating Column - Only show if there are reviews */}
                    {website.reviewCount > 0 && (
                      <div className="flex flex-col items-center justify-center text-center md:w-48">
                        <div className="text-5xl font-bold mb-2">
                          {website.averageRating
                            ? website.averageRating.toFixed(1)
                            : "0"}
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-6 h-6 ${
                                i < (website.averageRating || 0)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-zinc-300"
                              }`}
                            />
                          ))}
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
                          <p style={{ fontFamily: "inherit" }}>
                            {website.description}
                          </p>
                        ) : (
                          <>
                            <p style={{ fontFamily: "inherit" }}>
                              תיאור לא זמין
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Claim ownership section */}
              {!website.isVerified && (
                <div className="flex items-center text-muted-foreground text-sm">
                  <p className="ml-1">האם אתם הבעלים של עסק זה?</p>
                  <ClaimToolButton websiteUrl={website.url} />
                </div>
              )}

              {/* Two column layout for remaining content */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-6">
                <div>
                  {/* Details Section */}
                  <div className="mb-8">
                    {(website.launchYear ||
                      website.address ||
                      (website.contact &&
                        (website.contact.email ||
                          website.contact.phone ||
                          website.contact.whatsapp))) && (
                      <h2
                        className="text-2xl font-semibold mb-4"
                        style={{ fontFamily: "inherit" }}
                      >
                        פרטים
                      </h2>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {website.launchYear && (
                        <div className="p-4 bg-background/50 rounded-lg border border-border">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">
                                שנת השקה
                              </h3>
                              <p className="text-base mt-1">
                                {website.launchYear}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {website.address && (
                        <div className="p-4 bg-background/50 rounded-lg border border-border">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Globe className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">
                                כתובת
                              </h3>
                              <p className="text-base mt-1">
                                {website.address}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Contact Information */}
                    {website.contact &&
                      (website.contact.email ||
                        website.contact.phone ||
                        website.contact.whatsapp) && (
                        <div className="mt-6">
                          <h3
                            className="text-lg font-semibold mb-4"
                            style={{ fontFamily: "inherit" }}
                          >
                            יצירת קשר
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {website.contact.email && (
                              <div className="p-4 bg-background/50 rounded-lg border border-border">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                                    <svg
                                      className="w-4 h-4 text-gray-600"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <h4
                                      className="text-sm font-medium text-muted-foreground mb-1"
                                      style={{ fontFamily: "inherit" }}
                                    >
                                      אימייל
                                    </h4>
                                    <a
                                      href={`mailto:${website.contact.email}`}
                                      className="text-sm text-foreground hover:text-primary transition-colors underline-offset-4 underline"
                                      style={{ fontFamily: "inherit" }}
                                    >
                                      {website.contact.email}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            )}

                            {website.contact.phone && (
                              <div className="p-4 bg-background/50 rounded-lg border border-border">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                                    <svg
                                      className="w-4 h-4 text-gray-600"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <h4
                                      className="text-sm font-medium text-muted-foreground mb-1"
                                      style={{ fontFamily: "inherit" }}
                                    >
                                      טלפון
                                    </h4>
                                    <a
                                      href={`tel:${website.contact.phone}`}
                                      className="text-sm text-foreground hover:text-primary transition-colors underline-offset-4 underline"
                                      style={{ fontFamily: "inherit" }}
                                    >
                                      {website.contact.phone}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            )}

                            {website.contact.whatsapp && (
                              <div className="p-4 bg-background/50 rounded-lg border border-border">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                                    <svg
                                      className="w-4 h-4 text-gray-600"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.513" />
                                    </svg>
                                  </div>
                                  <div>
                                    <h4
                                      className="text-sm font-medium text-muted-foreground mb-1"
                                      style={{ fontFamily: "inherit" }}
                                    >
                                      וואטסאפ
                                    </h4>
                                    <a
                                      href={`https://wa.me/${website.contact.whatsapp.replace(
                                        /[^\d]/g,
                                        ""
                                      )}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-foreground hover:text-primary transition-colors underline-offset-4 underline"
                                      style={{ fontFamily: "inherit" }}
                                    >
                                      שלח הודעה
                                    </a>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Reviews Section */}
                  <div className="border-t border-border pt-6">
                    {reviews.length > 0 ? (
                      <ReviewsSection reviews={reviews} />
                    ) : (
                      <div className="text-center py-12">
                        <h3 className="text-2xl font-semibold mb-3">
                          אין ביקורות עדיין
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          היה הראשון לשתף את החוויה שלך עם {website.name} ועזור
                          לאחרים לקבל החלטות מושכלות.
                        </p>
                        <Link
                          href={`/tool/${params.url}/review`}
                          className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                          <ArrowRight className="w-4 h-4 mr-1 order-last" />
                          כתוב את הביקורת הראשונה
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Similar Tools Column */}
                <div>
                  {website.socialUrls && (
                    <SocialMediaSection socialUrls={website.socialUrls} />
                  )}

                  {suggestedTools.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-semibold mb-4">
                        עסקים דומים
                      </h2>
                      <div className="flex flex-col gap-3">
                        {suggestedTools.map((tool) => (
                          <SuggestedToolCard
                            key={tool._id.toString()}
                            website={tool}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
