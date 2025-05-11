"use client"; // 👈 Mark as a Client Component

import { ExternalLink } from "lucide-react";

export function VisitToolButtonMobile({
  websiteId,
  url,
}: {
  websiteId: string;
  url: string;
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
        : `https://${url}?utm_source=ai-radar&utm_medium=marketplace&utm_campaign=ai-radar`;

      window.open(fullUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error tracking button click", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md transition-colors h-[40px]"
    >
      <ExternalLink className="w-5 h-5" />
      <span className="font-medium">Visit</span>
      <span className="text-zinc-400">{url}</span>
    </button>
  );
}

export function VisitToolButtonDesktop({
  websiteId,
  url,
}: {
  websiteId: string;
  url: string;
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
        : `https://${url}?utm_source=ai-radar&utm_medium=marketplace&utm_campaign=ai-radar`;

      window.open(fullUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error tracking button click", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md transition-colors h-[40px]"
    >
      <ExternalLink className="w-5 h-5" />
      <span className="font-medium">Visit</span>
    </button>
  );
}
