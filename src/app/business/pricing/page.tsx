"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PricingPlansUI } from "@/components/business/pricing-plans-ui";
import { useSession } from "next-auth/react";
import { CheckCircle2, ArrowRight, Users, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Use the same features from PricingSection
export const freeFeatures = [
  { text: "לוח בקרה בסיסי כולל ניתוח ביקורות" },
  { text: "ניהול וטיפול בביקורות לקוחות" },
  { text: "פרופיל עסק מקצועי ברייט-איט" },
  { text: "עמוד ייעודי לעסק עם כל הפרטים" },
];

export const plusFeatures = [
  { text: "כל מה שבחינם, ובנוסף:" },
  {
    text: "תג מאומת (Verified Badge) - הוכח שהעסק אמיתי ואמין",
    isHighlighted: true,
  },
  { text: "נתוני חשיפה והתנהגות גולשים בזמן אמת", isHighlighted: true },
  { text: "עדיפות במענה ותמיכה VIP", isHighlighted: true },
  { text: "דוחות מתקדמים ואנליטיקה עסקית", isHighlighted: true },
  { text: "הצגה מועדפת במנוע החיפוש", isHighlighted: true },
];

export default function PublicPricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const calculatePrice = (basePrice: number, discount: number = 0) => {
    if (isAnnual) {
      const annualPrice = Math.round(basePrice * 12 * (1 - discount / 100));
      return `${annualPrice} ₪`;
    }
    return `${basePrice} ₪`;
  };

  const calculateMonthlyAverage = (basePrice: number, discount: number = 0) => {
    if (isAnnual) {
      return Math.round(basePrice * (1 - discount / 100));
    }
    return basePrice;
  };

  const handleGetStarted = () => {
    if (session?.user) {
      // If logged in, redirect to registration
      router.push("/business/register");
    } else {
      // If not logged in, redirect to registration (which will handle login)
      router.push("/business/register");
    }
  };

  const handleUpgrade = () => {
    if (session?.user?.isWebsiteOwner) {
      // If already a business owner, go to dashboard
      router.push("/business/dashboard");
    } else {
      // Otherwise start registration process
      router.push("/business/register");
    }
  };

  const publicPlans = [
    {
      name: "חינם",
      price: "0 ₪",
      features: freeFeatures,
      ctaText: session?.user?.isWebsiteOwner
        ? "המסלול הנוכחי שלך"
        : "התחל בחינם",
      onCtaClick: handleGetStarted,
      bestFor: "מושלם להתחלה! התחל לבנות אמון עם הלקוחות שלך בחינם",
      planType: "free" as const,
      isCurrent: session?.user?.isWebsiteOwner,
    },
    {
      name: "פלוס",
      price: calculatePrice(199, 25),
      monthlyPrice: calculateMonthlyAverage(199, 25),
      discount: 25,
      features: plusFeatures,
      ctaText: "שדרג לפלוס",
      onCtaClick: handleUpgrade,
      isRecommended: true,
      highlightColor: "primary",
      bestFor: "לעסקים שרוצים למקסם אמינות ולבלוט על מתחרים",
      planType: "plus" as const,
      isComingSoon: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center space-y-8">
            <h1 className="text-5xl font-bold text-foreground">
              איזה מסלול של רייט-איט הכי מתאים לעסק שלך?{" "}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              התחילו במסלול שמתאים לכם – בין אם אתם רק מתחילים או מוכנים להמריא.
            </p>

            {/* Trust Indicators */}
            <div className="flex justify-center items-center gap-8 pt-8">
              <div className="flex items-center gap-2 text-primary">
                <Users className="h-5 w-5" />
                <span className="text-sm font-medium">
                  אלפי עסקים בוטחים בנו
                </span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium">בטוח ומאובטח</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Zap className="h-5 w-5" />
                <span className="text-sm font-medium">התחלה מיידית</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 py-16" dir="rtl">
        <PricingPlansUI
          plans={publicPlans}
          loading={false}
          isAnnual={isAnnual}
          onBillingChange={setIsAnnual}
        />
      </div>

      {/* FAQ/Benefits Section */}
      <div className="bg-muted/20 py-16">
        <div className="max-w-4xl mx-auto px-4" dir="rtl">
          <h2 className="text-3xl font-bold text-center mb-12">
            למה לבחור ברייט-איט?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    בניית אמון עם לקוחות
                  </h3>
                  <p className="text-muted-foreground">
                    ביקורות אמיתיות ותג האימות שלנו יעזרו לכם לבנות אמון
                    ולהיראות מקצועיים
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">חשיפה מקסימלית</h3>
                  <p className="text-muted-foreground">
                    הופעה במנוע החיפוש ודף הבית שלנו תביא לכם לקוחות חדשים
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">ניהול קל וחכם</h3>
                  <p className="text-muted-foreground">
                    לוח בקרה מתקדם שמאפשר לכם לנהל ביקורות ולראות נתוני ביצועים
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">תמיכה מקצועית</h3>
                  <p className="text-muted-foreground">
                    צוות התמיכה שלנו כאן לעזור לכם בכל שלב - מההתחלה ועד ההצלחה
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">מוכנים להתחיל?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            הצטרפו לאלפי עסקים שכבר בוחרים ברייט-איט לבניית האמינות שלהם
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-4"
            onClick={handleGetStarted}
          >
            התחל עכשיו בחינם
            <ArrowRight className="h-5 w-5 mr-2" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            ללא התחייבות • התחלה תוך דקות • תמיכה 24/7
          </p>
        </div>
      </div>
    </div>
  );
}
