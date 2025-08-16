"use client";

import { useState } from "react";
import { SharedPricingTable } from "@/components/business/shared-pricing-table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingModal } from "@/components/ui/loading-modal";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { CheckCircle2 } from "lucide-react";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";


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
  // BASIC PLAN REGISTRATION - SIMPLIFIED (Business logic moved to verification)
  // ───────────────────────────────────────────────────────────────────────────
  const handleBasicPlanRegistration = async () => {
    setLoading(true);
    
    // Track basic plan selection
    trackEvent(AnalyticsEvents.BUSINESS_PRICING_BASIC_SELECTED, {
      step: "pricing_selection",
      website_url: websiteUrl,
      plan_type: "basic"
    });
    
    try {
      // Since verification already completed business registration,
      // we just need to refresh session and redirect to dashboard
      await updateSession();

      // Track completed registration
      trackEvent(AnalyticsEvents.BUSINESS_REGISTRATION_COMPLETED, {
        website_url: websiteUrl,
        plan_selected: "basic",
        final_step: "pricing"
      });

      console.log("Redirecting to dashboard...");
      window.location.href = "/business/dashboard?firstTime=true";
    } catch (error) {
      console.error("Error in handleBasicPlanRegistration:", error);
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "משהו השתבש בניתוב לדשבורד. אנא נסו שוב.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // PLUS/PRO PLAN HANDLERS (COMING SOON)
  // ───────────────────────────────────────────────────────────────────────────
  const handlePlusSubscription = async () => {
    // Track plus plan selection attempt
    trackEvent(AnalyticsEvents.BUSINESS_PRICING_PLUS_SELECTED, {
      step: "pricing_selection",
      website_url: websiteUrl,
      plan_type: "plus"
    });
    
    toast({
      title: "מסלול Plus",
      description: "המסלול Plus יהיה זמין בקרוב. נרשמת למסלול החינמי.",
    });
    await handleBasicPlanRegistration();
  };

  const handleProSubscription = () => {
    // Track pro plan selection attempt
    trackEvent(AnalyticsEvents.BUSINESS_PRICING_PRO_SELECTED, {
      step: "pricing_selection",
      website_url: websiteUrl,
      plan_type: "pro"
    });
    
    toast({
      title: "מסלול Pro",
      description: "המסלול Pro יהיה זמין בקרוב!",
    });
  };

  // Define plan actions for the shared component
  const planActions = {
    onBasicClick: handleBasicPlanRegistration,
    onPlusClick: handlePlusSubscription,
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
        defaultAnnual={true}
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
