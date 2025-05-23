"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PricingPlansUI } from "@/components/business/pricing-plans-ui";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingModal } from "@/components/ui/loading-modal";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { CheckCircle2 } from "lucide-react";

const freeFeatures = [
  { text: "פרופיל עסקי מאומת" },
  { text: "לוח בקרה בסיסי" },
  { text: "ניהול ביקורות" },
];

const plusFeatures = [
  { text: "כל מה שבחינם, ובנוסף:", isHighlighted: true },
  { text: "רישום מומלץ בדף הבית" },
  { text: "אנליטיקות מתקדמות (צפיות, קליקים, המרות)" },
  { text: "תג מאומת (Verified Badge)" },
  { text: "מיתוג מותאם אישית לדף העסק" },
  { text: "יצירת עד 5 קופונים" },
  { text: "תמיכה מהירה יותר" },
];

export function PricingSection({ websiteUrl }: { websiteUrl: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { update: updateSession } = useSession();

  const handleFreePlanRegistration = async () => {
    if (!websiteUrl) {
      console.error("No website URL provided");
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "כתובת האתר חסרה. אנא נסו שוב.",
      });
      return;
    }
    setLoading(true);
    try {
      let cleanUrl = websiteUrl
        .toLowerCase()
        .replace(/^(https?|ftp):\/\//, "")
        .replace(/^(www\.)?/i, "")
        .split("/")[0];

      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const userId = session?.user?.id;
      if (!userId) throw new Error("המשתמש אינו מחובר");

      const websiteCheckRes = await fetch(
        `/api/website/check?url=${encodeURIComponent(cleanUrl)}`
      );
      const existingWebsite = await websiteCheckRes.json();
      let websiteId = existingWebsite?._id;

      const websitePayload: any = {
        url: cleanUrl,
        owner: userId,
        isVerified: true,
        category: existingWebsite?.category || "other",
        pricingModel: "free",
      };
      if (existingWebsite?.name) websitePayload.name = existingWebsite.name;

      const websiteUpdateRes = await fetch("/api/website/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(websitePayload),
      });
      if (!websiteUpdateRes.ok) throw new Error("נכשל בעדכון/יצירת האתר");
      const newWebsiteData = await websiteUpdateRes.json();
      websiteId = newWebsiteData._id;

      const userUpdateRes = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "business_owner",
          isWebsiteOwner: true,
          isVerifiedWebsiteOwner: true,
          relatedWebsite: cleanUrl,
          websites: [websiteId],
          currentPricingModel: "free",
        }),
      });
      if (!userUpdateRes.ok) throw new Error("נכשל בעדכון פרטי המשתמש");

      await updateSession();
      await new Promise((resolve) => setTimeout(resolve, 500));

      localStorage.removeItem("businessRegistration");
      router.push("/business/dashboard?firstTime=true");
    } catch (error) {
      console.error("Error in handleFreePlanRegistration:", error);
      toast({
        variant: "destructive",
        title: "שגיאה ברישום",
        description:
          error instanceof Error ? error.message : "משהו השתבש. אנא נסו שוב.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlusSubscription = async () => {
    setLoading(true);
    toast({
      title: "בקרוב!",
      description: "אפשרות התשלום למסלול פלוס תהיה זמינה בקרוב.",
    });
    setLoading(false);
  };

  const registrationPlans = [
    {
      name: "חינם",
      price: "0 ₪",
      priceDetails: "לתמיד",
      features: freeFeatures,
      ctaText: "התחילו בחינם",
      onCtaClick: handleFreePlanRegistration,
    },
    {
      name: "פלוס",
      price: "39 ₪",
      priceDetails: "לחודש (בתוספת מע״מ)",
      features: plusFeatures,
      ctaText: "שדרגו לפלוס",
      onCtaClick: handlePlusSubscription,
      isRecommended: true,
      highlightColor: "primary",
    },
  ];

  return (
    <div className="space-y-8" dir="rtl">
      <LoadingModal open={loading} />
      <Alert className="bg-green-100 border-green-200 text-green-700">
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>
          הדומיין שלך אומת בהצלחה! בחר/י את המסלול המתאים לך כדי להמשיך.
        </AlertDescription>
      </Alert>
      <PricingPlansUI plans={registrationPlans} loading={loading} />
      <div className="text-center text-sm text-muted-foreground">
        <p>תשלום מאובטח. ניתן לבטל בכל עת.</p>
      </div>
    </div>
  );
}
