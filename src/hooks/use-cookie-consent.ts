"use client";

import { useState, useEffect } from "react";
import { CookieSettings, defaultSettings } from "@/lib/types/cookie-consent";

export function useCookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>(defaultSettings);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    } else {
      setSettings(JSON.parse(consent));
    }
  }, []);

  const saveSettings = (newSettings: CookieSettings) => {
    localStorage.setItem("cookie-consent", JSON.stringify(newSettings));
    setSettings(newSettings);
    setShowBanner(false);
    setShowSettings(false);
  };

  return {
    showBanner,
    showSettings,
    settings,
    setShowSettings,
    saveSettings,
  };
} 