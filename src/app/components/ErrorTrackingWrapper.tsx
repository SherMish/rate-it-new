"use client";

import { useErrorTracking } from "@/hooks/useErrorTracking";

export function ErrorTrackingWrapper() {
  useErrorTracking();
  return null; // It doesn't render anything, just tracks errors
}