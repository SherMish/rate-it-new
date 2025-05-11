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

const freeFeatures = [
  "Verified business profile",
  "Basic analytics dashboard",
  "Review management",
];

const proOnlyFeatures = [
  "Featured listing",
  "Full analytics dashboard",
  "Custom branding",
  "Priority support",
  "Full control over tool page",
  "Early access to new features",
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
        title: "Error",
        description: "Website URL is missing. Please try again.",
      });
      return;
    }

    setLoading(true);
    console.log("Starting free plan registration for:", websiteUrl);

    try {
      // Get saved registration data
      const savedData = JSON.parse(
        localStorage.getItem("businessRegistration") || "{}"
      );

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
      if (!userId) throw new Error("User not authenticated");

      // Generate metadata only if needed
      let metadata = null;
      if (!existingWebsite.radarTrust) {
        const metadataResponse = await fetch("/api/admin/generate-metadata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: websiteUrl }),
        });

        if (metadataResponse.ok) {
          metadata = await metadataResponse.json();
        }
      }

      // If website doesn't exist or metadata was generated, update/create it
      let websiteId = existingWebsite?._id; // Use existing website ID if available
      // if (!websiteId || metadata) {
      const websiteUpdateRes = await fetch("/api/website/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: cleanUrl,
          name: savedData.businessName,
          owner: userId,
          isVerified: true,
          category: "general-ai",
          ...(metadata || {}),
        }),
      });

      if (!websiteUpdateRes.ok) throw new Error("Failed to update website");
      const newWebsiteData = await websiteUpdateRes.json();
      websiteId = newWebsiteData._id;
      // }

      // Update user profile with the website ID
      const userUpdateRes = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: savedData.fullName,
          phone: savedData.phoneNumber,
          workRole: savedData.role,
          workEmail: savedData.workEmail,
          role: "business_owner",
          isWebsiteOwner: true,
          isVerifiedWebsiteOwner: true,
          relatedWebsite: cleanUrl,
          websites: [websiteId], // Ensuring array format for multiple websites
        }),
      });

      if (!userUpdateRes.ok) throw new Error("Failed to update user");

      // Force session update and wait for it
      await updateSession();

      // Add a small delay to ensure session is properly propagated
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Verify session before redirect
      const verifySessionRes = await fetch("/api/auth/session");
      const updatedSession = await verifySessionRes.json();
      console.log("Updated session:", updatedSession);
      if (!updatedSession?.user?.websites) {
        throw new Error("Session update failed");
      }

      // Clear registration data and redirect
      localStorage.removeItem("businessRegistration");
      router.push("/business/dashboard");
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <LoadingModal open={loading} />

      {/* Success Message */}
      <Alert className="bg-success/10 border-success/20 text-success">
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>
          Your domain has been successfully verified! Choose your plan to
          continue.
        </AlertDescription>
      </Alert>

      {/* Billing Toggle */}
      {/* <div className="flex justify-center items-center gap-4">
        <span className={!isAnnual ? "font-semibold" : "text-muted-foreground"}>
          Monthly
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
            Annual
          </span>
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
            Save 37%
          </span>
        </div>
      </div> */}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <Card className="p-6 border-2 border-border/50">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold">Free</h3>
              <p className="text-muted-foreground mt-2">
                Basic features for getting started
              </p>
            </div>
            <div className="text-3xl font-bold">$0</div>
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
              Start with Free
            </Button>
          </div>
        </Card>

        {/* Pro Plan */}
        {/* <Card className="p-6 border-2 border-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-sm px-3 py-1 rounded-bl-lg">
            RECOMMENDED
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold">Pro</h3>
              <p className="text-muted-foreground mt-2">
                Advanced features to scale your AI business
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold">
                ${isAnnual ? Math.round(annualPrice / 12) : monthlyPrice}
                <span className="text-lg font-normal text-muted-foreground">
                  /mo
                </span>
              </div>
              {isAnnual && (
                <div className="text-sm text-muted-foreground mt-1">
                  Billed annually (${Math.round(annualPrice)}/year)
                </div>
              )}
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 font-medium text-primary">
                <ArrowRight className="h-5 w-5" />
                Everything in Free, plus:
              </li>
              {proOnlyFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2 pl-5">
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
                ? "Processing..."
                : isAnnual
                ? "Get Pro Annual"
                : "Get Pro Monthly"}
            </Button>
          </div>
        </Card> */}
      </div>

      {/* Trust Message */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Secure payment powered by Stripe. Cancel anytime.</p>
      </div>
    </div>
  );
}
