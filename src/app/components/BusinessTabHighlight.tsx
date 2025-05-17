"use client";

import { ReactNode } from "react";
import { useSpring, animated } from "@react-spring/web";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BusinessTabHighlightProps {
  children: ReactNode;
}

export function BusinessTabHighlight({ children }: BusinessTabHighlightProps) {
  const pulseAnimation = useSpring({
    from: { scale: 1, boxShadow: "0 0 0 0 rgba(124, 58, 237, 0.7)" },
    to: [
      { scale: 1.05, boxShadow: "0 0 0 8px rgba(124, 58, 237, 0)" },
      { scale: 1, boxShadow: "0 0 0 0 rgba(124, 58, 237, 0)" },
    ],
    loop: { reverse: true, times: 6 },
    config: { tension: 300, friction: 10 },
  });

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <animated.div style={pulseAnimation} className="relative">
            {children}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[8px] text-white">
              !
            </div>
          </animated.div>
        </TooltipTrigger>
        <TooltipContent
          dir="rtl"
          className="bg-primary text-primary-foreground border-primary"
        >
          <p>עדכן את פרטי העסק שלך כאן!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default BusinessTabHighlight;
