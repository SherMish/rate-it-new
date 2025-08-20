"use client";

import { useState } from "react";
import { PricingPlansUI } from "@/components/business/pricing-plans-ui";
import { PRICING_CONFIG, calculateDiscountedPrice, formatPrice, getPlanDiscount, getMonthlyEquivalent, getFullYearlyPrice } from "@/lib/pricing";

// Plan feature definitions
export const basicFeatures = [
  { text: "פרופיל עסק מקצועי - דף ייעודי לעסק שלכם" },
  { text: "מענה בסיסי לביקורות לקוחות" },
  { text: "הצגה במנוע החיפוש של רייט-איט" },
];

export const plusFeatures = [
  { text: "כל מה שבתכנית ה-Basic, ובנוסף:"},
  {
    text: "תג 'עסק מאומת' - לקוחות סומכים יותר על עסקים מאומתים",
    isHighlighted: true,
  },
  { text: "הצגה מועדפת בתוצאות החיפוש - תופיע לפני המתחרים", isHighlighted: true },
  { text: "הסרת פרסומות צד ג׳ ואזכור מתחרים - הלקוחות יתמקדו רק בך", isHighlighted: true },
    { text: "תמיכה בעדיפות ומענה תוך 24 שעות", isHighlighted: true }
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
  onPlusClick: (billing?: "monthly" | "annual") => void;
  onProClick: (billing?: "monthly" | "annual") => void;
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

  const calculatePrice = (planType: 'plus' | 'pro') => {
    if (isAnnual) {
      // For annual billing, show monthly equivalent (total annual / 12)
      const monthlyEquivalent = getMonthlyEquivalent(planType);
      return formatPrice(monthlyEquivalent);
    } else {
      // For monthly billing, show monthly price
      const price = calculateDiscountedPrice(planType, false);
      return formatPrice(price);
    }
  };

  const calculateMonthlyAverage = (planType: 'plus' | 'pro') => {
    if (isAnnual) {
      // For annual billing, return monthly equivalent for display
      return getMonthlyEquivalent(planType);
    } else {
      // For monthly billing, return monthly price
      return calculateDiscountedPrice(planType, false);
    }
  };

  const getOriginalPrice = (planType: 'plus' | 'pro') => {
    if (isAnnual) {
      // For annual billing, show monthly price (before discount) as crossed out
      return formatPrice(PRICING_CONFIG.basePrices[planType]);
    } else {
      // For monthly billing, no crossed out price
      return undefined;
    }
  };

  const plans = [
    {
      name: "Basic",
      price: "0 ₪",
      features: basicFeatures,
      ctaText: isCurrent.basic ? "המסלול הנוכחי שלך" : "התחילו בחינם",
      onCtaClick: planActions.onBasicClick,
      bestFor: "שלטו בפרופיל העסק והגיבו לביקורות",
      isCurrent: isCurrent.basic,
    },
    {
      name: "Plus",
      price: calculatePrice('plus'),
      originalPrice: getOriginalPrice('plus'),
      monthlyPrice: calculateMonthlyAverage('plus'),
      discount: getPlanDiscount('plus'),
      features: plusFeatures,
      ctaText: isCurrent.plus ? "המסלול הנוכחי שלך" : "שדרגו ל-Plus",
      onCtaClick: planActions.onPlusClick.bind(null, isAnnual ? "annual" : "monthly"),
      isRecommended: true,
      highlightColor: "primary",
      bestFor: "בלטו מעל המתחרים עם סטטוס מאומת ופרופיל נקי מפרסומות",
      badge: "הכי מומלץ",
      isCurrent: isCurrent.plus,
    },
    {
      name: "Pro",
      price: calculatePrice('pro'),
      originalPrice: getOriginalPrice('pro'),
      monthlyPrice: calculateMonthlyAverage('pro'),
      discount: getPlanDiscount('pro'),
      features: proFeatures,
      ctaText: "בקרוב",
      onCtaClick: planActions.onProClick.bind(null, isAnnual ? "annual" : "monthly"),
      isComingSoon: true,
      bestFor: "ניהול מוניטין מלא עם אוטומציות ואנליטיקה מתקדמת",
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
