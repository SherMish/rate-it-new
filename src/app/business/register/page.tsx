"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { LoginModal } from "@/components/auth/login-modal";
import { WebsiteRegistrationForm } from "@/components/business/registration/WebsiteForm";
import { DomainVerificationForm } from "@/components/business/registration/DomainVerificationForm";
import {
  PricingSection,
} from "@/components/business/registration/PricingSection";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useLoginModal } from "@/hooks/use-login-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
// verifyDomain import removed since token verification is deprecated
import { HelpDialog } from "@/components/business/registration/HelpDialog";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";

function BusinessRegistrationContent() {
  const router = useRouter();
  const { update: updateSession, data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(() => {
    // Initialize step based on URL params - token verification is deprecated
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

  // Track business registration started when page loads
  useEffect(() => {
    trackEvent(AnalyticsEvents.BUSINESS_REGISTRATION_STARTED, {
      source: "registration_page",
      step: "landing"
    });
  }, []);

  // Remove automatic redirect - now handled in step 1 UI
  // Users with verified businesses will see dashboard button in step 1 instead of automatic redirect

  // Token verification has been removed - now handled in DomainVerificationForm

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
      <div className={`relative mx-auto px-4 py-8 ${
        step === 4 ? 'max-w-7xl' : 'max-w-4xl'
      }`}>
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
                {!session ? (
                  <>
                    <h2 className="text-2xl font-semibold mb-4">
                      התחברות להתחלת רישום
                    </h2>
                    <Button
                      size="lg"
                      onClick={() => {
                        trackEvent(AnalyticsEvents.BUSINESS_REGISTRATION_LOGIN_CLICKED, {
                          step: "authentication",
                          user_type: "new_user"
                        });
                        loginModal.onOpen();
                      }}
                      className="w-full max-w-sm"
                    >
                      התחברות / הרשמה
                    </Button>
                  </>
                ) : session.user.role === "business_owner" &&
                  session.user.websites ? (
                  // User already has a verified business
                  <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="w-6 h-6" />
                      <span className="text-lg font-medium">
                        העסק שלך כבר רשום ופעיל!
                      </span>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-muted-foreground">
                        מחובר/ת בתור {session.user.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        אתה כבר בעל עסק רשום במערכת שלנו
                      </p>
                    </div>
                    <Button
                      size="lg"
                      onClick={() =>
                        (window.location.href = "/business/dashboard")
                      }
                      className="w-full max-w-sm"
                    >
                      מעבר לדשבורד העסק
                    </Button>
                  </div>
                ) : (
                  // User is logged in but doesn't have a verified business
                  <>
                    <h2 className="text-2xl font-semibold mb-4">
                      התחברות להתחלת רישום
                    </h2>
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex items-center gap-2 text-success">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>מחובר/ת בתור {session.user.email}</span>
                      </div>
                    <Button
                      onClick={() => {
                        trackEvent(AnalyticsEvents.BUSINESS_REGISTRATION_CONTINUE_CLICKED, {
                          step: "authentication_complete",
                          user_email: session.user.email,
                          user_type: "existing_user"
                        });
                        setStep(2);
                      }}
                    >
                      להמשך ההרשמה
                    </Button>
                    </div>
                  </>
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
                onComplete={(websiteUrl) => {
                  setVerifiedWebsiteUrl(websiteUrl);
                  setStep(4);
                }}
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

export default function BusinessRegistration() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BusinessRegistrationContent />
    </Suspense>
  );
}
