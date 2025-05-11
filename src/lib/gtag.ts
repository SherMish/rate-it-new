export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';
const IS_PRODUCTION = process.env.NEXT_PUBLIC_IS_PRODUCTION === 'true';

// Declare gtag as a global function
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (!IS_PRODUCTION || !GA_TRACKING_ID) {
    console.log('📊 [DEV] GA Pageview:', url);
    return;
  }
  
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (!IS_PRODUCTION || !GA_TRACKING_ID) {
    console.log('📊 [DEV] GA Event:', { action, category, label, value });
    return;
  }

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}; 