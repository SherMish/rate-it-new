"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { LoginModal } from "@/components/auth/login-modal";
import { WebsiteRegistrationForm } from "@/components/business/registration/WebsiteForm";
import { DomainVerificationForm } from "@/components/business/registration/DomainVerificationForm";
import {
  cleanDomain,
  PricingSection,
} from "@/components/business/registration/PricingSection";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useLoginModal } from "@/hooks/use-login-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { verifyDomain as verifyDomainAction } from "@/app/actions/verification";
import { HelpDialog } from "@/components/business/registration/HelpDialog";

export default function BusinessRegistration() {
  const router = useRouter();
  const { update: updateSession, data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(() => {
    // Initialize step based on URL params
    const token = searchParams?.get("token");
    const stepParam = searchParams?.get("step");
    if (token && stepParam === "4") {
      return 4;
    }
    return 1;
  });
  const loginModal = useLoginModal();
  const [formData, setFormData] = useState({
    websiteUrl: searchParams?.get("url") ?? "",
    businessName: "",
    fullName: "",
    phoneNumber: "",
    role: "",
    agreedToTerms: false,
  });
  const [verifiedWebsiteUrl, setVerifiedWebsiteUrl] = useState<string | null>(
    null
  );

  const [isLoading, setLoading] = useState(false);

  // Redirect to dashboard if user is already linked to a business
  useEffect(() => {
    if (session?.user?.businessId && step === 1) {
      //can use isWebsiteOwner
      window.location.href = "/business/dashboard";
    }
  }, [session]);

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams?.get("token");
      if (token && step === 4) {
        try {
          const result = await verifyDomainAction(token);
          if (!result.success) setVerifiedWebsiteUrl(null);
          else {
            setVerifiedWebsiteUrl(result.websiteUrl);
            const websiteUrl = result.websiteUrl;
            if (!websiteUrl) {
              toast({
                variant: "destructive",
                title: "שגיאה",
                description: "כתובת האתר חסרה. אנא נסו שוב.",
              });
              return;
            }

            setLoading(true);
            try {
              // 1. Clean domain
              const domain = cleanDomain(websiteUrl);

              // 2. Get current user
              const sessionRes = await fetch("/api/auth/session");
              const session = await sessionRes.json();
              const userId = session?.user?.id;
              if (!userId) throw new Error("המשתמש אינו מחובר");

              // 3. Check if website already exists
              const websiteCheckRes = await fetch(
                `/api/website/check?url=${encodeURIComponent(domain)}`
              );

              if (!websiteCheckRes.ok && websiteCheckRes.status !== 404) {
                throw new Error("שגיאה בבדיקת אתר קיים");
              }
              const existingWebsite = websiteCheckRes.ok
                ? await websiteCheckRes.json()
                : null;
              // 4. Ownership collision guard
              if (
                existingWebsite?.owner &&
                existingWebsite.owner !== userId /* someone else */
              ) {
                throw new Error("האתר כבר משויך למשתמש אחר");
              }
              // 5. Already mine & already on FREE → just go to dashboard
              // if (
              //   existingWebsite?.owner === userId &&
              //   existingWebsite?.pricingModel === "free"
              // ) {
              //   router.push("/business/dashboard");
              //   return;
              // }

              // 6. Prepare payload (merge, don't clobber)
              const websitePayload = {
                ...(existingWebsite ?? {}),
                url: domain,
                owner: userId,
                isVerified: true,
                pricingModel: "free",
                // keep category/name if present, else fallback
                category: existingWebsite?.category ?? "other",
                name: existingWebsite?.name,
              };

              // 7. Create or update website
              const websiteUpdateRes = await fetch("/api/website/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(websitePayload),
              });
              if (!websiteUpdateRes.ok)
                throw new Error("נכשל בעדכון/יצירת האתר");
              const { _id: websiteId } = await websiteUpdateRes.json();

              // 8. Update user (API should merge arrays server-side)
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

              // 9. Refresh session → redirect
              await updateSession();
              router.push("/business/dashboard?firstTime=true");
            } catch (error) {
              console.error("Error in handleFreePlanRegistration:", error);
              toast({
                variant: "destructive",
                title: "שגיאה ברישום",
                description:
                  error instanceof Error
                    ? error.message
                    : "משהו השתבש. אנא נסו שוב.",
              });
            } finally {
              setLoading(false);
            }
          }
        } catch (error) {
          console.error("Verification error:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description:
              error instanceof Error
                ? error.message
                : "Failed to verify domain ownership.",
          });
          setStep(3);
        }
      }
    };

    if (!verifiedWebsiteUrl) {
      verifyToken();
    }
  }, []);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  const steps = [
    { title: "כניסה למערכת", description: "התחברו או צרו חשבון חדש" },
    { title: "פרטי העסק", description: "ספרו לנו על העסק שלכם" },
    { title: "אימות בעלות", description: "אמתו את הבעלות על האתר" },
    { title: "הגדרות תצוגה", description: "בחרו כיצד יופיע הפרופיל שלכם באתר" },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,#3b82f615,transparent_70%),radial-gradient(ellipse_at_bottom,#6366f115,transparent_70%)] pointer-events-none" />

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">
            הדרך הנכונה להפוך לקוחות מרוצים לשגרירים{" "}
          </h1>
          <p className="text-muted-foreground text-lg">
            רייט-איט עוזרת לעסקים לבנות אמון, למשוך יותר לקוחות ולהבליט את הערך
            שלכם{" "}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12 relative z-10 px-2" dir="rtl">
          <div className="flex justify-between relative">
            {/* Step divider lines */}
            <div
              className="absolute top-5 left-0 right-0 h-[2px] bg-border -z-10"
              style={{ margin: "0 auto", width: "75%" }}
            ></div>

            {steps.map((s, i) => (
              <div
                key={s.title}
                className="flex-1 relative flex flex-col items-center"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border z-[5] bg-background
                  ${
                    i + 1 === step
                      ? "bg-primary text-primary-foreground border-primary/30 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                      : i + 1 < step
                      ? "bg-success text-success-foreground border-success/30"
                      : "bg-muted border-muted-foreground/20"
                  }`}
                >
                  {i + 1 < step ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <span className="font-medium">{i + 1}</span>
                  )}
                </div>
                <div
                  className={`text-sm font-medium ${
                    i + 1 === step
                      ? "text-primary"
                      : i + 1 < step
                      ? "text-success"
                      : "text-muted-foreground"
                  }`}
                >
                  {s.title}
                </div>
                <div className="text-xs text-muted-foreground text-center px-1">
                  {s.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card className="relative z-10 shadow-lg border-border/50 backdrop-blur-sm bg-background/95">
          <CardContent className="pt-6">
            {/* Step 1: Authentication */}
            <div className={`${step !== 1 ? "hidden" : ""}`}>
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">
                  התחברות להתחלת רישום
                </h2>
                {!session ? (
                  <Button
                    size="lg"
                    onClick={() => loginModal.onOpen()}
                    className="w-full max-w-sm"
                  >
                    התחברות / הרשמה
                  </Button>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>מחובר/ת בתור {session.user.email}</span>
                    </div>
                    <Button onClick={() => setStep(2)}>להמשך ההרשמה</Button>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Website Registration */}
            {session && step === 2 && (
              <WebsiteRegistrationForm
                formData={formData}
                setFormData={setFormData}
                onComplete={() => setStep(3)}
              />
            )}

            {/* Step 3: Domain Verification */}
            {session && step === 3 && (
              <DomainVerificationForm
                websiteUrl={formData.websiteUrl}
                businessName={formData.businessName}
                onComplete={() => setStep(4)}
                onBack={() => setStep(2)}
              />
            )}

            {/* Step 4: Pricing */}
            {session && step === 4 && verifiedWebsiteUrl && (
              <PricingSection
                websiteUrl={verifiedWebsiteUrl || formData.websiteUrl}
                loadingParent={isLoading}
              />
            )}

            {(session && step === 4 && !verifiedWebsiteUrl) ||
              (!session && step > 1 && (
                <div className="text-center">
                  משהו השתבש בדרך :( נסו שוב מאוחר יותר או שצרו קשר עם התמיכה
                  <br />
                  <Button onClick={() => router.push("/business")}>
                    חזרה לדף הבית
                  </Button>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Why Join Section */}
      <div className="mt-12 max-w-4xl mx-auto px-4 pb-12 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-8">
          למה כדאי להצטרף לרייט-איט?
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-primary">
              הראו שאתם עסק שאפשר לסמוך עליו
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  ביקורות אמיתיות יעזרו לכם לבנות אמון ולהיראות מקצועיים בעיני
                  לקוחות חדשים.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-primary">
              בלטו מול מתחרים בלי ביקורות
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  עסק עם חוות דעת חיוביות תמיד ייבחר על פני עסקים אנונימיים.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-primary">
              קחו שליטה על המוניטין שלכם
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  עדכנו פרטים, הגיבו לביקורות ובנו לעצמכם נוכחות דיגיטלית
                  חיובית.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-primary">
              הגיעו ללקוחות שמחפשים אתכם
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  הציגו את העסק שלכם במקום שבו לקוחות בודקים לפני שהם בוחרים.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Help Dialog - Always visible during registration */}
      <HelpDialog />
    </div>
  );
}
