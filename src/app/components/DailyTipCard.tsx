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
      <Card className="p-6 hover:shadow-lg transition-all overflow-hidden relative">
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-primary/20 rounded-br-[100px] -ml-6 -mt-6 z-0" />

        <div className="flex justify-between items-start relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                טיפ היום ✨
              </p>
            </div>

            <h3 className="text-lg font-semibold mt-3 mb-2">{tip.title}</h3>
            <p className="text-sm text-muted-foreground">{tip.content}</p>
          </div>
        </div>
      </Card>
    </animated.div>
  );
}
