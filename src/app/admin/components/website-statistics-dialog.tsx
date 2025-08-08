"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, MousePointer, Percent, TrendingUp } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { WebsiteType } from "@/lib/models/Website";

interface WebsiteStatisticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  website: WebsiteType | null;
}

interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  conversionRate: string;
}

// Fetch functions similar to business dashboard
const fetchTotalViews = async (websiteId: string): Promise<number> => {
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

const fetchTotalClicks = async (websiteId: string): Promise<number> => {
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

export function WebsiteStatisticsDialog({
  open,
  onOpenChange,
  website,
}: WebsiteStatisticsDialogProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && website?._id) {
      setIsLoading(true);
      setAnalytics(null);

      const fetchAnalytics = async () => {
        try {
          const [totalViews, totalClicks] = await Promise.all([
            fetchTotalViews(website._id.toString()),
            fetchTotalClicks(website._id.toString()),
          ]);

          // Calculate conversion rate
          const conversionRate =
            totalViews > 0
              ? ((totalClicks / totalViews) * 100).toFixed(1)
              : "0.0";

          setAnalytics({
            totalViews,
            totalClicks,
            conversionRate,
          });
        } catch (error) {
          console.error("Error fetching analytics:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAnalytics();
    }
  }, [open, website?._id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">
            סטטיסטיקות - {website?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : analytics ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    צפיות בדף
                  </CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-right">
                    {analytics.totalViews.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    סה&quot;כ צפיות בדף הציבורי
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">לחיצות</CardTitle>
                  <MousePointer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-right">
                    {analytics.totalClicks.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    לחיצות על כפתור &quot;בקר באתר&quot;
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    שיעור המרה
                  </CardTitle>
                  <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-right">
                    {analytics.conversionRate}%
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    אחוז הלחיצות מתוך הצפיות
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-primary">
                    ביצועים כלליים
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-right space-y-1">
                    <p>
                      <span className="font-medium">רמת פעילות:</span>{" "}
                      <span
                        className={`${
                          analytics.totalViews > 100
                            ? "text-green-600"
                            : analytics.totalViews > 50
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {analytics.totalViews > 100
                          ? "גבוהה"
                          : analytics.totalViews > 50
                          ? "בינונית"
                          : "נמוכה"}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">יעילות המרה:</span>{" "}
                      <span
                        className={`${
                          parseFloat(analytics.conversionRate) > 5
                            ? "text-green-600"
                            : parseFloat(analytics.conversionRate) > 2
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {parseFloat(analytics.conversionRate) > 5
                          ? "מעולה"
                          : parseFloat(analytics.conversionRate) > 2
                          ? "טובה"
                          : "דורשת שיפור"}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">לא ניתן לטעון נתונים</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
