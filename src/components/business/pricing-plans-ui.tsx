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
  planType?: "free" | "plus"; // Add plan type for mapping benefits
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
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-primary">
          בחר את המסלול שמתאים לך
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          התחל עם המסלול החינמי או שדרג למסלול הפלוס למקסימום חשיפה ואמון
        </p>
      </div>

      {onBillingChange && (
        <div className="flex items-center justify-center gap-4 bg-muted/30 p-4 rounded-lg">
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
            שנתי <span className="text-green-600 font-bold">(חסוך 25%)</span>
          </span>
        </div>
      )}

      {/* 2 Column Grid */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`p-8 border-2 flex flex-col h-full relative transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
              plan.isRecommended
                ? `border-primary-500 bg-gradient-to-b from-primary/5 to-primary/10 shadow-xl`
                : "border-border/50 hover:border-primary/30"
            } ${plan.isCurrent ? "bg-primary/5" : ""} ${
              plan.isComingSoon ? "opacity-80" : ""
            }`}
          >
            {plan.isRecommended && !plan.isComingSoon && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-primary to-primary-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg flex items-center gap-1">
                  <Crown className="h-4 w-4" />
                  הכי פופולרי
                </div>
              </div>
            )}
            {plan.isComingSoon && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  בקרוב
                </div>
              </div>
            )}

            <div className="space-y-6 flex flex-col flex-grow">
              {/* Plan Header */}
              <div className="text-center space-y-3">
                <h3 className="text-3xl font-bold text-foreground">
                  {plan.name}
                </h3>
                {plan.bestFor && (
                  <p className="text-sm text-muted-foreground font-medium bg-muted/50 p-3 rounded-lg">
                    {plan.bestFor}
                  </p>
                )}
              </div>

              {/* Price Display */}
              <div className="text-center space-y-2">
                <div className="text-5xl font-bold text-primary">
                  {isAnnual && plan.monthlyPrice
                    ? `${plan.monthlyPrice} ₪`
                    : plan.price}
                  <span className="text-lg font-normal text-muted-foreground mr-2">
                    לחודש
                  </span>
                </div>
                {isAnnual && plan.monthlyPrice && plan.discount && (
                  <div className="text-sm text-muted-foreground bg-green-50 p-2 rounded">
                    חיסכון שנתי של{" "}
                    <span className="font-bold text-green-600">
                      {Math.round(
                        plan.monthlyPrice * 12 * (plan.discount / 100)
                      )}{" "}
                      ₪
                    </span>
                  </div>
                )}
              </div>

              {/* Features List */}
              <ul className="space-y-4 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className={`flex items-center gap-3 ${
                      feature.isHighlighted
                        ? "font-bold text-primary bg-primary/5 p-2 rounded-lg"
                        : "text-foreground"
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

              {/* Benefit Explanations Section */}
              {plan.planType && planBenefitMappings[plan.planType] && (
                <div className="space-y-4 pt-6 border-t border-border/50">
                  <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    היתרונות לעסק שלך:
                  </h4>
                  <div className="space-y-4">
                    {planBenefitMappings[plan.planType].map((benefitKey) => {
                      const benefit =
                        benefitExplanations[
                          benefitKey as keyof typeof benefitExplanations
                        ];
                      return (
                        <div
                          key={benefitKey}
                          className="space-y-1 bg-muted/30 p-3 rounded-lg"
                        >
                          <p className="text-sm font-bold text-foreground">
                            {benefit.title}
                          </p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {benefit.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <Button
                size="lg"
                variant={plan.isRecommended ? "default" : "outline"}
                className={`w-full mt-auto py-4 text-lg font-bold transition-all duration-300 ${
                  plan.isRecommended
                    ? "bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl"
                    : "border-2 hover:border-primary hover:bg-primary/5"
                } ${plan.isComingSoon ? "opacity-60" : ""}`}
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
