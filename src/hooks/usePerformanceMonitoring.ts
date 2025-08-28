"use client";

import { useEffect, useState } from 'react';
import { trackEvent, AnalyticsEvents } from '@/lib/analytics';

interface PerformanceMetrics {
  renderTime: number;
  isSlowRender: boolean;
}

export function usePerformanceMonitoring(componentName: string, threshold: number = 100) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [startTime] = useState(() => performance.now());

  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    const isSlowRender = renderTime > threshold;

    setMetrics({
      renderTime,
      isSlowRender,
    });

    // Track slow renders
    if (isSlowRender) {
      trackEvent(AnalyticsEvents.WEB_VITALS_PERFORMANCE_ISSUE, {
        component_name: componentName,
        render_time: renderTime,
        threshold,
        page_url: window.location.href,
        issue_type: 'slow_component_render',
      });

      console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms (threshold: ${threshold}ms)`);
    }
  }, [componentName, threshold, startTime]);

  return metrics;
}

// Hook for monitoring API call performance
export function useApiPerformanceMonitoring() {
  const trackApiCall = (endpoint: string, startTime: number, endTime: number, success: boolean) => {
    const duration = endTime - startTime;
    const isSlowApi = duration > 2000; // 2 seconds threshold

    if (isSlowApi || !success) {
      trackEvent(AnalyticsEvents.WEB_VITALS_PERFORMANCE_ISSUE, {
        api_endpoint: endpoint,
        api_duration: duration,
        api_success: success,
        page_url: window.location.href,
        issue_type: isSlowApi ? 'slow_api_call' : 'failed_api_call',
      });
    }

    // Always track API performance for monitoring
    trackEvent('api_call_performance', {
      endpoint,
      duration,
      success,
      is_slow: isSlowApi,
    });
  };

  return { trackApiCall };
}

// Hook for monitoring resource loading performance
export function useResourcePerformanceMonitoring() {
  useEffect(() => {
    const handleLoad = () => {
      // Check for slow-loading resources
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

      // Check for slow page load
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        if (loadTime > 5000) { // 5 seconds threshold
          trackEvent(AnalyticsEvents.WEB_VITALS_PERFORMANCE_ISSUE, {
            page_load_time: loadTime,
            page_url: window.location.href,
            issue_type: 'slow_page_load',
          });
        }
      }

      // Check for slow resources
      resources.forEach(resource => {
        const loadTime = resource.responseEnd - resource.startTime;
        if (loadTime > 3000) { // 3 seconds threshold for resources
          trackEvent(AnalyticsEvents.WEB_VITALS_PERFORMANCE_ISSUE, {
            resource_url: resource.name,
            resource_load_time: loadTime,
            resource_type: resource.initiatorType,
            page_url: window.location.href,
            issue_type: 'slow_resource_load',
          });
        }
      });
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);
}
