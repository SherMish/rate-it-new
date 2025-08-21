"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SharedPricingTable } from "@/components/business/shared-pricing-table";
import { useSession } from "next-auth/react";
import {
  CheckCircle2,
  ArrowRight,
  Users,
  Zap,
  Shield,
  Star,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePlanManagement } from "@/hooks/use-plan-management";

export default function PublicPricingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { userPlan, upgradeToPlusClick, upgradeToProClick, isCurrentPlan } =
    usePlanManagement();

  const handleGetStarted = () => {
    if (session?.user) {
      router.push("/business/register");
    } else {
      router.push("/business/register");
    }
  };

  const handleProClick = (billing?: "monthly" | "annual") => {
    console.log("Pro plan clicked with billing:", billing);
  }; // Define plan actions for the shared component
  const planActions = {
    onBasicClick: handleGetStarted,
    onPlusClick: upgradeToPlusClick,
    onProClick: handleProClick,
  };

  // Determine current plan if user is logged in
  const isCurrent = userPlan
    ? {
        basic: isCurrentPlan("basic"),
        plus: isCurrentPlan("plus"),
        pro: isCurrentPlan("pro"),
      }
    : {};

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Simple Header Section */}
      <div className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-12 mt-5">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-slate-900 mb-6">
              בנו מוניטין חזק עם ביקורות חיוביות{" "}
            </h1>
            <p className="text-2xl text-slate-600 max-w-3xl mx-auto">
              בחרו את התכנית הנכונה כדי להגיע ליותר לקוחות ולזכות באמונם.{" "}
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 py-16" dir="rtl">
        <SharedPricingTable
          planActions={planActions}
          loading={false}
          showBillingToggle={true}
          defaultAnnual={true}
          isCurrent={isCurrent}
        />
      </div>

      {/* Social Proof Section */}
      {/* <div className="bg-gradient-to-br from-slate-50 to-gray-100/80 py-16">
        <div className="max-w-6xl mx-auto px-4" dir="rtl">
          <h2 className="text-3xl font-bold text-center mb-12">
            מה לקוחותינו אומרים עלינו
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-lg mb-4 leading-relaxed">
                &ldquo;תוך חודש קיבלנו 23 ביקורות חיוביות והמכירות עלו ב-51%. הכי טוב שעשינו השנה!&rdquo;
              </blockquote>
              <footer className="text-sm text-muted-foreground">
                <strong>דני</strong>, חנות תכשיטים
              </footer>
            </Card>

            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-lg mb-4 leading-relaxed">
                &ldquo;הלקוחות סוף סוף רואים שאנחנו עסק אמין. ההזמנות דרך האתר עלו פי 3!&rdquo;
              </blockquote>
              <footer className="text-sm text-muted-foreground">
                <strong>מיכל</strong>, קוסמטיקה אונליין
              </footer>
            </Card>

            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-lg mb-4 leading-relaxed">
                &ldquo;התג המאומת עשה פלאים. הלקוחות מתקשרים יותר ומהססים פחות לקנות.&rdquo;
              </blockquote>
              <footer className="text-sm text-muted-foreground">
                <strong>יוסי</strong>, שירותי שיווק
              </footer>
            </Card>
          </div>
        </div>
      </div> */}

      {/* Why Choose Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4" dir="rtl">
          <h2 className="text-3xl font-bold text-center mb-12">
            למה לבחור ברייט-איט?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 border-l-4 border-l-green-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    87% מהקונים בודקים ביקורות לפני קנייה
                  </h3>
                  <p className="text-muted-foreground">
                    בלי ביקורות חיוביות, אתם מפסידים 9 מתוך 10 לקוחות
                    פוטנציאליים
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-blue-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    תג &apos;מאומת&apos; מגדיל אמון ב-67%
                  </h3>
                  <p className="text-muted-foreground">
                    לקוחות מעדיפים לקנות מעסקים מאומתים ומשלמים עבורם יותר
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-purple-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    ביקורת חיובית אחת = 5 המלצות אישיות
                  </h3>
                  <p className="text-muted-foreground">
                    הביקורות שלכם מחליפות את הצורך בשיווק יקר ומביאות לקוחות
                    חדשים
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-orange-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    הפכו מ&quot;עוד אחד&quot; לבחירה הברורה
                  </h3>
                  <p className="text-muted-foreground">
                    ביקורות חיוביות מבדילות אתכם מהמתחרים ומציגות אתכם כאופציה
                    מהימנה ומומלצת
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/10 via-blue-600/10 to-purple-700/15 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            🚀 התחילו להגדיל מכירות היום
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            הצטרפו ל-300 עסקים שכבר מגדילים רווחים עם רייט-איט
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-4 bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0"
            onClick={handleGetStarted}
          >
            התחילו בחינם - ללא כרטיס אשראי
            <ArrowRight className="h-5 w-5 mr-2" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            התחלה תוך 5 דקות • ביטול בכל עת • תמיכה 24/7
          </p>
        </div>
      </div>
    </div>
  );
}
