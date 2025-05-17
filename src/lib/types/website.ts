export enum PricingModel {
  FREE = "free",
  FREEMIUM = "freemium",
  SUBSCRIPTION = "subscription",
  PAY_PER_USE = "pay_per_use",
  ENTERPRISE = "enterprise",
}

export interface WebsiteType {
  _id: string;
  name: string;
  url: string;
  description?: string;
  shortDescription?: string;
  category: string;
  logo?: string;
  launchYear?: number;
  createdBy?: string;
  owner?: string;
  reviewCount?: number;
  averageRating?: number;
  isVerified?: boolean;
  isActive?: boolean;
  socialUrls: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
