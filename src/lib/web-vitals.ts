"use client";

import type { NextWebVitalsMetric } from 'next/app';
import { trackEvent, AnalyticsEvents } from './analytics';

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      parameters?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  // Only send metrics in production and if the window is available
  if (typeof window === 'undefined') {
    return;
  }

  // Log metrics in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('Web Vitals (dev):', {
      name: metric.name,
      value: metric.value,
      rating: getMetricRating(metric.name, metric.value),
      id: metric.id,
    });
    return;
  }

  // Send to Google Analytics via gtag
  if (window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
      custom_map: {
        metric_id: 'dimension1',
        metric_value: 'dimension2',
        metric_rating: 'dimension3',
      },
    });
  }

  // Also send to GTM dataLayer for more flexibility
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'web_vitals',
      web_vitals_name: metric.name,
      web_vitals_value: metric.value,
      web_vitals_id: metric.id,
      web_vitals_rating: getMetricRating(metric.name, metric.value),
    });
  }

  // Send to custom analytics API for storage and analysis
  sendToCustomAnalytics(metric);

  // Track poor performance in analytics
  const rating = getMetricRating(metric.name, metric.value);
  if (rating === 'poor') {
    // Track specific poor performance events
    const eventMap: Record<string, string> = {
      'CLS': AnalyticsEvents.WEB_VITALS_CLS_POOR,
      'FID': AnalyticsEvents.WEB_VITALS_FID_POOR,
      'LCP': AnalyticsEvents.WEB_VITALS_LCP_POOR,
      'FCP': AnalyticsEvents.WEB_VITALS_FCP_POOR,
      'TTFB': AnalyticsEvents.WEB_VITALS_TTFB_POOR,
    };

    const eventName = eventMap[metric.name];
    if (eventName) {
      trackEvent(eventName, {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: rating,
        page_url: window.location.href,
      });
    }

    // General performance issue event
    trackEvent(AnalyticsEvents.WEB_VITALS_PERFORMANCE_ISSUE, {
      metric_name: metric.name,
      metric_value: metric.value,
      metric_rating: rating,
      page_url: window.location.href,
    });
  }

  // Log for debugging in production
  console.log('Web Vitals reported:', {
    name: metric.name,
    value: metric.value,
    rating: getMetricRating(metric.name, metric.value),
    id: metric.id,
  });
}

function sendToCustomAnalytics(metric: NextWebVitalsMetric) {
  // Send to your custom analytics API for storage
  fetch('/api/analytics/web-vitals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: getMetricRating(metric.name, metric.value),
      id: metric.id,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    }),
  }).catch((error) => {
    console.error('Error sending Web Vitals to custom analytics:', error);
  });
}

// Web Vitals thresholds for rating (in milliseconds, except CLS)
export const WEB_VITALS_THRESHOLDS = {
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FID: { good: 100, needsImprovement: 300 },
  FCP: { good: 1800, needsImprovement: 3000 },
  LCP: { good: 2500, needsImprovement: 4000 },
  TTFB: { good: 800, needsImprovement: 1800 },
  INP: { good: 200, needsImprovement: 500 }, // Interaction to Next Paint
} as const;

// Helper function to get rating based on metric
export function getMetricRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = WEB_VITALS_THRESHOLDS[name as keyof typeof WEB_VITALS_THRESHOLDS];
  if (!thresholds) return 'poor';
  
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needsImprovement) return 'needs-improvement';
  return 'poor';
}

// Helper function to format Web Vitals values for display
export function formatWebVitalsValue(name: string, value: number): string {
  if (name === 'CLS') {
    return value.toFixed(3);
  }
  return `${Math.round(value)}ms`;
}

// Export types for use in other components
export type WebVitalsMetric = NextWebVitalsMetric;
export type WebVitalsRating = 'good' | 'needs-improvement' | 'poor';
