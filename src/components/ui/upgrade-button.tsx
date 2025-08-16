"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";

export function UpgradeButton() {
  const handleClick = () => {
    trackEvent(AnalyticsEvents.BUSINESS_DASHBOARD_UPGRADE_CLICKED, {
      source: "dashboard",
      button_location: "upgrade_button",
      page: window.location.pathname
    });
  };

  return (
    <Link href="/business/pricing" onClick={handleClick}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative"
      >
        {/* Animated glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-md blur-lg opacity-50 animate-pulse" />

        {/* Button with shimmer effect */}
        <Button
          size="sm"
          className="relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 text-xs font-medium overflow-hidden group"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 w-1/2 h-full transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer" />

          {/* Button content */}
          <div className="flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>שדרגו עכשיו</span>
          </div>
        </Button>
      </motion.div>
    </Link>
  );
}
