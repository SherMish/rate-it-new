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
import { CopyLinksCard } from "@/app/components/CopyLinksCard";
import { OnboardingGuide } from "@/app/components/OnboardingGuide";
import { DashboardHelpDialog } from "@/components/business/dashboard/DashboardHelpDialog";
import { QRCodeGeneratorCard } from "@/components/business/dashboard/QRCodeGeneratorCard";
import { ReviewInvitationCard } from "@/components/business/dashboard/ReviewInvitationCard";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";

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

  // Track dashboard view when component mounts
  useEffect(() => {
    if (website && user) {
      trackEvent(AnalyticsEvents.BUSINESS_DASHBOARD_VIEWED, {
        website_id: website._id,
        website_name: website.name,
        user_role: user.role,
        review_count: website.reviewCount || 0,
        average_rating: website.averageRating || 0
      });
    }
  }, [website, user]);

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
    trackEvent(AnalyticsEvents.BUSINESS_DASHBOARD_FIRST_TIME_DIALOG_CLOSED, {
      website_id: website?._id,
      user_email: user?.email
    });
    
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
        {/* Business Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              {website?.logo && (
                <img
                  src={website.logo}
                  alt={website.name}
                  className="w-16 h-16 rounded-lg object-cover border border-border"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {website?.name || "העסק שלך"}
                </h1>
                <p className="text-muted-foreground mt-1">
                  ברוך/ה הבא, {user?.name?.split(" ")[0]}!
                </p>
              </div>
            </div>
            <Link
              href={`/tool/${website?.url}`}
              target="_blank"
              className="text-primary hover:underline flex items-center gap-2"
              onClick={() => {
                trackEvent(AnalyticsEvents.BUSINESS_DASHBOARD_PUBLIC_PAGE_CLICKED, {
                  website_id: website?._id,
                  website_url: website?.url,
                  website_name: website?.name
                });
              }}
            >
              <span>צפייה בדף הציבורי</span>
            </Link>
          </div>
        </div>

        {/* Onboarding Guide */}
        <OnboardingGuide website={website} />

        {/* Basic Stats Grid - Available for all users */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">סטטיסטיקות בסיסיות</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
        </div>

        {/* Review Collection Tools */}
        <div className="mb-8" id="review-collection-tools">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            כלים לאיסוף ביקורות
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Review Invitation Card */}
            <ReviewInvitationCard
              websiteUrl={website?.url || ""}
              businessName={website?.name || "העסק שלכם"}
            />
            {/* QR Code Generator Card */}
            <QRCodeGeneratorCard websiteUrl={website?.url || ""} />
          </div>
        </div>

        {/* Utility Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-stretch">
          {/* Daily Tip Card */}
          <DailyTipCard />
        </div>
        {/* Plus Analytics Section - Blocked for non-Plus users */}
        {totalViews >= 5 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold">אנליטיקות מתקדמות</h2>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                Plus בלבד
              </span>
            </div>

            {website?.pricingModel &&
            isPlus(
              website.pricingModel as PricingModel,
              website.licenseValidDate ?? null
            ) ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start">
                    <div className="w-full">
                      <p className="text-sm font-medium text-muted-foreground">
                        סה״כ צפיות
                      </p>
                      <h3 className="text-2xl font-bold mt-2 text-right">
                        {totalViews}
                      </h3>
                    </div>
                    <Eye className="w-8 h-8 text-primary opacity-75" />
                  </div>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start">
                    <div className="w-full">
                      <p className="text-sm font-medium text-muted-foreground">
                        קליקים לאתר
                      </p>
                      <h3 className="text-2xl font-bold mt-2 text-right">
                        {totalClicks}
                      </h3>
                    </div>
                    <MousePointer className="w-8 h-8 text-primary opacity-75" />
                  </div>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-all flex flex-col">
                  <div className="flex justify-between items-start">
                    <h2 className="text-sm font-medium text-muted-foreground mb-2">
                      אחוז המרה
                    </h2>
                    <Percent className="w-8 h-8 text-primary opacity-75" />
                  </div>
                  <div className="flex-grow flex flex-col justify-center items-start">
                    <div className="text-right w-full">
                      <h3 className="text-3xl font-bold">{conversionRate}%</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        אחוז המבקרים שלחצו על הקישור לאתר שלכם
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="p-8 bg-muted/20 border-2 border-dashed border-muted-foreground/30">
                <div className="text-center max-w-lg mx-auto">
                  <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    אנליטיקות מתקדמות זמינות למנויי Plus
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    קבלו גישה לנתונים מעמיקים על ביצועי העסק שלכם, כולל:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>מספר הצפיות בדף</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MousePointer className="w-4 h-4" />
                      <span>כמות הקליקים לאתר</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4" />
                      <span>אחוזי המרה</span>
                    </div>
                  </div>
                  <UpgradeButton />
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Reviews Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Latest Reviews - Second Row, Spans Full Width */}
          <Card className="col-span-full p-6 hover:shadow-lg transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">ביקורות אחרונות</h3>
              <Link
                href="/business/dashboard/reviews"
                className="text-sm text-primary hover:underline"
                onClick={() => {
                  trackEvent(AnalyticsEvents.BUSINESS_DASHBOARD_ALL_REVIEWS_CLICKED, {
                    website_id: website?._id,
                    review_count: reviews.length
                  });
                }}
              >
                צפייה בכולן
              </Link>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">אין ביקורות עדיין</h3>
                <p className="text-muted-foreground mb-4">
                  העסק שלך עדיין לא קיבל ביקורות. השתמש בכלי איסוף הביקורות
                  למעלה כדי להתחיל לקבל ביקורות מלקוחות!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      trackEvent(AnalyticsEvents.BUSINESS_DASHBOARD_REVIEW_COLLECTION_SCROLLED, {
                        website_id: website?._id,
                        trigger: "no_reviews_cta"
                      });
                      document
                        .getElementById("review-collection-tools")
                        ?.scrollIntoView({
                          behavior: "smooth",
                        });
                    }}
                  >
                    🔽 צפה בכלי איסוף ביקורות
                  </Button>
                </div>
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

      {/* Dashboard Help Dialog */}
      <DashboardHelpDialog website={website || undefined} />
    </>
  );
}
