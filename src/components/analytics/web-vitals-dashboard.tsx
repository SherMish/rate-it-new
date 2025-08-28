"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatWebVitalsValue, getMetricRating, type WebVitalsRating } from "@/lib/web-vitals";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface WebVitalRecord {
  _id: string;
  name: string;
  value: number;
  rating: WebVitalsRating;
  timestamp: string;
  url: string;
}

interface WebVitalStats {
  _id: string;
  ratings: Array<{
    rating: WebVitalsRating;
    count: number;
    avgValue: number;
    minValue: number;
    maxValue: number;
  }>;
  totalCount: number;
}

const RATING_COLORS = {
  good: "#22c55e",
  "needs-improvement": "#f59e0b",
  poor: "#ef4444",
};

const METRIC_DESCRIPTIONS = {
  CLS: "Cumulative Layout Shift - Visual stability",
  FID: "First Input Delay - Interactivity",
  FCP: "First Contentful Paint - Loading",
  LCP: "Largest Contentful Paint - Loading",
  TTFB: "Time to First Byte - Server response",
  INP: "Interaction to Next Paint - Responsiveness",
};

export function WebVitalsDashboard() {
  const [data, setData] = useState<WebVitalRecord[]>([]);
  const [stats, setStats] = useState<WebVitalStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDays, setSelectedDays] = useState(7);

  const fetchWebVitals = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/web-vitals?days=${selectedDays}&limit=1000`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
        setStats(result.stats);
      }
    } catch (error) {
      console.error("Error fetching Web Vitals data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedDays]);

  useEffect(() => {
    fetchWebVitals();
  }, [selectedDays, fetchWebVitals]);

  const getRatingBadgeVariant = (rating: WebVitalsRating) => {
    switch (rating) {
      case "good":
        return "default";
      case "needs-improvement":
        return "secondary";
      case "poor":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getMetricData = (metricName: string) => {
    const metricStats = stats.find(s => s._id === metricName);
    if (!metricStats) return [];

    return metricStats.ratings.map(r => ({
      rating: r.rating,
      count: r.count,
      avgValue: r.avgValue,
      percentage: Math.round((r.count / metricStats.totalCount) * 100),
    }));
  };

  const getAllMetricsOverview = () => {
    return stats.map(stat => {
      const goodRating = stat.ratings.find(r => r.rating === 'good');
      const needsImprovementRating = stat.ratings.find(r => r.rating === 'needs-improvement');
      const poorRating = stat.ratings.find(r => r.rating === 'poor');

      return {
        name: stat._id,
        good: goodRating?.count || 0,
        needsImprovement: needsImprovementRating?.count || 0,
        poor: poorRating?.count || 0,
        total: stat.totalCount,
        avgValue: stat.ratings.reduce((sum, r) => sum + (r.avgValue * r.count), 0) / stat.totalCount,
      };
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Web Vitals Dashboard</h2>
        <div className="flex gap-2">
          {[1, 7, 30, 90].map((days) => (
            <Button
              key={days}
              variant={selectedDays === days ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDays(days)}
            >
              {days === 1 ? "Today" : `${days} days`}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {getAllMetricsOverview().map((metric) => (
          <Card key={metric.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {METRIC_DESCRIPTIONS[metric.name as keyof typeof METRIC_DESCRIPTIONS]}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {formatWebVitalsValue(metric.name, metric.avgValue)}
                </div>
                <Badge variant={getRatingBadgeVariant(getMetricRating(metric.name, metric.avgValue))}>
                  {getMetricRating(metric.name, metric.avgValue)}
                </Badge>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Good: {metric.good}</span>
                  <span>Needs work: {metric.needsImprovement}</span>
                  <span>Poor: {metric.poor}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Web Vitals Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getAllMetricsOverview()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="good" stackId="a" fill="#22c55e" name="Good" />
                  <Bar dataKey="needsImprovement" stackId="a" fill="#f59e0b" name="Needs Improvement" />
                  <Bar dataKey="poor" stackId="a" fill="#ef4444" name="Poor" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Measurements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {data.slice(0, 50).map((record) => (
                  <div key={record._id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{record.name}</Badge>
                      <span className="text-sm">{formatWebVitalsValue(record.name, record.value)}</span>
                      <Badge variant={getRatingBadgeVariant(record.rating)}>
                        {record.rating}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(record.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((metric) => {
              const pieData = getMetricData(metric._id);
              return (
                <Card key={metric._id}>
                  <CardHeader>
                    <CardTitle className="text-center">{metric._id}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="count"
                          label={({ rating, percentage }) => `${rating}: ${percentage}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={RATING_COLORS[entry.rating]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
