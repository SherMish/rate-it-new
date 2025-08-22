"use client";

import { CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { isPlusOrPro, PricingModel } from "@/lib/types/website";

interface VerifiedBadgeProps {
  isVerified: boolean;
  pricingModel: PricingModel;
  className?: string;
  showUnverified?: boolean;
  licenseValidDate?: Date;
  isVerifiedByRateIt?: boolean;
}

export function VerifiedBadge({
  isVerified,
  pricingModel,
  showUnverified = false,
  licenseValidDate,
  isVerifiedByRateIt,
  className = "",
}: VerifiedBadgeProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const tooltipText = isVerified
    ? "העסק אומת על ידי צוות Rate-It במסגרת מסלול Plus, לאחר אימות האתר ובעלות רשמית מצד בעל העסק."
    : "החברה הזו טרם אימתה בעלות על הפרופיל שלה ב-Rate It, וייתכן שאינה יודעת שהוא קיים. במקרים מסוימים, הדבר עלול להוביל לדירוג כוכבים נמוך יותר.";

  const badgeContent = isVerified &&
    isPlusOrPro(pricingModel, licenseValidDate ?? null) &&
    isVerifiedByRateIt ? (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium cursor-default ${className}`}
        onClick={isClient && isMobile ? () => setShowModal(true) : undefined}
      >
        <CheckCircle className="w-3.5 h-3.5" />
        <span>מאומת</span>
      </div>
    ) : (
      showUnverified &&
      !isVerified && (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-600 text-xs font-medium cursor-default ${className}`}
          onClick={isClient && isMobile ? () => setShowModal(true) : undefined}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>לא מאומת</span>
        </span>
      )
    );

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return badgeContent;
  }

  if (isMobile) {
    return (
      <>
        {badgeContent}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-sm mx-auto p-6">
            <DialogHeader className="space-y-3 pr-8">
              <DialogTitle className="text-right text-lg font-semibold">
                {isVerified ? "עסק מאומת" : "עסק לא מאומת"}
              </DialogTitle>
              <DialogDescription className="text-right text-sm leading-relaxed">
                {tooltipText}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {badgeContent}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-right">
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
