"use client"; // 👈 Mark as a Client Component

import { ExternalLink } from "lucide-react";

export function VisitToolButtonMobile({
  websiteId,
  url,
  buttonText = "בקר באתר",
}: {
  websiteId: string;
  url: string;
  buttonText?: string;
}) {
  const handleClick = async () => {
    try {
      if (process.env.NEXT_PUBLIC_IS_PRODUCTION === "true") {
        await fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ websiteId, eventType: "click_site_button" }),
        });
      }

      const fullUrl = url.startsWith("http")
        ? url
        : `https://${url}?utm_source=rate-it&utm_medium=marketplace&utm_campaign=rate-it`;

      window.open(fullUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error tracking button click", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-background text-foreground rounded-md border border-border hover:bg-background/80 transition-colors h-[40px]"
    >
      <ExternalLink className="w-5 h-5" />
      <span className="font-medium">{buttonText}</span>
    </button>
  );
}

export function VisitToolButtonDesktop({
  websiteId,
  url,
  buttonText = "בקר באתר",
}: {
  websiteId: string;
  url: string;
  buttonText?: string;
}) {
  const handleClick = async () => {
    try {
      if (process.env.NEXT_PUBLIC_IS_PRODUCTION === "true") {
        await fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ websiteId, eventType: "click_site_button" }),
        });
      }

      const fullUrl = url.startsWith("http")
        ? url
        : `https://${url}?utm_source=rate-it&utm_medium=marketplace&utm_campaign=rate-it`;

      window.open(fullUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error tracking button click", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-background text-foreground rounded-md border border-border hover:bg-background/80 transition-colors h-[40px]"
    >
      <ExternalLink className="w-5 h-5" />
      <span className="font-medium">{buttonText}</span>
    </button>
  );
}
