export enum PricingModel {
  FREE = "free",
  PLUS = "plus",
  PRO = "pro",
}

export const isLicenseValid = (
  licenseValidDate: Date | string | null
): boolean => {
  if (!licenseValidDate) return false;

  const parsedDate =
    licenseValidDate instanceof Date
      ? licenseValidDate
      : new Date(licenseValidDate);

  return !isNaN(parsedDate.getTime()) && parsedDate > new Date();
};

/**
 * Checks if the pricing model is 'plus' and the license is valid.
 */
export const isPlus = (
  pricingModel: PricingModel,
  licenseValidDate: Date | string | null
): boolean => {
  return pricingModel === PricingModel.PLUS && isLicenseValid(licenseValidDate);
};

/**
 * Checks if the pricing model is 'pro' and the license is valid.
 */
export const isPro = (
  pricingModel: PricingModel,
  licenseValidDate: Date | string | null
): boolean => {
  return pricingModel === PricingModel.PRO && isLicenseValid(licenseValidDate);
};

/**
 * Checks if the pricing model is 'free' and the license is valid.
 */
export const isFree = (
  pricingModel: PricingModel,
  licenseValidDate: Date | string | null
): boolean => {
  return pricingModel === PricingModel.FREE && isLicenseValid(licenseValidDate);
};

/**
 * Checks if the pricing model is either 'plus' or 'pro' and the license is valid.
 */
export const isPlusOrPro = (
  pricingModel: PricingModel,
  licenseValidDate: Date | string | null
): boolean => {
  return (
    (pricingModel === PricingModel.PLUS || pricingModel === PricingModel.PRO) &&
    isLicenseValid(licenseValidDate)
  );
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
  isVerifiedByRateIt?: boolean;
  pricingModel?: PricingModel;
  licenseValidDate?: Date;
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
