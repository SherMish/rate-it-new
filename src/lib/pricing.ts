// Single source of truth for pricing across the application

export const PRICING_CONFIG = {
  // Base prices (monthly in ₪)
  basePrices: {
    basic: 0,
    plus: 99,
    pro: 249,
  },
  
  // Annual billing discounts (percentage)
  annualDiscounts: {
    basic: 0,
    plus: 30,
    pro: 30,
  },
  
  // VAT rate
  vatRate: 0.18,
  
  // Special coupons
  coupons: {
    EARLYPLUS: "EARLYPLUS",
  }
} as const;

export type PlanType = keyof typeof PRICING_CONFIG.basePrices;

// Utility functions for pricing calculations
export const calculateDiscountedPrice = (planType: PlanType, isAnnual: boolean = false): number => {
  const monthlyPrice = PRICING_CONFIG.basePrices[planType];
  if (!isAnnual) return monthlyPrice;
  
  // Annual price = (monthly * 12) - annual discount
  const annualBeforeDiscount = monthlyPrice * 12;
  const discount = PRICING_CONFIG.annualDiscounts[planType];
  const discountAmount = Math.round(annualBeforeDiscount * (discount / 100));
  return annualBeforeDiscount - discountAmount;
};

export const calculateTotalWithVAT = (planType: PlanType, isAnnual: boolean = false): number => {
  const price = calculateDiscountedPrice(planType, isAnnual);
  return Math.round(price * (1 + PRICING_CONFIG.vatRate));
};

export const formatPrice = (price: number): string => {
  return `${price} ₪`;
};

export const getPlanDiscount = (planType: PlanType): number => {
  return PRICING_CONFIG.annualDiscounts[planType];
};

export const getAnnualSavings = (planType: PlanType): number => {
  const monthlyPrice = PRICING_CONFIG.basePrices[planType];
  const annualBeforeDiscount = monthlyPrice * 12;
  const annualAfterDiscount = calculateDiscountedPrice(planType, true);
  return annualBeforeDiscount - annualAfterDiscount;
};

// Helper function to get monthly equivalent price for annual plans
export const getMonthlyEquivalent = (planType: PlanType): number => {
  const annualPrice = calculateDiscountedPrice(planType, true);
  return Math.round(annualPrice / 12);
};

// Helper function to get the full yearly price (monthly × 12) without discount
export const getFullYearlyPrice = (planType: PlanType): number => {
  return PRICING_CONFIG.basePrices[planType] * 12;
};
