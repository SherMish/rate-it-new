export enum PricingModel {
  BASIC = "basic",
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
 * Checks if the pricing model is 'basic' and the license is valid.
 */
export const isBasic = (
  pricingModel: PricingModel,
  licenseValidDate: Date | string | null
): boolean => {
  return pricingModel === PricingModel.BASIC && isLicenseValid(licenseValidDate);
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
