"use client";

import { useState } from "react";
import { SharedPricingTable } from "@/components/business/shared-pricing-table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingModal } from "@/components/ui/loading-modal";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { CheckCircle2 } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
/** Normalises any URL → host part ("example.com"). */
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
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
/** Normalises any URL → host part (“example.com”). */
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
  const { update: updateSession, data: session } = useSession();

  // ───────────────────────────────────────────────────────────────────────────
  // FREE PLAN REGISTRATION / DOWNGRADE
  // ───────────────────────────────────────────────────────────────────────────
  const handleFreePlanRegistration = async () => {
    setLoading(true);
    try {
      const domain = cleanDomain(websiteUrl);

      // 1. Get current user
      const sessionRes = await fetch("/api/auth/session");
      const currentSession = await sessionRes.json();
      const userId = currentSession?.user?.id;
      if (!userId) throw new Error("המשתמש אינו מחובר");

      // 2. Check if website already exists
      const websiteCheckRes = await fetch(
        `/api/website/check?url=${encodeURIComponent(domain)}`
      );

      if (!websiteCheckRes.ok && websiteCheckRes.status !== 404) {
        throw new Error("שגיאה בבדיקת אתר קיים");
      }
      const existingWebsite = websiteCheckRes.ok
        ? await websiteCheckRes.json()
        : null;

      // 3. Ownership collision guard
      if (
        existingWebsite?.owner &&
        existingWebsite.owner !== userId /* someone else */
      ) {
        throw new Error("האתר כבר משויך למשתמש אחר");
      }

      // 4. Prepare website payload (merge, don't clobber)
      const websitePayload = {
        ...(existingWebsite ?? {}),
        url: domain,
        owner: userId,
        isVerified: true,
        pricingModel: "free",
        // keep category/name if present, else fallback
        categories: existingWebsite?.categories ?? ["other"],
        name: existingWebsite?.name ?? websiteUrl,
      };

      // 5. Create or update website
      const websiteUpdateRes = await fetch("/api/website/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(websitePayload),
      });
      if (!websiteUpdateRes.ok) throw new Error("נכשל בעדכון/יצירת האתר");
      const { _id: websiteId } = await websiteUpdateRes.json();

      // 6. Update user (API should merge arrays server-side)
      const userUpdateRes = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "business_owner",
          isWebsiteOwner: true,
          isVerifiedWebsiteOwner: true,
          relatedWebsite: domain,
          websites: [websiteId],
          currentPricingModel: "free",
        }),
      });
      if (!userUpdateRes.ok) throw new Error("נכשל בעדכון פרטי המשתמש");

      // 7. Refresh session → redirect
      await updateSession();

      console.log("Redirecting to dashboard...");
      window.location.href = "/business/dashboard?firstTime=true";
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

  // ───────────────────────────────────────────────────────────────────────────
  // BASIC/PRO PLAN HANDLERS (COMING SOON)
  // ───────────────────────────────────────────────────────────────────────────
  const handleBasicSubscription = async () => {
    toast({
      title: "מסלול Basic",
      description: "המסלול Basic יהיה זמין בקרוב. נרשמת למסלול החינמי.",
    });
    await handleFreePlanRegistration();
  };

  const handleProSubscription = () => {
    toast({
      title: "מסלול Pro",
      description: "המסלול Pro יהיה זמין בקרוב!",
    });
  };

  // Define plan actions for the shared component
  const planActions = {
    onStarterClick: handleFreePlanRegistration,
    onBasicClick: handleBasicSubscription,
    onProClick: handleProSubscription,
  };

  return (
    <div className="space-y-8" dir="rtl">
      <LoadingModal open={loading || loadingParent} />

      <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800 p-6">
        <CheckCircle2 className="h-5 w-5" />
        <AlertDescription className="text-lg font-semibold">
          🎉 מזל טוב! הדומיין שלך אומת בהצלחה!
          <br />
          <span className="font-normal">
            כעת בחר את המסלול שיעזור לך להגיע ללקוחות חדשים
          </span>
        </AlertDescription>
      </Alert>

      <SharedPricingTable
        planActions={planActions}
        loading={loading}
        showBillingToggle={true}
        defaultAnnual={false}
      />

      <div className="text-center space-y-4 bg-muted/30 p-6 rounded-lg">
        <p className="text-lg font-semibold text-foreground">
          💳 תשלום מאובטח ובטוח
        </p>
        <p className="text-sm text-muted-foreground">
          ביטול בכל עת • ללא התחייבויות • תמיכה 24/7 • המחירים לפני מע״מ
        </p>
      </div>
    </div>
  );
}
