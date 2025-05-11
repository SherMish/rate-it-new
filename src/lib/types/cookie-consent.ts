export interface CookieSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export const defaultSettings: CookieSettings = {
  necessary: true,
  analytics: true,
  marketing: true,
}; 