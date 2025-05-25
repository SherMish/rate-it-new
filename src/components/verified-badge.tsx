import { CheckCircle, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isPlusOrPro, PricingModel } from "@/lib/types/website";

interface VerifiedBadgeProps {
  isVerified: boolean;
  pricingModel: PricingModel;
  className?: string;
  showUnverified?: boolean;
}

export function VerifiedBadge({
  isVerified,
  pricingModel,
  showUnverified = false,
  className = "",
}: VerifiedBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {isVerified && isPlusOrPro(pricingModel) ? (
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium cursor-default ${className}`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>מאומת</span>
            </div>
          ) : (
            showUnverified && !isVerified && (
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-600 text-xs font-medium cursor-default ${className}`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>לא מאומת</span>
              </div>
            )
          )}
        </TooltipTrigger>
        <TooltipContent>
          {isVerified
            ? "עסק זה אומת על ידי הבעלים"
            : "עסק זה טרם אומת על ידי הבעלים"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
