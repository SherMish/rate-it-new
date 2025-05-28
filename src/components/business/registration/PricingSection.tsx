"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PricingPlansUI } from "@/components/business/pricing-plans-ui";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingModal } from "@/components/ui/loading-modal";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { CheckCircle2 } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// STATIC PLAN DATA
// ─────────────────────────────────────────────────────────────────────────────
export const freeFeatures = [
  { text: "לוח בקרה בסיסי" },
  { text: "ניהול ביקורות" },
];

export const plusFeatures = [
  { text: "כל מה שבחינם, ובנוסף:" },
  { text: "תג מאומת (Verified Badge)", isHighlighted: true },

  // { text: "רישום מומלץ בדף הבית" },
  { text: "נתוני חשיפה והתנהגות גולשים בזמן אמת", isHighlighted: true },
  { text: "עדיפות במענה ותמיכה", isHighlighted: true },

  // { text: "מיתוג מותאם אישית לדף העסק" },
  // { text: "יצירת עד 5 קופונים" },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
/** Normalises any URL → host part (“example.com”). */
export const cleanDomain = (raw: string): string => {
  try {
    const urlObj = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    return urlObj.host.toLowerCase().replace(/^www\./, "");
  } catch {
    // fall back to basic sanitising
    return raw
      .toLowerCase()
      .replace(/^(https?|ftp):\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0];
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export function PricingSection({
  websiteUrl,
  loadingParent,
}: {
  websiteUrl: string;
  loadingParent: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const router = useRouter();
  const { update: updateSession, data: session } = useSession();

  // ───────────────────────────────────────────────────────────────────────────
  // FREE PLAN REGISTRATION / DOWNGRADE
  // ───────────────────────────────────────────────────────────────────────────
  const handleFreePlanRegistration = async () => {
    console.log("Redirecting to dashboard...");
    await updateSession();

    window.location.href = "/business/dashboard?firstTime=true";
    // router.refresh();
  };

  // ───────────────────────────────────────────────────────────────────────────
  // PLUS PLAN (placeholder / future Stripe)
  // ───────────────────────────────────────────────────────────────────────────
  const handlePlusSubscription = async () => {
    setLoading(true);
    try {
      const domain = cleanDomain(websiteUrl);

      // check current plan
      const res = await fetch(
        `/api/website/check?url=${encodeURIComponent(domain)}`
      );
      if (res.ok) {
        const ws = await res.json();
        if (ws.owner === session?.user?.id && ws.pricingModel === "plus") {
          toast({
            title: "כבר במסלול פלוס",
            description: "תודה על התמיכה!",
          });
          return;
        }
      }

      // TODO: Stripe checkout logic here …
      toast({
        title: "בקרוב!",
        description: "אפשרות התשלום למסלול פלוס תהיה זמינה בקרוב.",
      });
    } finally {
      setLoading(false);
    }
  };

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

  // ───────────────────────────────────────────────────────────────────────────
  // RENDER
  // ───────────────────────────────────────────────────────────────────────────
  const registrationPlans = [
    {
      name: "חינם",
      price: "0 ₪",
      features: freeFeatures,
      ctaText: "התחילו בחינם",
      onCtaClick: handleFreePlanRegistration,
      bestFor: "דרך קלה להתחיל לבנות אמון עם הלקוחות – בלי עלות.",
      planType: "free" as const,
    },
    {
      name: "פלוס",
      price: calculatePrice(79, 25),
      monthlyPrice: calculateMonthlyAverage(79, 25),
      discount: 25,
      features: plusFeatures,
      ctaText: "בקרוב",
      onCtaClick: handlePlusSubscription,
      // isRecommended: true,
      // highlightColor: "primary",
      bestFor: "מתאים לעסקים שמכוונים לבלוט בשוק תחרותי.",
      planType: "plus" as const,
      isComingSoon: true,
    },
  ];

  return (
    <div className="space-y-8" dir="rtl">
      <LoadingModal open={loading || loadingParent} />

      <Alert className="bg-green-100 border-green-200 text-green-700">
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>
          הדומיין שלך אומת בהצלחה! בחר/י את המסלול המתאים לך כדי להמשיך.
        </AlertDescription>
      </Alert>

      <PricingPlansUI
        plans={registrationPlans}
        loading={loading}
        isAnnual={isAnnual}
        onBillingChange={setIsAnnual}
      />

      <p className="text-center text-sm text-muted-foreground">
        תשלום מאובטח. ניתן לבטל בכל עת. המחירים לפני מע״מ.
      </p>
    </div>
  );
}
