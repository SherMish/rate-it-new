"use client";

import { useState, useEffect } from "react";
import {
  Star,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MessageSquare,
  MousePointer,
  Percent,
  Radar as RadarIcon,
  Info,
  Award,
  ThumbsUp,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  X,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useBusinessGuard } from "@/hooks/use-business-guard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { BarChart, LineChart } from "@tremor/react";
import { Review } from "@/components/reviews-section";
import { RadarTrustInfo } from "@/components/radar-trust-info";
import { RadarTrustImprovementDialog } from "@/app/components/radar-trust-improvement-dialog";
import trustStatuses from "@/lib/data/trustStatuses.json";

type Feature = {
  id: string;
  title: string;
  description: string;
};

// Add this function to fetch analytics
const fetchTotalViews = async (websiteId: string) => {
  try {
    const response = await fetch(
      `/api/analytics/get?websiteId=${websiteId}&eventType=page_visit`
    );
    const data = await response.json();

    // Calculate total views across all months
    const totalViews = data.reduce(
      (sum: number, item: any) => sum + (item.visitors || 0),
      0
    );
    return totalViews;
  } catch (error) {
    console.error("Error fetching total views:", error);
    return 0;
  }
};

// Add this function next to fetchTotalViews
const fetchTotalClicks = async (websiteId: string) => {
  try {
    const response = await fetch(
      `/api/analytics/get?websiteId=${websiteId}&eventType=click_site_button`
    );
    const data = await response.json();

    const totalClicks = data.reduce(
      (sum: number, item: any) => sum + (item.visitors || 0),
      0
    );
    return totalClicks;
  } catch (error) {
    console.error("Error fetching total clicks:", error);
    return 0;
  }
};

// Function to get trust status based on score
function getTrustStatus(score: number) {
  const status = trustStatuses.find(
    (status) => score >= status.from && score <= status.to
  );
  return (
    status || {
      status: "Unrated",
      description: "This tool has not been rated yet.",
    }
  );
}

// Function to get the appropriate icon based on trust level
function getTrustStatusIcon(score: number) {
  if (score >= 8.6) return Award; // Industry Leader
  if (score >= 7.1) return ThumbsUp; // Market Approved
  if (score >= 5.1) return Sparkles; // Emerging Player
  return AlertTriangle; // Low Market Confidence
}

// Function to get styles based on trust level
function getTrustStatusStyles(score: number) {
  if (score >= 8.6) {
    return {
      badge: "bg-blue-950/40 border-blue-500/30 text-blue-400",
      icon: "text-blue-400",
      gradient: "from-blue-600/20 to-blue-400/5",
    };
  }
  if (score >= 7.1) {
    return {
      badge: "bg-green-950/40 border-green-500/30 text-green-400",
      icon: "text-green-400",
      gradient: "from-green-600/20 to-green-400/5",
    };
  }
  if (score >= 5.1) {
    return {
      badge: "bg-yellow-950/40 border-yellow-500/30 text-yellow-400",
      icon: "text-yellow-400",
      gradient: "from-yellow-600/20 to-yellow-400/5",
    };
  }
  return {
    badge: "bg-red-950/40 border-red-500/30 text-red-400",
    icon: "text-red-400",
    gradient: "from-red-600/20 to-red-400/5",
  };
}

export default function DashboardPage() {
  const { isLoading, website, user } = useBusinessGuard();
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [features, setFeatures] = useState<Feature[]>([
    {
      id: "1",
      title: "AI-Powered Writing",
      description: "Advanced natural language processing for content creation",
    },
    {
      id: "2",
      title: "Real-time Collaboration",
      description: "Work together seamlessly with team members",
    },
  ]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [totalViews, setTotalViews] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [isImprovementDialogOpen, setIsImprovementDialogOpen] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `/api/reviews/get?websiteId=${website?._id}`
        );
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    if (website?._id) {
      fetchReviews();
      fetchTotalViews(website._id.toString()).then(setTotalViews);
      fetchTotalClicks(website._id.toString()).then(setTotalClicks);
    }
  }, [website]);

  if (isLoading || isLoadingReviews) {
    return <LoadingSpinner />;
  }

  // Calculate conversion rate
  const conversionRate =
    totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <p className="text-gray-400">
          Welcome back, {user?.name?.split(" ")[0]}!
        </p>
        <Link
          href={`/tool/${website?.url}`}
          target="_blank"
          className="text-primary hover:underline flex items-center gap-2"
        >
          <span>View Public Page</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 hover:shadow-lg transition-all bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30 border border-white/[0.08]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Reviews
              </p>
              <h3 className="text-2xl font-bold mt-2">
                {website?.reviewCount || 0}
              </h3>
              {/* Remove or comment out the percentage change for now */}
              {/* <p className="text-sm text-green-600 flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +8.2%
              </p> */}
            </div>
            <Star className="w-8 h-8 text-primary opacity-75" />
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30 border border-white/[0.08]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Average Rating
              </p>
              <h3 className="text-2xl font-bold mt-2">
                {website?.averageRating
                  ? website?.averageRating.toFixed(1)
                  : "0.0"}
              </h3>
              {/* Remove or comment out the percentage change for now */}
              {/* <p className="text-sm text-green-600 flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +0.3
              </p> */}
            </div>
            <Star className="w-8 h-8 text-yellow-500 opacity-75" />
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30 border border-white/[0.08]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Views
              </p>
              <h3 className="text-2xl font-bold mt-2">{totalViews}</h3>
              {/* <p className="text-sm text-green-600 flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +12.5%
              </p> */}
            </div>
            <Eye className="w-8 h-8 text-primary opacity-75" />
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30 border border-white/[0.08]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Website Clicks
              </p>
              <h3 className="text-2xl font-bold mt-2">{totalClicks}</h3>
            </div>
            <MousePointer className="w-8 h-8 text-primary opacity-75" />
          </div>
        </Card>
      </div>

      {/* Second Row of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Conversion Rate Card */}
        <Card className="p-6 hover:shadow-lg transition-all bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30 border border-white/[0.08]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Conversion Rate
              </p>
              <h3 className="text-2xl font-bold mt-2">{conversionRate}%</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Percentage of visitors who clicked through to your website
              </p>
            </div>
            <Percent className="w-8 h-8 text-primary opacity-75" />
          </div>
        </Card>

        {/* RadarTrust Score Card */}
        <Card className="p-6 hover:shadow-lg transition-all bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30 border border-white/[0.08]">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                RadarTrust™ Score
              </p>

              {website?.radarTrust ? (
                <>
                  {/* Score Display */}
                  <div className="flex items-center gap-2 mt-2">
                    <h3 className="text-3xl font-bold">
                      {website.radarTrust.toFixed(1)}
                    </h3>
                    <span className="text-sm text-muted-foreground">/10</span>
                  </div>

                  {/* Short Benefit Statement */}
                  <p className="text-xs text-muted-foreground mt-1">
                    A higher RadarTrust™ Score boosts visibility & credibility.
                  </p>

                  {/* Trust Status Badge */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {(() => {
                          const status = getTrustStatus(website.radarTrust);
                          const styles = getTrustStatusStyles(
                            website.radarTrust
                          );
                          const StatusIcon = getTrustStatusIcon(
                            website.radarTrust
                          );
                          return (
                            <div
                              className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg border ${styles.badge} transition-all hover:scale-105`}
                            >
                              <div
                                className={`absolute inset-0 rounded-lg bg-gradient-to-r ${styles.gradient} opacity-50`}
                              ></div>
                              <StatusIcon
                                className={`w-4 h-4 ${styles.icon} relative z-10`}
                              />
                              <span className="relative z-10 font-medium text-sm">
                                {status.status}
                              </span>
                            </div>
                          );
                        })()}
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[250px] p-3">
                        <p className="text-xs">
                          {getTrustStatus(website.radarTrust).description}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Learn More Link */}
                  <div className="text-xs text-zinc-400 mt-2">
                    <RadarTrustInfo>
                      <span className="cursor-pointer hover:text-primary hover:underline transition-colors">
                        Learn how this score is calculated
                      </span>
                    </RadarTrustInfo>
                  </div>
                </>
              ) : (
                <>
                  {/* Loading State */}
                  <div className="mt-2 py-2">
                    <div className="w-16 h-3 bg-primary/10 rounded-full animate-pulse mb-3"></div>
                    <h3 className="text-muted-foreground text-sm font-medium">
                      AI Radar is calculating your score
                    </h3>
                    <p className="text-xs text-zinc-500 mt-2 max-w-[250px]">
                      Your RadarTrust™ score is being processed and will be
                      available within a few days. This score helps users
                      understand your tool’s market position.
                    </p>
                    <div className="text-xs text-zinc-400 mt-3">
                      <RadarTrustInfo>
                        <span className="cursor-pointer hover:text-primary hover:underline transition-colors">
                          Learn how this score is calculated
                        </span>
                      </RadarTrustInfo>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Section */}
            <div className="flex flex-col items-end gap-2">
              <RadarIcon className="w-8 h-8 text-primary opacity-75" />

              {/* Improve Score Button (Only if Score Exists) */}
              {website?.radarTrust && (
                <RadarTrustImprovementDialog>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-9 px-4 mt-3 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 hover:text-primary transition-all hover:scale-105"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Boost Your Trust Score
                  </Button>
                </RadarTrustImprovementDialog>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Latest Reviews - Second Row, Spans Full Width */}
        <Card className="col-span-full p-6 hover:shadow-lg transition-all bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30 border border-white/[0.08]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-200">
              Latest Reviews
            </h3>
            <Link
              href="/business/dashboard/reviews"
              className="text-sm text-primary hover:underline"
            >
              View All
            </Link>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-200 mb-2">
                No Reviews Yet
              </h3>
              <p className="text-gray-400">
                Your tool hasn&apos;t received any reviews yet. Reviews will
                appear here once users start sharing their experiences.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reviews.slice(0, 4).map((review) => (
                <div
                  key={review._id}
                  className="p-4 rounded-lg bg-white/5 border border-white/[0.08]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-500"
                              : "text-gray-600"
                          }`}
                          fill={i < review.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-200 mb-2 line-clamp-1">
                    {review.title}
                  </h4>
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                    {review.body}
                  </p>
                  <span className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
