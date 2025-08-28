"use client";

import { useReportWebVitals } from 'next/web-vitals';
import { reportWebVitals } from '@/lib/web-vitals';

export function WebVitalsProvider() {
  useReportWebVitals(reportWebVitals);
  
  return null;
}
