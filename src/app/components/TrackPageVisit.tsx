"use client";

import { useEffect } from "react";

export function TrackPageVisit({ websiteId }: { websiteId: string }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_IS_PRODUCTION === "false") return;
    async function trackVisit() {
      try {
        await fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ websiteId, eventType: "page_visit" }),
        });
      } catch (error) {
        console.error("Error tracking page visit:", error);
      }
    }

    trackVisit();
  }, [websiteId]);

  return null; // This component does not render anything
}
