"use client";

import { Shield, Filter, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function MarketingSection() {
  const handleExploreClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="py-16 pb-8 relative overflow-hidden">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-semibold">
            ביקורות אמיתיות. תובנות אמיתיות. בחר כלי בינה מלאכותית בביטחון.
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            כל הביקורות ב-AI-Radar הן אמינות, אובייקטיביות ומאומתות לאותנטיות.
            ללא סינון או מניפולציה - רק משוב אמיתי ממשתמשים אמיתיים.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white shadow-md p-6 border border-border hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">ביקורות אמינות</h3>
              <p className="text-muted-foreground">
                כל ביקורת מגובה באימות משתמש והוכחות, המבטיחים תובנות אמינות.
              </p>
            </div>
          </Card>

          <Card className="bg-white shadow-md p-6 border border-border hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Filter className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold">פלטפורמה אובייקטיבית</h3>
              <p className="text-muted-foreground">
                AI-Radar אינו מסנן או מתפעל ביקורות - ההחלטה שלך מבוססת על
                חוויות אמיתיות.
              </p>
            </div>
          </Card>

          <Card className="bg-white shadow-md p-6 border border-border hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold">
                מצא את ההתאמה הטובה ביותר
              </h3>
              <p className="text-muted-foreground">
                השווה בקלות בין כלי בינה מלאכותית וקבל החלטות בטוחות לצרכים
                הספציפיים שלך.
              </p>
            </div>
          </Card>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="gradient-button"
            onClick={handleExploreClick}
          >
            התחל לחקור כלי בינה מלאכותית
          </Button>
        </div>
      </div>
    </div>
  );
}
