"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import * as Icons from "lucide-react";
import { useSpring, animated } from "@react-spring/web";
import tipsData from "@/lib/data/daily-tips.json";

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

  // Subtle floating animation for the lightbulb
  const floatAnimation = useSpring({
    from: { transform: "translateY(0px)" },
    to: { transform: "translateY(-4px)" },
    loop: { reverse: true },
    config: { tension: 100, friction: 10, duration: 2500 },
  });

  useEffect(() => {
    // Get the current day of the month (1-31)
    const today = new Date().getDate();

    // Use the day to pick a tip (cycling through the tips)
    const tipIndex = today % tipsData.tips.length || tipsData.tips.length;
    const todaysTip =
      tipsData.tips.find((t) => t.id === tipIndex) || tipsData.tips[0];

    setTip(todaysTip);
  }, []);

  if (!tip) return null;

  return (
    <animated.div style={fadeIn}>
      <Card className="p-6 hover:shadow-lg transition-all overflow-hidden relative border-0">
        {/* Main gradient background with multiple layers */}

        {/* Decorative border */}
        <div className="absolute inset-0 border-2 border-primary/10 rounded-lg" />

        {/* Content container */}
        <div className="relative z-10">
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
