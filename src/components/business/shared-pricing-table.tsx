"use client";

import { useState } from "react";
import { PricingPlansUI } from "@/components/business/pricing-plans-ui";

// Plan feature definitions
export const basicFeatures = [
  { text: "פרופיל עסק מקצועי - דף ייעודי לעסק שלכם" },
  { text: "מענה בסיסי לביקורות לקוחות" },
  { text: "הצגה במנוע החיפוש של רייט-איט" },
];

export const plusFeatures = [
  { text: "כל מה שבתכנית ה-Basic, ובנוסף:"},
  {
    text: "תג 'עסק מאומת'",
    isHighlighted: true,
  },
  { text: "הצגה מועדפת בתוצאות החיפוש", isHighlighted: true },
  { text: "תמיכה בעדיפות ומענה תוך 24 שעות", isHighlighted: true },
  { text: "ניתוח מתקדם של ביקורות ומגמות", isHighlighted: true },
];

export const proFeatures = [
  { text: "כל מה שבתכנית ה-Plus, ובנוסף:" },
  { text: "אוטומציה מלאה - הזמנות ביקורת אוטומטיות", isHighlighted: true },
  { text: "דוחות וניתוחים עסקיים מתקדמים", isHighlighted: true },
  { text: "API לשילוב עם מערכות קיימות", isHighlighted: true },
  { text: "יועץ אישי ותמיכה 24/7", isHighlighted: true },
  { text: "וידג'טים מותאמים אישית לאתר", isHighlighted: true },
];

interface PlanActions {
  onBasicClick: () => void;
  onPlusClick: () => void;
  onProClick: () => void;
}

interface SharedPricingTableProps {
  planActions: PlanActions;
  loading?: boolean;
  showBillingToggle?: boolean;
  defaultAnnual?: boolean;
  isCurrent?: {
    basic?: boolean;
    plus?: boolean;
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
      name: "Basic",
      price: "0 ₪",
      features: basicFeatures,
      ctaText: isCurrent.basic ? "המסלול הנוכחי שלך" : "התחילו בחינם",
      onCtaClick: planActions.onBasicClick,
      bestFor: "מושלם להתחלה! התחילו לבנות אמון עם הלקוחות שלכם בחינם",
      isCurrent: isCurrent.basic,
    },
    {
      name: "Plus",
      price: calculatePrice(99, 30),
      originalPrice: isAnnual ? "99 ₪" : undefined,
      monthlyPrice: calculateMonthlyAverage(99, 30),
      discount: 30,
      features: plusFeatures,
      ctaText: isCurrent.plus ? "המסלול הנוכחי שלך" : "שדרגו ל-Plus",
      onCtaClick: planActions.onPlusClick,
      isRecommended: true,
      highlightColor: "primary",
      bestFor: "לעסקים שרוצים למקסם אמינות ולבלוט על מתחרים",
      badge: "הכי מומלץ",
      isCurrent: isCurrent.plus,
    },
    {
      name: "Pro",
      price: calculatePrice(159, 25),
      originalPrice: isAnnual ? "159 ₪" : undefined,
      monthlyPrice: calculateMonthlyAverage(159, 25),
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
