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
  // Business Registration Events
  BUSINESS_REGISTRATION_STARTED: "business_registration_started",
  BUSINESS_REGISTRATION_LOGIN_CLICKED: "business_registration_login_clicked",
  BUSINESS_REGISTRATION_FORM_SUBMITTED: "business_registration_form_submitted",
  BUSINESS_REGISTRATION_CONTINUE_CLICKED: "business_registration_continue_clicked",
  BUSINESS_VERIFICATION_EMAIL_SENT: "business_verification_email_sent",
  BUSINESS_VERIFICATION_CODE_VERIFIED: "business_verification_code_verified",
  BUSINESS_VERIFICATION_RESEND_CLICKED: "business_verification_resend_clicked",
  BUSINESS_VERIFICATION_BACK_CLICKED: "business_verification_back_clicked",
  BUSINESS_PRICING_FREE_SELECTED: "business_pricing_free_selected",
  BUSINESS_PRICING_BASIC_SELECTED: "business_pricing_basic_selected",
  BUSINESS_PRICING_PRO_SELECTED: "business_pricing_pro_selected",
  BUSINESS_REGISTRATION_COMPLETED: "business_registration_completed",
} as const;
