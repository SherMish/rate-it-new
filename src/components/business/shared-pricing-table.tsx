"use client";

import { useState } from "react";
import { PricingPlansUI } from "@/components/business/pricing-plans-ui";

// Plan feature definitions
export const starterFeatures = [
  { text: "פרופיל עסק מקצועי - דף ייעודי לעסק שלכם" },
  { text: "קבלת עד 10 ביקורות בחודש" },
  { text: "מענה בסיסי לביקורות לקוחות" },
  { text: "הצגה במנוע החיפוש של רייט-איט" },
  { text: "לוח בקרה בסיסי עם סטטיסטיקות" },
];

export const basicFeatures = [
  { text: "כל מה שבתכנית ה-Starter, ובנוסף:" },
  { text: "עד 50 ביקורות בחודש" },
  {
    text: "תג 'עסק מאומת' - הגדילו אמינות ב-67%",
    isHighlighted: true,
  },
  { text: "הצגה מועדפת בתוצאות החיפוש", isHighlighted: true },
  { text: "תמיכה בעדיפות ומענה תוך 24 שעות", isHighlighted: true },
  { text: "ניתוח מתקדם של ביקורות ומגמות", isHighlighted: true },
];

export const proFeatures = [
  { text: "כל מה שבתכנית ה-Basic, ובנוסף:" },
  { text: "ביקורות ללא הגבלה" },
  { text: "אוטומציה מלאה - הזמנות ביקורת אוטומטיות", isHighlighted: true },
  { text: "דוחות וניתוחים עסקיים מתקדמים", isHighlighted: true },
  { text: "API לשילוב עם מערכות קיימות", isHighlighted: true },
  { text: "יועץ אישי ותמיכה 24/7", isHighlighted: true },
  { text: "וידג'טים מותאמים אישית לאתר", isHighlighted: true },
];

interface PlanActions {
  onStarterClick: () => void;
  onBasicClick: () => void;
  onProClick: () => void;
}

interface SharedPricingTableProps {
  planActions: PlanActions;
  loading?: boolean;
  showBillingToggle?: boolean;
  defaultAnnual?: boolean;
  isCurrent?: {
    starter?: boolean;
    basic?: boolean;
    pro?: boolean;
  };
}

export function SharedPricingTable({
  planActions,
  loading = false,
  showBillingToggle = true,
  defaultAnnual = true,
  isCurrent = {},
}: SharedPricingTableProps) {
  const [isAnnual, setIsAnnual] = useState(defaultAnnual);

  const calculatePrice = (basePrice: number, discount: number = 30) => {
    if (isAnnual) {
      const discountedPrice = Math.round(basePrice * (1 - discount / 100));
      return `${discountedPrice} ₪`;
    }
    return `${basePrice} ₪`;
  };

  const calculateMonthlyAverage = (basePrice: number, discount: number = 30) => {
    if (isAnnual) {
      return Math.round(basePrice * (1 - discount / 100));
    }
    return basePrice;
  };

  const plans = [
    {
      name: "Starter",
      price: "0 ₪",
      features: starterFeatures,
      ctaText: isCurrent.starter ? "המסלול הנוכחי שלך" : "התחילו בחינם",
      onCtaClick: planActions.onStarterClick,
      bestFor: "מושלם להתחלה! התחילו לבנות אמון עם הלקוחות שלכם בחינם",
      isCurrent: isCurrent.starter,
    },
    {
      name: "Basic",
      price: calculatePrice(79, 30),
      originalPrice: isAnnual ? "79 ₪" : undefined,
      monthlyPrice: calculateMonthlyAverage(79, 30),
      discount: 30,
      features: basicFeatures,
      ctaText: isCurrent.basic ? "המסלול הנוכחי שלך" : "שדרגו ל-Basic",
      onCtaClick: planActions.onBasicClick,
      isRecommended: true,
      highlightColor: "primary",
      bestFor: "לעסקים שרוצים למקסם אמינות ולבלוט על מתחרים",
      badge: "הכי מומלץ",
      isCurrent: isCurrent.basic,
    },
    {
      name: "Pro",
      price: calculatePrice(149, 25),
      originalPrice: isAnnual ? "149 ₪" : undefined,
      monthlyPrice: calculateMonthlyAverage(149, 25),
      discount: 25,
      features: proFeatures,
      ctaText: "בקרוב",
      onCtaClick: planActions.onProClick,
      isComingSoon: true,
      bestFor: "לעסקים שרוצים אוטומציה מלאה ותמיכה מתקדמת",
      badge: "Soon",
      isCurrent: isCurrent.pro,
    },
  ];

  return (
    <PricingPlansUI
      plans={plans}
      loading={loading}
      isAnnual={isAnnual}
      onBillingChange={showBillingToggle ? setIsAnnual : undefined}
    />
  );
}
