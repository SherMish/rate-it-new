"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import * as Icons from "lucide-react";
import { useSpring, animated } from "@react-spring/web";
import tipsData from "@/lib/data/daily-tips.json";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";

export function DailyTipCard() {
  const [tip, setTip] = useState<{
    id: number;
    title: string;
    content: string;
    icon: string;
  } | null>(null);

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(10px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 280, friction: 20 },
  });

  useEffect(() => {
    // Get the current day of the month (1-31)
    const currentDay = new Date().getDate();

    // Use the day to pick a tip (cycling through the tips)
    const tipIndex = currentDay % tipsData.tips.length || tipsData.tips.length;
    const todaysTip =
      tipsData.tips.find((t) => t.id === tipIndex) || tipsData.tips[0];

    setTip(todaysTip);

    // Track daily tip viewed
    if (todaysTip) {
      trackEvent(AnalyticsEvents.BUSINESS_DASHBOARD_DAILY_TIP_VIEWED, {
        tip_id: todaysTip.id,
        tip_title: todaysTip.title,
        day_of_month: currentDay
      });
    }
  }, []);

  if (!tip) return null;

  return (
    <animated.div style={fadeIn} className="h-full">
      <Card className="p-6 hover:shadow-lg transition-all overflow-hidden relative border-0 h-full flex flex-col">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5 z-0"
          style={{
            backgroundImage:
              "radial-gradient(hsl(var(--primary)) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Unique decorative border */}
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background:
              "linear-gradient(to bottom right, transparent, transparent)",
            border: "2px solid",
            borderStyle: "solid solid dashed dotted",
            borderWidth: "3px 2px 3px 2px",
            borderImage:
              "linear-gradient(45deg, hsl(var(--primary)/30%), hsl(var(--primary)/10%)) 1",
            borderRadius: "12px",
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.03)",
          }}
        />

        {/* Accent corners */}
        <div
          className="absolute left-0 top-0 w-6 h-6"
          style={{
            borderTop: "3px solid",
            borderLeft: "3px solid",
            borderColor: "hsl(var(--primary))",
            borderTopLeftRadius: "8px",
          }}
        />
        <div
          className="absolute right-0 bottom-0 w-6 h-6"
          style={{
            borderBottom: "3px solid",
            borderRight: "3px solid",
            borderColor: "hsl(var(--primary))",
            borderBottomRightRadius: "8px",
          }}
        />

        {/* Twist: Rotated decorative element */}
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-16 h-16 bg-primary/5 rounded-md rotate-45 z-0" />

        {/* Content container */}
        <div className="relative z-10 flex-grow flex flex-col justify-center">
          <div className="flex justify-between items-start">
            <div className="w-full">
              {/* Header with badge-like design */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full mb-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Lightbulb className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-sm font-medium text-primary">טיפ היום</p>
              </div>

              {/* Tip content with improved typography */}
              <h3 className="text-xl font-bold mb-3 text-foreground/90 relative">
                {tip.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tip.content}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </animated.div>
  );
}
