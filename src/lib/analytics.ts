"use client";

import mixpanel from "mixpanel-browser";

const IS_PRODUCTION = process.env.NEXT_PUBLIC_IS_PRODUCTION === "true";
const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || "";

// Declare dataLayer as a global
declare global {
  interface Window {
    dataLayer: any[];
  }
}

function hasAnalyticsConsent(): boolean {
  try {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) return false;
    const settings = JSON.parse(consent);
    return settings.analytics === true;
  } catch {
    console.error("Error parsing analytics consent");
    return false;
  }
}

// Only initialize Mixpanel if we have consent
try {
  if (IS_PRODUCTION && MIXPANEL_TOKEN) {
    // && hasAnalyticsConsent()
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: false,
      track_pageview: true,
      persistence: "localStorage",
    });
  }
} catch (error) {
  console.error("Error initializing Mixpanel:", error);
}

type TrackingEventProperties = {
  [key: string]: any;
};

/**
 * Unified tracking function that sends events to Mixpanel and Google Analytics via GTM
 */
export function trackEvent(
  eventName: string,
  properties: TrackingEventProperties = {}
) {
  // Only track if we have consent
  // if (!hasAnalyticsConsent()) {
  //   console.log('Analytics tracking disabled - no consent');
  //   return;
  // }

  // Track in Mixpanel
  try {
    if (MIXPANEL_TOKEN && typeof mixpanel?.track === "function") {
      mixpanel.track(eventName, {
        ...properties,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.warn("Mixpanel is not initialized. Skipping event:", eventName);
    }
  } catch (error) {
    console.error("Error tracking event in Mixpanel:", error);
  }

  // Track in Google Analytics via GTM dataLayer
  try {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        event_category: properties.category || "general",
        event_label: properties.label || eventName,
        value: properties.value,
        ...properties, // Include all custom properties
      });
    } else {
      console.warn(
        "GTM dataLayer is not available. Skipping event:",
        eventName
      );
    }
  } catch (error) {
    console.error("Error tracking event in GTM:", error);
  }
}

/**
 * Set user properties in analytics tools
 */
export function identifyUser(
  userId: string,
  userProperties: TrackingEventProperties = {}
) {
  if (!IS_PRODUCTION) {
    return;
  }

  try {
    if (MIXPANEL_TOKEN) {
      mixpanel.identify(userId);
      mixpanel.people.set({
        ...userProperties,
        $last_seen: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error identifying user:", error);
  }

  // Send user data to GTM
  try {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "user_identified",
        user_id: userId,
        ...userProperties,
      });
    }
  } catch (error) {
    console.error("Error setting user data in GTM:", error);
  }
}

/**
 * Reset user identification (for logout)
 */
export function resetAnalytics() {
  if (!IS_PRODUCTION) {
    return;
  }

  if (MIXPANEL_TOKEN) {
    mixpanel.reset();
  }

  // Send logout event to GTM
  try {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "user_logout",
        user_id: undefined,
      });
    }
  } catch (error) {
    console.error("Error resetting user data in GTM:", error);
  }
}

// Common event names to prevent typos
export const AnalyticsEvents = {
  PAGE_VIEW: "page_view",
  SIGN_IN: "sign_in",
  SIGN_OUT: "sign_out",
  REVIEW_CREATED: "review_created",
  REVIEW_LIKED: "review_liked",
  TOOL_VIEWED: "tool_viewed",
  SEARCH_PERFORMED: "search_performed",
  FILTER_APPLIED: "filter_applied",
  EXTERNAL_LINK_CLICKED: "external_link_clicked",
} as const;
