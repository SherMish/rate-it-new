"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  FileText,
  Image,
  Tag,
  MessageSquare,
  ChevronRight,
  Star,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface OnboardingGuideProps {
  website: any;
  className?: string;
}

interface GuideTip {
  id: string;
  title: string;
  description: string;
  icon: any;
  action: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  priority: number;
}

export function OnboardingGuide({ website, className }: OnboardingGuideProps) {
  const [hiddenTips, setHiddenTips] = useState<string[]>([]);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("hiddenOnboardingTips");
    if (saved) {
      setHiddenTips(JSON.parse(saved));
    }
  }, []);

  const hideTip = (tipId: string) => {
    const newHiddenTips = [...hiddenTips, tipId];
    setHiddenTips(newHiddenTips);
    localStorage.setItem("hiddenOnboardingTips", JSON.stringify(newHiddenTips));
  };

  const tips: GuideTip[] = [];

  if (!website?.shortDescription || website.shortDescription.length < 20) {
    tips.push({
      id: "description",
      title: "כתבו ללקוחות מה אתם באמת עושים",
      description:
        "תיאור ברור וקליט יבדל אתכם מהמתחרים ויגרום ללקוחות להבין מיד למה לבחור דווקא בכם.",
      icon: FileText,
      action: {
        label: "עריכת פרטי העסק",
        href: "/business/dashboard/tool",
      },
      priority: 1,
    });
  }

  if (!website?.logo) {
    tips.push({
      id: "logo",
      title: "הוסיפו לוגו שישדר מקצועיות ואמון",
      description:
        "לקוחות בוחרים לפי מראה ראשוני. לוגו מזוהה יוצר רושם ראשוני אמין ומבדיל אתכם מכל השאר.",
      icon: Image,
      action: {
        label: "העלאת לוגו",
        href: "/business/dashboard/tool",
      },
      priority: 2,
    });
  }

  if (!website?.category || website.category === "other") {
    tips.push({
      id: "category",
      title: "בחרו קטגוריה שהלקוחות מחפשים בה",
      description:
        "כשתבחרו קטגוריה מדויקת – לקוחות יוכלו למצוא אתכם דרך חיפושים ועמודי תחום.",
      icon: Tag,
      action: {
        label: "בחירת קטגוריה",
        href: "/business/dashboard/tool",
      },
      priority: 3,
    });
  }

  if (!website?.reviewCount || website.reviewCount === 0) {
    tips.push({
      id: "reviews",
      title: "הצעד הכי חשוב – קבלו ביקורת ראשונה",
      description:
        "לקוחות בודקים ביקורות לפני החלטה. שתפו את הקישור ובקשו המלצה מלקוח מרוצה שכבר סומך עליכם.",
      icon: MessageSquare,
      action: {
        label: "העתקת קישור לכתיבת ביקורת",
        onClick: async () => {
          try {
            const reviewUrl = `${
              window.location.origin
            }/tool/${encodeURIComponent(website.url)}/review`;
            await navigator.clipboard.writeText(reviewUrl);
            toast({
              title: "הקישור הועתק!",
              description: "שלחו אותו ללקוחות מרוצים כדי להתחיל לאסוף ביקורות",
            });
          } catch (error) {
            const fallbackUrl = `${
              window.location.origin
            }/tool/${encodeURIComponent(website.url)}`;
            const textArea = document.createElement("textarea");
            textArea.value = fallbackUrl;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
              document.execCommand("copy");
              toast({
                title: "הקישור הועתק!",
                description:
                  "שלחו אותו ללקוחות מרוצים כדי להתחיל לאסוף ביקורות",
              });
            } catch {
              toast({
                variant: "destructive",
                title: "שגיאה",
                description: "לא ניתן להעתיק את הקישור",
              });
            }
            document.body.removeChild(textArea);
          }
        },
      },
      priority: 4,
    });
  }

  if (website?.reviewCount > 0 && website.reviewCount < 5) {
    tips.push({
      id: "fiveReviews",
      title: "כמעט שם 🎯 – עוד קצת ואתם בולטים באמת",
      description: `יש לכם כבר ${
        website.reviewCount === 1
          ? "ביקורת אחת"
          : `${website.reviewCount} ביקורות`
      } – נהדר! עוד ${
        5 - website.reviewCount
      } ביקורות ותהיו זכאים למסלול פלוס לחודשיים בחינם!`,
      icon: Star,
      action: {
        label: "הזמינו עוד לקוחות לכתוב ביקורת",
        onClick: async () => {
          try {
            const reviewUrl = `${
              window.location.origin
            }/tool/${encodeURIComponent(website.url)}/review`;
            await navigator.clipboard.writeText(reviewUrl);
            toast({
              title: "הקישור הועתק! 🌟",
              description:
                "שתפו אותו שוב עם לקוחות נוספים כדי להגיע ל-5 ביקורות",
            });
          } catch (error) {
            const fallbackUrl = `${
              window.location.origin
            }/tool/${encodeURIComponent(website.url)}`;
            const textArea = document.createElement("textarea");
            textArea.value = fallbackUrl;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
              document.execCommand("copy");
              toast({
                title: "הקישור הועתק! 🌟",
                description:
                  "שתפו אותו שוב עם לקוחות נוספים כדי להגיע ל-5 ביקורות",
              });
            } catch {
              toast({
                variant: "destructive",
                title: "שגיאה",
                description: "לא ניתן להעתיק את הקישור",
              });
            }
            document.body.removeChild(textArea);
          }
        },
      },
      priority: 5,
    });
  }

  const activeTips = tips
    .filter((tip) => !hiddenTips.includes(tip.id))
    .sort((a, b) => a.priority - b.priority);

  if (activeTips.length === 0) return null;

  const currentTip = activeTips[currentTipIndex % activeTips.length];
  const Icon = currentTip.icon;
  const completedSteps = 5 - activeTips.length;
  const totalSteps = 5;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <Card
      className={cn(
        "mb-8 p-6 bg-gradient-to-r from-primary/5 to-purple-600/5 border-primary/20",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                {currentTip.title}
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  טיפ {currentTipIndex + 1} מתוך {activeTips.length}
                </span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {currentTip.description}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>שלבים להבליט את העסק שלכם</span>
              <span>
                {completedSteps} מתוך {totalSteps} צעדים בוצעו
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentTip.action.href ? (
              <Link href={currentTip.action.href}>
                <Button size="sm" className="gap-2">
                  {currentTip.action.label}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Button
                size="sm"
                onClick={currentTip.action.onClick}
                className="gap-2"
              >
                {currentTip.action.label}
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}

            {activeTips.length > 1 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  setCurrentTipIndex((prev) => (prev + 1) % activeTips.length)
                }
              >
                הטיפ הבא
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
