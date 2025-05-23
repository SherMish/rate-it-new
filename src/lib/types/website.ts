export enum PricingModel {
  FREE = "free",
  PLUS = "plus",
  PRO = "pro",
}

export const isPlusOrPro = (pricingModel: PricingModel) => {
  return (
    pricingModel === PricingModel.PLUS || pricingModel === PricingModel.PRO
  );
};

export const isFree = (pricingModel: PricingModel) => {
  return pricingModel === PricingModel.FREE;
};

export const isPro = (pricingModel: PricingModel) => {
  return pricingModel === PricingModel.PRO;
};

export const isPlus = (pricingModel: PricingModel) => {
  return pricingModel === PricingModel.PLUS;
};

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
