"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  ArrowRight,
  BadgeCheck,
  Star,
  Zap,
  Crown,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  benefitExplanations,
  planBenefitMappings,
} from "@/lib/pricing-benefits";

interface PlanFeature {
  text: string;
  isHighlighted?: boolean;
}

interface Plan {
  name: string;
  price: string;
  originalPrice?: string; // For showing crossed out price when annual
  monthlyPrice?: number; // Base monthly price for calculations
  discount?: number; // Discount percentage for annual plans (e.g., 27 for 27% off)
  priceDetails?: string;
  features: PlanFeature[];
  ctaText: string;
  onCtaClick: () => void;
  isRecommended?: boolean;
  isCurrent?: boolean; // To show if this is the user's current plan
  isDisabled?: boolean;
  isComingSoon?: boolean; // New property for coming soon plans
  highlightColor?: string; // e.g., 'primary', 'green-500'
  bestFor?: string; // New field for describing who the plan is best for
  planType?: "basic" | "plus" | "pro"; // Updated plan types
  badge?: string; // Custom badge text
}

interface PricingPlansUIProps {
  plans: Plan[];
  isAnnual?: boolean; // If you plan to bring back the toggle
  loading?: boolean;
  onBillingChange?: (isAnnual: boolean) => void;
}

export function PricingPlansUI({
  plans,
  loading,
  isAnnual = false,
  onBillingChange,
}: PricingPlansUIProps) {
  return (
    <div className="space-y-8">
      {onBillingChange && (
        <div className="flex items-center justify-center gap-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 p-3 rounded-lg max-w-sm mx-auto">
          <span
            className={`text-sm ${
              !isAnnual ? "font-semibold" : "text-muted-foreground"
            }`}
          >
            חודשי
          </span>
          <Switch checked={isAnnual} onCheckedChange={onBillingChange} />
          <span
            className={`text-sm ${
              isAnnual ? "font-semibold" : "text-muted-foreground"
            }`}
          >
            שנתי <span className="text-green-600 font-bold">(חסוך 30%)</span>
          </span>
        </div>
      )}

      {/* 3 Column Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`p-8 border-2 flex flex-col h-full relative transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
              plan.isRecommended
                ? `border-primary bg-gradient-to-b from-primary/10 to-primary/20 shadow-xl bg-white`
                : plan.isComingSoon
                ? "border-gray-300 bg-gray-50/80 shadow-md"
                : "border-slate-200 bg-white shadow-lg hover:border-primary/50 hover:shadow-xl"
            } ${plan.isCurrent ? "bg-primary/10 border-primary" : ""}`}
          >
            {plan.isRecommended && !plan.isComingSoon && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-xl border-2 border-white flex items-center gap-1">
                  <Crown className="h-4 w-4" />
                  {plan.badge || "הכי מומלץ"}
                </div>
              </div>
            )}
            {plan.isComingSoon && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-xl border-2 border-white flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  {plan.badge || "בקרוב"}
                </div>
              </div>
            )}

            <div className="space-y-6 flex flex-col flex-grow">
              {/* Plan Header */}
              <div className="text-center space-y-3">
                <h3 className={`text-3xl font-bold ${
                  plan.isComingSoon ? "text-gray-400" : "text-foreground"
                }`}>
                  {plan.name}
                </h3>
                {plan.bestFor && (
                  <p className={`text-sm font-medium p-3 rounded-lg border ${
                    plan.isRecommended 
                      ? "text-primary bg-primary/10 border-primary/20" 
                      : plan.isComingSoon
                      ? "text-gray-500 bg-gray-100 border-gray-200"
                      : "text-muted-foreground bg-slate-50 border-slate-200"
                  }`}>
                    {plan.bestFor}
                  </p>
                )}
              </div>

              {/* Price Display */}
              <div className={`text-center space-y-2 p-6 rounded-xl ${
                plan.isRecommended 
                  ? "bg-primary/15 border border-primary/30" 
                  : plan.isComingSoon
                  ? "bg-gray-100/80 border border-gray-200"
                  : "bg-slate-50/80 border border-slate-200"
              }`}>
                {isAnnual && plan.originalPrice && (
                  <div className="text-lg text-muted-foreground line-through">
                    {plan.originalPrice} לחודש
                  </div>
                )}
                <div className={`text-5xl font-bold ${
                  plan.isComingSoon ? "text-gray-400" : "text-primary"
                }`}>
                  {isAnnual && plan.monthlyPrice && !plan.isComingSoon
                    ? `${plan.monthlyPrice} ₪`
                    : plan.price}
                  {plan.price !== "0 ₪" && (
                    <span className="text-lg font-normal text-muted-foreground mr-2">
                      לחודש
                    </span>
                  )}
                </div>
                {isAnnual && plan.monthlyPrice && plan.discount && !plan.isComingSoon && (
                  <div className="text-sm">
                    <span className="font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full border border-green-200">
                      חסכון {plan.discount}% בתשלום שנתי
                    </span>
                  </div>
                )}
              </div>

              {/* Features List */}
              <ul className="space-y-4 flex-grow bg-white/50 p-4 rounded-xl border border-slate-100">
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      feature.isHighlighted
                        ? "font-bold text-primary bg-primary/10 border border-primary/20"
                        : "text-foreground bg-white/60 border border-transparent hover:border-slate-200"
                    }`}
                  >
                    {feature.isHighlighted ? (
                      <BadgeCheck className="h-6 w-6 text-primary flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    )}
                    <span className="text-base">{feature.text}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                size="lg"
                variant={plan.isRecommended ? "default" : "outline"}
                className={`w-full mt-auto py-4 text-lg font-bold transition-all duration-300 shadow-lg ${
                  plan.isRecommended && !plan.isComingSoon
                    ? "bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white border-0 shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
                    : plan.isComingSoon
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300 shadow-none"
                    : "border-2 border-primary text-primary bg-white hover:bg-primary hover:text-white shadow-md hover:shadow-lg"
                }`}
                onClick={() => plan.onCtaClick()}
                disabled={
                  loading ||
                  plan.isDisabled ||
                  plan.isCurrent ||
                  plan.isComingSoon
                }
              >
                {plan.isCurrent
                  ? "המסלול הנוכחי שלך"
                  : plan.isComingSoon
                  ? "בקרוב"
                  : plan.ctaText}
                {!plan.isCurrent && !plan.isComingSoon && (
                  <ArrowRight className="h-5 w-5 mr-2" />
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
