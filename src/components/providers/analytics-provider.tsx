"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";

export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // const consent = localStorage.getItem("cookie-consent");
    // if (!consent) return;

    // const settings = JSON.parse(consent);
    // if (!settings.analytics) return;

    // Only track page views if analytics consent is given
    trackEvent(AnalyticsEvents.PAGE_VIEW, {
      path: pathname,
      search: searchParams?.toString(),
    });
  }, [pathname, searchParams]);

  return null;
} 