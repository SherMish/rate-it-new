"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Eye,
  MousePointer,
  Percent,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { WebsiteType } from "@/lib/models/Website";

interface AllWebsitesStatisticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface WebsiteWithStats {
  website: WebsiteType;
  totalViews: number;
  totalClicks: number;
  conversionRate: string;
}

const ITEMS_PER_PAGE = 20;

// Fetch functions for analytics
const fetchTotalViews = async (websiteId: string): Promise<number> => {
  try {
    const response = await fetch(
      `/api/analytics/get?websiteId=${websiteId}&eventType=page_visit`
    );
    const data = await response.json();

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

export function AllWebsitesStatisticsDialog({
  open,
  onOpenChange,
}: AllWebsitesStatisticsDialogProps) {
  const [websitesWithStats, setWebsitesWithStats] = useState<
    WebsiteWithStats[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalWebsites, setTotalWebsites] = useState(0);

  const maxPages = Math.ceil(totalWebsites / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentWebsites = websitesWithStats.slice(startIndex, endIndex);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      setWebsitesWithStats([]);
      setCurrentPage(1);
      fetchAllWebsitesStatistics();
    }
  }, [open]);

  const fetchAllWebsitesStatistics = async () => {
    try {
      // First, fetch all websites
      const websitesResponse = await fetch(`/api/admin/websites?limit=1000`);
      const websitesData = await websitesResponse.json();
      const websites: WebsiteType[] = websitesData.websites || [];

      setTotalWebsites(websites.length);

      // Then fetch analytics for each website
      const websitesWithStatsPromises = websites.map(async (website) => {
        const [totalViews, totalClicks] = await Promise.all([
          fetchTotalViews(website._id.toString()),
          fetchTotalClicks(website._id.toString()),
        ]);

        const conversionRate =
          totalViews > 0
            ? ((totalClicks / totalViews) * 100).toFixed(1)
            : "0.0";

        return {
          website,
          totalViews,
          totalClicks,
          conversionRate,
        };
      });

      const results = await Promise.all(websitesWithStatsPromises);

      // Sort by total views (descending)
      const sortedResults = results.sort((a, b) => b.totalViews - a.totalViews);

      setWebsitesWithStats(sortedResults);
    } catch (error) {
      console.error("Error fetching websites statistics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const getPerformanceColor = (conversionRate: string) => {
    const rate = parseFloat(conversionRate);
    if (rate > 5) return "text-green-600";
    if (rate > 2) return "text-yellow-600";
    return "text-red-600";
  };

  const getActivityColor = (views: number) => {
    if (views > 100) return "text-green-600";
    if (views > 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-5xl max-h-[80vh] overflow-y-auto"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle className="text-right">
            סטטיסטיקות כל האתרים ({totalWebsites} אתרים)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
              <span className="mr-2">טוען נתונים...</span>
            </div>
          ) : websitesWithStats.length > 0 ? (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">אתר</TableHead>
                      <TableHead className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Eye className="h-4 w-4" />
                          צפיות
                        </div>
                      </TableHead>
                      <TableHead className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <MousePointer className="h-4 w-4" />
                          לחיצות
                        </div>
                      </TableHead>
                      <TableHead className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Percent className="h-4 w-4" />
                          שיעור המרה
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentWebsites.map((item, index) => (
                      <TableRow key={item.website._id.toString()}>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-3">
                            <div className="text-right">
                              <div className="font-medium">
                                {item.website.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {item.website.url}
                              </div>
                            </div>
                            {item.website.logo && (
                              <img
                                src={item.website.logo}
                                alt={item.website.name}
                                className="w-8 h-8 rounded object-cover"
                              />
                            )}
                            <div className="text-xs text-muted-foreground w-8 text-center">
                              #{startIndex + index + 1}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`font-medium ${getActivityColor(
                              item.totalViews
                            )}`}
                          >
                            {formatNumber(item.totalViews)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-medium">
                            {formatNumber(item.totalClicks)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`font-medium ${getPerformanceColor(
                              item.conversionRate
                            )}`}
                          >
                            {item.conversionRate}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {maxPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <span className="py-2 px-3 text-sm">
                    עמוד {currentPage} מתוך {maxPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(maxPages, p + 1))
                    }
                    disabled={currentPage === maxPages}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Summary Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {formatNumber(
                      websitesWithStats.reduce(
                        (sum, item) => sum + item.totalViews,
                        0
                      )
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    סה&quot;כ צפיות
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {formatNumber(
                      websitesWithStats.reduce(
                        (sum, item) => sum + item.totalClicks,
                        0
                      )
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    סה&quot;כ לחיצות
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {websitesWithStats.length > 0
                      ? (
                          (websitesWithStats.reduce(
                            (sum, item) => sum + item.totalClicks,
                            0
                          ) /
                            websitesWithStats.reduce(
                              (sum, item) => sum + item.totalViews,
                              0
                            )) *
                          100
                        ).toFixed(1)
                      : "0.0"}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground">
                    שיעור המרה ממוצע
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">לא נמצאו נתונים</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
