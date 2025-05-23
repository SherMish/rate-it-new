"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingModal } from "@/components/ui/loading-modal";
import { toast } from "@/components/ui/use-toast";
import { signOut, signIn, useSession } from "next-auth/react";

const freeFeatures = ["פרופיל עסקי מאומת", "לוח בקרה בסיסי", "ניהול ביקורות"];

const proOnlyFeatures = [
  "רישום מומלץ",
  "לוח בקרה מלא",
  "מיתוג מותאם אישית",
  "תמיכה בעדיפות גבוהה",
  "שליטה מלאה בדף העסק",
  "גישה מוקדמת לתכונות חדשות",
];

export function PricingSection({ websiteUrl }: { websiteUrl: string }) {
  const [isAnnual, setIsAnnual] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { update: updateSession } = useSession();

  const monthlyPrice = 249;
  const annualDiscount = 0.37; // 37% off
  const annualPrice = monthlyPrice * 12 * (1 - annualDiscount);

  const handleProSubscription = async () => {
    setLoading(true);
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_KEY as string
    );
    // Implement Stripe checkout
    setLoading(false);
  };

  const handleFreePlan = async () => {
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
      // Normalize and clean URL
      let cleanUrl = websiteUrl
        .toLowerCase()
        .replace(/^(https?:\/\/)?(www\.)?/i, "")
        .split("/")[0];

      // Fetch session and check website in parallel
      const [sessionRes, websiteRes] = await Promise.all([
        fetch("/api/auth/session"),
        fetch(`/api/website/check?url=${encodeURIComponent(cleanUrl)}`),
      ]);

      const session = await sessionRes.json();
      const existingWebsite = await websiteRes.json();

      const userId = session?.user?.id;
      if (!userId) throw new Error("המשתמש אינו מחובר");

      let websiteId = existingWebsite?._id; // Use existing website ID if available
      // if (!websiteId || metadata) {
      const websiteUpdateRes = await fetch("/api/website/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: cleanUrl,
          owner: userId,
          isVerified: true,
          category: "other",
        }),
      });

      if (!websiteUpdateRes.ok) throw new Error("נכשל בעדכון האתר");
      const newWebsiteData = await websiteUpdateRes.json();
      websiteId = newWebsiteData._id;
      // }

      // Update user profile with the website ID
      const userUpdateRes = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "business_owner",
          isWebsiteOwner: true,
          isVerifiedWebsiteOwner: true,
          relatedWebsite: cleanUrl,
          websites: [websiteId], // Ensuring array format for multiple websites
        }),
      });

      if (!userUpdateRes.ok) throw new Error("נכשל בעדכון פרטי המשתמש");

      // Force session update and wait for it
      await updateSession();

      // Add a small delay to ensure session is properly propagated
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Verify session before redirect
      const verifySessionRes = await fetch("/api/auth/session");
      const updatedSession = await verifySessionRes.json();
      if (!updatedSession?.user?.websites) {
        throw new Error("עדכון הסשן נכשל");
      }

      // Clear registration data and redirect
      localStorage.removeItem("businessRegistration");
      router.push("/business/dashboard?firstTime=true");
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "שגיאה",
        description:
          error instanceof Error ? error.message : "משהו השתבש. אנא נסו שוב.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      <LoadingModal open={loading} />

      {/* Success Message */}
      <Alert className="bg-success/10 border-success/20 text-success">
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>
          הדומיין שלך אומת בהצלחה! בחר/י את המסלול המתאים לך כדי להמשיך.
        </AlertDescription>
      </Alert>

      {/* Billing Toggle */}
      {/* <div className="flex justify-center items-center gap-4">
        <span className={!isAnnual ? "font-semibold" : "text-muted-foreground"}>
          חודשי
        </span>
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out ${
            isAnnual ? "bg-primary" : "bg-gray-200"
          }`}
        >
          <div
            className={`w-6 h-6 bg-white rounded-full shadow-md transform duration-200 ${
              isAnnual ? "translate-x-6" : ""
            }`}
          />
        </button>
        <div className="flex items-center gap-2">
          <span
            className={isAnnual ? "font-semibold" : "text-muted-foreground"}
          >
            שנתי
          </span>
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
            חסכו 37%
          </span>
        </div>
      </div> */}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <Card className="p-6 border-2 border-border/50">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold">חינם</h3>
              <p className="text-muted-foreground mt-2">
                תכונות בסיסיות להתחלה
              </p>
            </div>
            <div className="text-3xl font-bold">0 ₪</div>
            <ul className="space-y-3">
              {freeFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleFreePlan}
              disabled={loading}
            >
              התחילו בחינם
            </Button>
          </div>
        </Card>

        {/* Pro Plan */}
        {/* <Card className="p-6 border-2 border-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-sm px-3 py-1 rounded-bl-lg">
            מומלץ
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold">פרו</h3>
              <p className="text-muted-foreground mt-2">
                תכונות מתקדמות לעסק שלכם
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold">
                {isAnnual ? Math.round(annualPrice / 12) : monthlyPrice} ₪
                <span className="text-lg font-normal text-muted-foreground">
                  /לחודש
                </span>
              </div>
              {isAnnual && (
                <div className="text-sm text-muted-foreground mt-1">
                  חיוב שנתי ({Math.round(annualPrice)} ₪/לשנה)
                </div>
              )}
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 font-medium text-primary">
                <ArrowRight className="h-5 w-5" />
                כל מה שבחינם, ובנוסף:
              </li>
              {proOnlyFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2 pr-5">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              size="lg"
              onClick={handleProSubscription}
              disabled={loading}
            >
              {loading
                ? "מעבד..."
                : isAnnual
                ? "קבלו פרו שנתי"
                : "קבלו פרו חודשי"}
            </Button>
          </div>
        </Card> */}
      </div>

      {/* Trust Message */}
      <div className="text-center text-sm text-muted-foreground">
        <p>תשלום מאובטח באמצעות Stripe. ניתן לבטל בכל עת.</p>
      </div>
    </div>
  );
}
