"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PricingPlansUI } from "@/components/business/pricing-plans-ui";
import { LoadingModal } from "@/components/ui/loading-modal";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { ArrowRight, BadgeCheck, CheckCircle2 } from "lucide-react";
import { useBusinessGuard } from "@/hooks/use-business-guard";
import { PricingModel } from "@/lib/types/website";
import { plusFeatures } from "@/components/business/registration/PricingSection";
import { freeFeatures } from "@/components/business/registration/PricingSection";

// const freeFeatures = [
//   { text: "פרופיל עסקי מאומת" },
//   { text: "לוח בקרה בסיסי" },
//   { text: "ניהול ביקורות" },
//   { text: "תג של RateIt בדף העסק" },
// ];

// const plusFeatures = [
//   { text: "כל מה שבחינם, ובנוסף:", isHighlighted: true, icon: ArrowRight },
//   { text: "רישום מומלץ בדף הבית ובקטגוריות", icon: BadgeCheck },
//   { text: "אנליטיקות מתקדמות (צפיות, קליקים, המרות)", icon: BadgeCheck },
//   { text: "תג מאומת (Verified Badge) המגביר אמינות", icon: BadgeCheck },
//   { text: "מיתוג מותאם אישית - הסתרת תג RateIt", icon: BadgeCheck },
//   { text: "יצירת עד 5 קופונים פעילים", icon: BadgeCheck },
//   { text: "יכולת מענה לביקורות", icon: BadgeCheck },
//   { text: "תמיכה מהירה יותר (עד 24 שעות)", icon: BadgeCheck },
// ];

// Placeholder for Pro plan if you add it
// const proFeatures = [
//   { text: "כל מה שבפלוס, ובנוסף:", isHighlighted: true, icon: ArrowRight },
//   { text: "קידום VIP בתוצאות חיפוש", icon: BadgeCheck },
//   { text: "ייעוץ אסטרטגי אישי (פעם ברבעון)", icon: BadgeCheck },
//   { text: "יצירת קופונים ללא הגבלה", icon: BadgeCheck },
//   { text: "API גישה לנתונים (בקרוב)", icon: BadgeCheck },
//   { text: "תמיכה פרימיום ייעודית (עד 4 שעות)", icon: BadgeCheck },
// ];

export default function BusinessPricingPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const { website, user, isLoading: isGuardLoading } = useBusinessGuard();
  const [currentPlan, setCurrentPlan] = useState<PricingModel | null>(null);

  useEffect(() => {
    if (website?.pricingModel) {
      setCurrentPlan(website.pricingModel as PricingModel);
    }
  }, [website]);

  const handleSubscription = async (plan: PricingModel) => {
    setLoading(true);
    if (!session?.user?.id || !website?._id) {
      toast({
        title: "שגיאה",
        description: "נדרשת התחברות ופרטי עסק חסרים.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Placeholder for Stripe integration
    // Replace with actual Stripe checkout logic
    try {
      // Simulate API call to update subscription
      const response = await fetch("/api/business/update-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteId: website._id,
          newPricingModel: plan,
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "נכשל בעדכון המנוי.");
      }

      await updateSession(); // Refresh session data
      setCurrentPlan(plan);

      toast({
        title: "הצלחה!",
        description: `העסק שלך שודרג למסלול ${
          plan === PricingModel.PLUS ? "פלוס" : plan
        }.`,
      });
      router.push("/business/dashboard");
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "שגיאת שדרוג",
        description:
          error instanceof Error ? error.message : "משהו השתבש. נסו שוב.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const plansConfig = [
    {
      name: "חינם",
      price: "0 ₪",
      priceDetails: "לתמיד",
      features: freeFeatures,
      ctaText: "הישאר בחינם",
      onCtaClick: () => router.push("/business/dashboard"),
      isCurrent: currentPlan === PricingModel.FREE,
      isDisabled: currentPlan === PricingModel.FREE,
    },
    {
      name: "פלוס",
      price: "39 ₪",
      priceDetails: "לחודש (בתוספת מע״מ)",
      features: plusFeatures,
      ctaText:
        currentPlan === PricingModel.PLUS ? "המסלול הנוכחי שלך" : "שדרגו לפלוס",
      onCtaClick: () => handleSubscription(PricingModel.PLUS),
      isRecommended: true,
      isCurrent: currentPlan === PricingModel.PLUS,
      isDisabled: currentPlan === PricingModel.PLUS,
      highlightColor: "primary",
    },
    // Example for a Pro plan, can be uncommented and configured later
    // {
    //   name: "פרו",
    //   price: "99 ₪",
    //   priceDetails: "לחודש (בתוספת מע״מ)",
    //   features: proFeatures,
    //   ctaText: "שדרגו לפרו",
    //   onCtaClick: () => handleSubscription(PricingModel.PRO), // Assuming PricingModel.PRO exists
    //   isCurrent: currentPlan === PricingModel.PRO,
    //   isDisabled: true, // Disabled for now
    //   highlightColor: "purple-600",
    // },
  ];

  if (isGuardLoading) {
    return <LoadingModal open={true} />;
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen" dir="rtl">
      <LoadingModal open={loading} />
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          שדרגו את התוכנית שלכם
        </h1>
        <p className="mt-3 text-xl text-muted-foreground sm:mt-4">
          בחרו את המסלול המתאים ביותר לצמיחת העסק שלכם בפלטפורמה.
        </p>
      </div>
      <PricingPlansUI plans={plansConfig} loading={loading} />
      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>כל התשלומים מאובטחים. ניתן לשנות או לבטל את המסלול בכל עת.</p>
      </div>
    </div>
  );
}
