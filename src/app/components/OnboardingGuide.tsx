"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  AlertCircle,
  FileText,
  Image,
  Tag,
  MessageSquare,
  ChevronRight,
  CheckCircle,
  X,
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

  // Load hidden tips from localStorage
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

  // Generate tips based on website state
  const tips: GuideTip[] = [];

  // Check for missing description
  if (!website?.shortDescription || website.shortDescription.length < 20) {
    tips.push({
      id: "description",
      title: "הוסיפו תיאור לעסק שלכם",
      description:
        "תיאור טוב עוזר ללקוחות פוטנציאליים להבין במה אתם עוסקים ומגביר את הסיכוי שיבחרו בכם",
      icon: FileText,
      action: {
        label: "ערכו את פרטי העסק",
        href: "/business/dashboard/tool",
      },
      priority: 1,
    });
  }

  // Check for missing logo
  if (!website?.logo) {
    tips.push({
      id: "logo",
      title: "הוסיפו לוגו לעסק",
      description:
        "לוגו מקצועי מגביר את האמינות של העסק ועוזר ללקוחות לזהות אתכם בקלות",
      icon: Image,
      action: {
        label: "העלו לוגו",
        href: "/business/dashboard/tool",
      },
      priority: 2,
    });
  }

  // Check for default category
  if (!website?.category || website.category === "other") {
    tips.push({
      id: "category",
      title: "בחרו קטגוריה מתאימה",
      description:
        "קטגוריה נכונה עוזרת ללקוחות למצוא אתכם בקלות בחיפושים ובקטגוריות",
      icon: Tag,
      action: {
        label: "בחרו קטגוריה",
        href: "/business/dashboard/tool",
      },
      priority: 3,
    });
  }

  // Check for no reviews
  if (!website?.reviewCount || website.reviewCount === 0) {
    tips.push({
      id: "reviews",
      title: "קבלו את הביקורת הראשונה שלכם",
      description:
        "ביקורות חיוביות בונות אמון ומגדילות את הסיכוי שלקוחות חדשים יבחרו בכם",
      icon: MessageSquare,
      action: {
        label: "שתפו קישור לכתיבת ביקורות",
        onClick: async () => {
          try {
            // Use window.location.origin for client-side URL construction
            const reviewUrl = `${
              window.location.origin
            }/tool/${encodeURIComponent(website.url)}/review`;

            await navigator.clipboard.writeText(reviewUrl);

            toast({
              title: "הקישור הועתק!",
              description: "הקישור לדף הביקורות הועתק בהצלחה",
            });
          } catch (error) {
            console.error("Failed to copy:", error);
            // Fallback method for copying
            const textArea = document.createElement("textarea");
            textArea.value = `${
              window.location.origin
            }/tool/${encodeURIComponent(website.url)}`;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
              document.execCommand("copy");
              toast({
                title: "הקישור הועתק!",
                description: "הקישור לדף הביקורות הועתק בהצלחה",
              });
            } catch (err) {
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

  // Filter out hidden tips and sort by priority
  const activeTips = tips
    .filter((tip) => !hiddenTips.includes(tip.id))
    .sort((a, b) => a.priority - b.priority);

  if (activeTips.length === 0) {
    return null;
  }

  const currentTip = activeTips[currentTipIndex % activeTips.length];
  const Icon = currentTip.icon;

  const completedSteps = 4 - activeTips.length;
  const totalSteps = 4;
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

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>התקדמות בהגדרת העסק</span>
              <span>
                {completedSteps} מתוך {totalSteps} שלבים הושלמו
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

            <Button
              size="sm"
              variant="ghost"
              onClick={() => hideTip(currentTip.id)}
              className="text-muted-foreground hover:text-foreground"
            >
              הסתר טיפ זה
            </Button>
          </div>
        </div>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => hideTip(currentTip.id)}
          className="h-8 w-8 -mr-2 -mt-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
