"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, BadgeCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface PlanFeature {
  text: string;
  isHighlighted?: boolean;
}

interface Plan {
  name: string;
  price: string;
  monthlyPrice?: number; // Base monthly price for calculations
  priceDetails?: string;
  features: PlanFeature[];
  ctaText: string;
  onCtaClick: () => void;
  isRecommended?: boolean;
  isCurrent?: boolean; // To show if this is the user's current plan
  isDisabled?: boolean;
  highlightColor?: string; // e.g., 'primary', 'green-500'
  bestFor?: string; // New field for describing who the plan is best for
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
        <div className="flex items-center justify-center gap-4">
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
            שנתי <span className="text-green-600">(27% הנחה)</span>
          </span>
        </div>
      )}
      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`p-6 border-2 flex flex-col h-full relative ${
              plan.isRecommended
                ? `border-${plan.highlightColor || "primary"}`
                : "border-border/50"
            } ${plan.isCurrent ? "bg-primary/5" : ""}`}
          >
            {plan.isRecommended && (
              <div
                className={`absolute top-0 right-0 bg-${
                  plan.highlightColor || "primary"
                } text-primary-foreground text-sm px-3 py-1 rounded-bl-lg`}
              >
                מומלץ
              </div>
            )}
            <div className="space-y-5 flex flex-col flex-grow">
              <div>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                {plan.priceDetails && (
                  <p className="text-muted-foreground mt-1">
                    {plan.priceDetails}
                  </p>
                )}
                {plan.bestFor && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.bestFor}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold">
                  {isAnnual && plan.monthlyPrice
                    ? `${plan.monthlyPrice} ₪`
                    : plan.price}
                  <span className="text-base font-normal text-muted-foreground mr-1">
                    {isAnnual ? "לחודש" : "לחודש"}
                    <span className="text-sm"></span>
                  </span>
                </div>
                {isAnnual && plan.monthlyPrice && (
                  <div className="text-sm text-muted-foreground">
                    בחיוב שנתי • {plan.price} לשנה
                  </div>
                )}
              </div>
              <ul className="space-y-3 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className={`flex items-center gap-2 ${
                      feature.isHighlighted
                        ? `font-semibold text-${
                            plan.highlightColor || "primary"
                          }`
                        : "text-muted-foreground"
                    }`}
                  >
                    {feature.isHighlighted ? (
                      <BadgeCheck
                        className={`h-5 w-5 text-${
                          plan.highlightColor || "primary"
                        }`}
                      />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {feature.text}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.isRecommended ? "default" : "outline"}
                className={`w-full mt-auto ${
                  plan.isRecommended
                    ? `bg-${plan.highlightColor || "primary"} hover:bg-${
                        plan.highlightColor || "primary"
                      }/90`
                    : ""
                }`}
                onClick={plan.onCtaClick}
                disabled={loading || plan.isDisabled || plan.isCurrent}
              >
                {plan.isCurrent ? "המסלול הנוכחי שלך" : plan.ctaText}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
