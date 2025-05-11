import { PricingModel } from "@/lib/types/website";

// Format pricing model ID to user-friendly text
export function formatPricingModel(model: PricingModel | string): string {
  const formats: Record<string, string> = {
    free: "Free",
    freemium: "🎁 Freemium",
    subscription: "📅 Subscription-based",
    pay_per_use: "💰 Pay per use",
    enterprise: "🏢 Enterprise (Custom pricing)",
    // Handle any additional model types
    SaaS: "📅 Subscription-based",
  };
  
  return formats[model.toLowerCase()] || model;
} 