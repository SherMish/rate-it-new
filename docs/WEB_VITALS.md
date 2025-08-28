# Web Vitals Implementation

This implementation uses Next.js's built-in `next/web-vitals` module to track Core Web Vitals and send them to Google Analytics and custom analytics.

## Features

- ✅ **Core Web Vitals Tracking**: CLS, FID, FCP, LCP, TTFB, INP
- ✅ **Google Analytics Integration**: Automatic reporting to GA4
- ✅ **Google Tag Manager Integration**: Events sent to GTM dataLayer
- ✅ **Custom Analytics API**: Store metrics in your own database
- ✅ **Performance Monitoring Hooks**: Track component and API performance
- ✅ **Web Vitals Dashboard**: Visual dashboard to monitor performance
- ✅ **Automated Alerts**: Track poor performance events

## Setup

The Web Vitals tracking is automatically enabled in your Next.js app through the `WebVitalsProvider` component in the main layout.

### Files Created/Modified:

1. **`src/lib/web-vitals.ts`** - Core Web Vitals reporting logic
2. **`src/components/providers/web-vitals-provider.tsx`** - Provider component
3. **`src/app/api/analytics/web-vitals/route.ts`** - API endpoint for storing metrics
4. **`src/components/analytics/web-vitals-dashboard.tsx`** - Dashboard component
5. **`src/app/admin/web-vitals/page.tsx`** - Admin page for viewing metrics
6. **`src/hooks/usePerformanceMonitoring.ts`** - Performance monitoring hooks

## How It Works

### 1. Automatic Web Vitals Collection

```typescript
// Automatically called for every page load
import { useReportWebVitals } from 'next/web-vitals';
import { reportWebVitals } from '@/lib/web-vitals';

export function WebVitalsProvider() {
  useReportWebVitals(reportWebVitals);
  return null;
}
```

### 2. Google Analytics Integration

Web Vitals are automatically sent to Google Analytics with:
- Event Category: "Web Vitals"
- Event Action: Metric name (CLS, FID, etc.)
- Event Label: Unique metric ID
- Event Value: Metric value

### 3. Custom Analytics Storage

Metrics are also stored in your MongoDB database via `/api/analytics/web-vitals` endpoint.

### 4. Performance Monitoring Hooks

Use these hooks in your components for additional performance tracking:

```typescript
// Monitor component render performance
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';

function MyComponent() {
  const metrics = usePerformanceMonitoring('MyComponent', 100); // 100ms threshold
  
  return <div>Component content</div>;
}

// Monitor API call performance
import { useApiPerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';

function useMyApi() {
  const { trackApiCall } = useApiPerformanceMonitoring();
  
  const fetchData = async () => {
    const startTime = performance.now();
    try {
      const response = await fetch('/api/data');
      const endTime = performance.now();
      trackApiCall('/api/data', startTime, endTime, response.ok);
      return response.json();
    } catch (error) {
      const endTime = performance.now();
      trackApiCall('/api/data', startTime, endTime, false);
      throw error;
    }
  };
}
```

## Viewing Web Vitals Data

### 1. In Google Analytics 4

1. Go to GA4 dashboard
2. Navigate to Events
3. Look for Web Vitals events (CLS, FID, FCP, LCP, TTFB, INP)
4. Create custom reports for performance monitoring

### 2. In Your Admin Dashboard

Visit `/admin/web-vitals` to see:
- Real-time Web Vitals metrics
- Performance distribution charts
- Historical trends
- Poor performance alerts

### 3. In Google Tag Manager

Events are sent to GTM dataLayer with the following structure:

```javascript
{
  event: 'web_vitals',
  web_vitals_name: 'LCP',
  web_vitals_value: 2500,
  web_vitals_id: 'unique-id',
  web_vitals_rating: 'good'
}
```

## Web Vitals Thresholds

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| CLS    | ≤0.1 | ≤0.25            | >0.25 |
| FID    | ≤100ms | ≤300ms         | >300ms |
| FCP    | ≤1.8s | ≤3.0s           | >3.0s |
| LCP    | ≤2.5s | ≤4.0s           | >4.0s |
| TTFB   | ≤0.8s | ≤1.8s           | >1.8s |
| INP    | ≤200ms | ≤500ms         | >500ms |

## Monitoring and Alerts

### Automatic Event Tracking

Poor performance automatically triggers analytics events:
- `web_vitals_cls_poor`
- `web_vitals_fid_poor`
- `web_vitals_lcp_poor`
- `web_vitals_fcp_poor`
- `web_vitals_ttfb_poor`
- `web_vitals_performance_issue`

### Setting Up Alerts

1. **Google Analytics**: Create custom alerts for Web Vitals events
2. **Google Tag Manager**: Set up triggers for poor performance events
3. **Custom Dashboard**: Monitor the `/admin/web-vitals` page regularly

## API Reference

### GET `/api/analytics/web-vitals`

Query parameters:
- `metric`: Filter by specific metric (CLS, FID, etc.)
- `rating`: Filter by rating (good, needs-improvement, poor)
- `days`: Number of days to look back (default: 7)
- `limit`: Maximum number of records (default: 100)

### POST `/api/analytics/web-vitals`

Body:
```json
{
  "name": "LCP",
  "value": 2500,
  "rating": "good",
  "id": "unique-id",
  "timestamp": 1234567890,
  "url": "https://example.com/page",
  "userAgent": "Mozilla/5.0..."
}
```

## Best Practices

1. **Monitor Regularly**: Check Web Vitals weekly
2. **Set Performance Budgets**: Alert when metrics exceed thresholds
3. **Track by Page**: Analyze performance per page/route
4. **Mobile vs Desktop**: Compare performance across devices
5. **Track Improvements**: Monitor changes after optimizations

## Troubleshooting

### Web Vitals Not Appearing in GA4

1. Check that GA4 is properly configured
2. Verify `gtag` is loaded before Web Vitals reporting
3. Ensure cookies/analytics consent is granted
4. Check browser console for errors

### Missing Data in Dashboard

1. Verify MongoDB connection
2. Check API endpoint `/api/analytics/web-vitals`
3. Ensure Web Vitals provider is mounted in layout
4. Check browser network tab for failed requests

### Performance Issues

1. Web Vitals tracking is lightweight but runs on every page
2. Consider sampling for high-traffic sites
3. Batch API calls if needed
4. Monitor the impact of performance monitoring itself

## Environment Variables

Make sure these are set in your `.env.local`:

```bash
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Production flag
NEXT_PUBLIC_IS_PRODUCTION=true

# MongoDB (for custom analytics storage)
MONGODB_URI=mongodb://...
```
