"use client";

import { useState, useEffect } from "react";
import { CookieSettings, defaultSettings } from "@/lib/types/cookie-consent";

export function useCookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>(defaultSettings);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Auto-accept all cookies by default
      const acceptedSettings = {
        necessary: true,
        analytics: true,
        marketing: true,
      };
      localStorage.setItem("cookie-consent", JSON.stringify(acceptedSettings));
      setSettings(acceptedSettings);
      // Show informational banner
      setShowBanner(true);
    } else {
      setSettings(JSON.parse(consent));
    }
  }, []);

  const dismissBanner = () => {
    setShowBanner(false);
  };

  return {
    showBanner,
    settings,
    dismissBanner,
  };
} 