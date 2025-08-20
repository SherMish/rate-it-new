"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Star, Zap, Crown, Gift, ArrowRight } from "lucide-react";
import { plusFeatures } from "@/components/business/shared-pricing-table";
import { PRICING_CONFIG, calculateDiscountedPrice, calculateTotalWithVAT, formatPrice, getPlanDiscount, getFullYearlyPrice, type PlanType } from "@/lib/pricing";

interface EmbeddedPaymentFormProps {
  planType: PlanType;
  isAnnual: boolean;
  websiteUrl: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EmbeddedPaymentForm({ 
  planType, 
  isAnnual, 
  websiteUrl,
  onSuccess, 
  onCancel 
}: EmbeddedPaymentFormProps) {
  const { data: session } = useSession();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [loading, setLoading] = useState(false);

  // Calculate pricing based on plan and billing period using shared config
  const monthlyBasePrice = PRICING_CONFIG.basePrices[planType];
  const discount = isAnnual ? getPlanDiscount(planType) : 0;
  const discountedPrice = calculateDiscountedPrice(planType, isAnnual);
  
  // For display purposes: crossed-out price should be full yearly for annual plans
  const crossedOutPrice = isAnnual ? getFullYearlyPrice(planType) : monthlyBasePrice;
  
  const features = planType === "plus" ? plusFeatures : [];
  const planDisplayName = planType === "plus" ? "Plus" : "Pro";

  const applyCoupon = () => {
    if (couponCode.trim().toUpperCase() === PRICING_CONFIG.coupons.EARLYPLUS) {
      setAppliedCoupon(PRICING_CONFIG.coupons.EARLYPLUS);
    } else {
      alert("קוד קופון לא תקין");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon("");
    setCouponCode("");
  };

  const calculateTotal = () => {
    if (appliedCoupon === PRICING_CONFIG.coupons.EARLYPLUS) return 0;
    return calculateTotalWithVAT(planType, isAnnual);
  };

  const handleUpgrade = async () => {
    setLoading(true);
    
    try {
      // Call API to upgrade the user's plan
      const response = await fetch("/api/business/upgrade-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: planType,
          couponCode: appliedCoupon,
          billing: isAnnual ? "annual" : "monthly",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upgrade plan");
      }

      // Call success handler
      onSuccess();
    } catch (error) {
      console.error("Upgrade failed:", error);
      const errorMessage = error instanceof Error ? error.message : "שגיאה לא ידועה";
      alert(`שגיאה בשדרוג התכנית: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          שדרגו ל-{planDisplayName} ותתחילו למכור יותר
        </h2>
        <p className="text-lg text-muted-foreground">
          צרו אמון עם הלקוחות שלכם והגדילו את המכירות
        </p>
        {isAnnual && discount > 0 && (
          <div className="mt-4 inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
            חסכון {discount}% בתשלום שנתי!
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Benefits Section */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/20 border-primary/30">
          <div className="flex items-center gap-3 mb-6">
            <Crown className="h-8 w-8 text-primary" />
            <h3 className="text-xl font-bold">יתרונות תכנית {planDisplayName}</h3>
          </div>
          
          <ul className="space-y-3">
            {features.map((feature, idx) => (
              <li
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  feature.isHighlighted
                    ? "bg-primary/20 border border-primary/40"
                    : "bg-white/60"
                }`}
              >
                {feature.isHighlighted ? (
                  <Star className="h-5 w-5 text-primary flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                )}
                <span className={feature.isHighlighted ? "font-semibold" : ""}>
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">מיוחד לחברי {planDisplayName}:</span>
            </div>
            <p className="text-green-700 text-sm">
              תקבלו תג &ldquo;עסק מאומת&rdquo; שיעזור ללקוחות לסמוך עליכם יותר ויגדיל את שיעור ההמרה
            </p>
          </div>
        </Card>

        {/* Payment Section */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-6">פרטי התשלום</h3>
          
          {/* Price Summary */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
              <span>תכנית {planDisplayName} ({isAnnual ? "שנתי" : "חודשי"})</span>
              <div className="text-left">
                {isAnnual && discount > 0 && (
                  <div className="text-sm text-muted-foreground line-through">
                    {formatPrice(crossedOutPrice)}
                  </div>
                )}
                <span className="font-semibold">{formatPrice(discountedPrice)}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
              <span>מעמ ({Math.round(PRICING_CONFIG.vatRate * 100)}%)</span>
              <span className="font-semibold">
                {appliedCoupon === PRICING_CONFIG.coupons.EARLYPLUS ? "0" : Math.round(discountedPrice * PRICING_CONFIG.vatRate)} ₪
              </span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-green-600" />
                  <span className="text-green-800">קופון {appliedCoupon}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-green-800">
                    -{discountedPrice + Math.round(discountedPrice * PRICING_CONFIG.vatRate)} ₪
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeCoupon}
                    className="text-green-600 hover:text-green-800"
                  >
                    הסר
                  </Button>
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>סה&quot;כ לתשלום</span>
                <span className={appliedCoupon === PRICING_CONFIG.coupons.EARLYPLUS ? "text-green-600" : ""}>
                  {calculateTotal()} ₪
                </span>
              </div>
            </div>
          </div>

          {/* Coupon Code */}
          {!appliedCoupon && (
            <div className="space-y-3 mb-6">
              <label className="block text-sm font-medium">קוד קופון (אופציונלי)</label>
              <div className="flex gap-2">
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="הזינו קוד קופון"
                  className="flex-1"
                />
                <Button
                  onClick={applyCoupon}
                  variant="outline"
                  disabled={!couponCode.trim()}
                >
                  החל
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                יש לכם קוד קופון? השתמשו בו כדי לקבל הנחה על התכנית
              </p>
            </div>
          )}

          {/* Special Offer Message */}
          {appliedCoupon === PRICING_CONFIG.coupons.EARLYPLUS && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-5 w-5 text-green-600" />
                <span className="font-bold text-green-800">מזל טוב! 🎉</span>
              </div>
              <p className="text-green-700 text-sm">
                קיבלתם חודש חינם של תכנית {planDisplayName}! התכנית תופעל מיד ותוכלו להתחיל ליהנות מכל היתרונות.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-6 text-lg font-semibold"
              size="lg"
            >
              {loading ? (
                "מעבד..."
              ) : appliedCoupon === PRICING_CONFIG.coupons.EARLYPLUS ? (
                <>
                  <Crown className="h-5 w-5 mr-2" />
                  הפעילו את תכנית {planDisplayName} בחינם
                </>
              ) : (
                <>
                  <ArrowRight className="h-5 w-5 mr-2" />
                  שדרגו ל-{planDisplayName}
                </>
              )}
            </Button>

            <Button
              onClick={onCancel}
              variant="outline"
              className="w-full"
              disabled={loading}
            >
              חזור לבחירת תכנית
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            לחיצה על הכפתור מהווה הסכמה ל
            <a href="/terms" className="text-primary hover:underline mx-1">
              תנאי השימוש
            </a>
            ו
            <a href="/privacy" className="text-primary hover:underline mx-1">
              מדיניות הפרטיות
            </a>
          </p>
        </Card>
      </div>
    </div>
  );
}
