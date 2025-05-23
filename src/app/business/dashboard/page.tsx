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
  Lightbulb,
  Lock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { isPlus, PricingModel } from "@/lib/types/website";

import { useBusinessGuard } from "@/hooks/use-business-guard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Review } from "@/components/reviews-section";
import trustStatuses from "@/lib/data/trustStatuses.json";
import FirstTimeDialog from "@/app/components/FirstTimeDialog";
import { useSearchParams, useRouter } from "next/navigation";
import { DailyTipCard } from "@/app/components/DailyTipCard";
import { UpgradeButton } from "@/components/ui/upgrade-button";

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
      status: "לא מדורג",
      description: "העסק הזה עדיין לא דורג.",
    }
  );
}

// Function to get the appropriate icon based on trust level
function getTrustStatusIcon(score: number) {
  if (score >= 8.6) return Award; // מוביל בתעשייה
  if (score >= 7.1) return ThumbsUp; // מאושר בשוק
  if (score >= 5.1) return Sparkles; // שחקן מתפתח
  return AlertTriangle; // אמון נמוך בשוק
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showFirstTimeDialog, setShowFirstTimeDialog] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [features, setFeatures] = useState<Feature[]>([
    {
      id: "1",
      title: "תוכן דיגיטלי",
      description: "יצירת תוכן איכותי לפלטפורמות דיגיטליות",
    },
    {
      id: "2",
      title: "שיתוף פעולה בזמן אמת",
      description: "עבודה משותפת עם חברי הצוות",
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

  // Check for firstTime parameter
  useEffect(() => {
    const isFirstTime = searchParams?.get("firstTime") === "true";
    if (isFirstTime) {
      setShowFirstTimeDialog(true);
    }
  }, [searchParams]);

  // Handle dialog close
  const handleDialogClose = () => {
    setShowFirstTimeDialog(false);
    // Remove the firstTime parameter from the URL without refreshing the page
    const url = new URL(window.location.href);
    url.searchParams.delete("firstTime");
    router.replace(url.pathname + url.search);

    // Redirect to the business profile page
    router.push("/business/dashboard/tool");
  };

  if (isLoading || isLoadingReviews) {
    return <LoadingSpinner />;
  }

  // Calculate conversion rate
  const conversionRate =
    totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

  return (
    <>
      <FirstTimeDialog
        open={showFirstTimeDialog}
        onClose={handleDialogClose}
        userName={user?.name?.split(" ")[0]}
      />

      <div className="container mx-auto px-4 py-12 min-h-screen" dir="rtl">
        <div className="mb-8 flex justify-between items-center">
          <p className="text-muted-foreground">
            ברוך/ה הבא, {user?.name?.split(" ")[0]}!
          </p>
          <Link
            href={`/tool/${website?.url}`}
            target="_blank"
            className="text-primary hover:underline flex items-center gap-2"
          >
            <span>צפייה בדף הציבורי</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  ביקורות
                </p>
                <h3 className="text-2xl font-bold mt-2">
                  {website?.reviewCount || 0}
                </h3>
              </div>
              <Star className="w-8 h-8 text-primary opacity-75" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  דירוג ממוצע
                </p>
                <h3 className="text-2xl font-bold mt-2">
                  {website?.averageRating
                    ? website?.averageRating.toFixed(1)
                    : "0.0"}
                </h3>
              </div>
              <Star className="w-8 h-8 text-yellow-500 opacity-75" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  סה״כ צפיות
                </p>
                {website?.pricingModel &&
                isPlus(website.pricingModel as PricingModel) ? (
                  <h3 className="text-2xl font-bold mt-2">{totalViews}</h3>
                ) : (
                  <div className="mt-2">
                    <div className="relative">
                      <h3 className="text-2xl font-bold text-muted-foreground/50 blur-sm select-none">
                        1,247
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 mb-3">
                      זמין ללקוחות פלוס בלבד
                    </p>
                    <UpgradeButton />
                  </div>
                )}
              </div>
              <Eye
                className={`w-8 h-8 opacity-75 ${
                  website?.pricingModel &&
                  isPlus(website.pricingModel as PricingModel)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  קליקים לאתר
                </p>
                {website?.pricingModel &&
                isPlus(website.pricingModel as PricingModel) ? (
                  <h3 className="text-2xl font-bold mt-2">{totalClicks}</h3>
                ) : (
                  <div className="mt-2">
                    <div className="relative">
                      <h3 className="text-2xl font-bold text-muted-foreground/50 blur-sm select-none">
                        89
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 mb-3">
                      זמין ללקוחות פלוס בלבד
                    </p>
                    <UpgradeButton />
                  </div>
                )}
              </div>
              <MousePointer
                className={`w-8 h-8 opacity-75 ${
                  website?.pricingModel &&
                  isPlus(website.pricingModel as PricingModel)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              />
            </div>
          </Card>
        </div>

        {/* Second Row of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-stretch">
          {/* Conversion Rate Card */}
          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  אחוז המרה
                </p>
                {website?.pricingModel &&
                isPlus(website.pricingModel as PricingModel) ? (
                  <>
                    <h3 className="text-2xl font-bold mt-2">
                      {conversionRate}%
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      אחוז המבקרים שלחצו על הקישור לאתר שלכם
                    </p>
                  </>
                ) : (
                  <div className="mt-2">
                    <div className="relative">
                      <h3 className="text-2xl font-bold text-muted-foreground/50 blur-sm select-none">
                        7.1%
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 mb-3">
                      זמין ללקוחות פלוס בלבד
                    </p>
                    <UpgradeButton />
                  </div>
                )}
              </div>
              <Percent
                className={`w-8 h-8 opacity-75 ${
                  website?.pricingModel &&
                  isPlus(website.pricingModel as PricingModel)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              />
            </div>
          </Card>

          {/* Daily Tip Card */}
          <DailyTipCard />
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Latest Reviews - Second Row, Spans Full Width */}
          <Card className="col-span-full p-6 hover:shadow-lg transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">ביקורות אחרונות</h3>
              <Link
                href="/business/dashboard/reviews"
                className="text-sm text-primary hover:underline"
              >
                צפייה בכולן
              </Link>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">אין ביקורות עדיין</h3>
                <p className="text-muted-foreground">
                  העסק שלך עדיין לא קיבל ביקורות. הביקורות יופיעו כאן ברגע
                  שמשתמשים יתחילו לשתף את החוויות שלהם.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reviews.slice(0, 4).map((review) => (
                  <div
                    key={review._id}
                    className="p-4 rounded-lg bg-accent/50 border border-border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-500"
                                : "text-muted-foreground"
                            }`}
                            fill={i < review.rating ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                    </div>
                    <h4 className="font-medium mb-2 line-clamp-1">
                      {review.title}
                    </h4>
                    <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                      {review.body}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
