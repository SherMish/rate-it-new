"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Copy, Check, ExternalLink, MessageSquarePlus } from "lucide-react";
import Link from "next/link";

interface CopyLinksCardProps {
  websiteUrl?: string;
  className?: string;
}

export function CopyLinksCard({ websiteUrl, className }: CopyLinksCardProps) {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const businessPageUrl = websiteUrl
    ? `${process.env.NEXT_PUBLIC_APP_URL}/tool/${encodeURIComponent(
        websiteUrl
      )}`
    : "";
  const reviewPageUrl = websiteUrl
    ? `${process.env.NEXT_PUBLIC_APP_URL}/tool/${encodeURIComponent(
        websiteUrl
      )}/review`
    : ""; // Assuming reviews section has an ID

  const handleCopy = (textToCopy: string, linkType: string) => {
    if (!textToCopy) return;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopiedLink(linkType);
        toast({
          description: `הקישור הועתק: ${linkType}`,
        });
        setTimeout(() => setCopiedLink(null), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        toast({
          variant: "destructive",
          title: "שגיאה בהעתקה",
          description: "לא ניתן היה להעתיק את הקישור.",
        });
      });
  };

  if (!websiteUrl) {
    return (
      <Card
        className={`p-6 flex flex-col items-center justify-center text-muted-foreground ${className} h-full`}
      >
        <Info className="w-8 h-8 mb-2" />
        <p className="text-sm text-center">כתובת האתר לא זמינה כרגע.</p>
      </Card>
    );
  }

  return (
    <Card className={`p-6 flex flex-col space-y-4 ${className} h-full`}>
      <div>
        <h3 className="text-md font-semibold text-foreground mb-1">
          שתפו את העסק שלכם בקלות
        </h3>
        <p className="text-xs text-muted-foreground">
          העתיקו בקלות קישורים לדף העסק או לכתיבת ביקורת.
        </p>
      </div>

      <div className="space-y-3 flex-grow flex flex-col justify-around">
        {/* Copy Business Page Link */}
        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border/70">
          <div className="flex items-center gap-2 min-w-0">
            <ExternalLink className="w-4 h-4 text-primary flex-shrink-0" />
            <span
              className="text-sm text-foreground truncate"
              title={businessPageUrl}
            >
              דף העסק
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleCopy(businessPageUrl, "דף העסק")}
            className="hover:bg-primary/10 p-1.5 h-auto w-auto"
          >
            {copiedLink === "דף העסק" ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>
        </div>

        {/* Copy Review Page Link */}
        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border/70">
          <div className="flex items-center gap-2 min-w-0">
            <MessageSquarePlus className="w-4 h-4 text-primary flex-shrink-0" />
            <span
              className="text-sm text-foreground truncate"
              title={reviewPageUrl}
            >
              כתיבת ביקורת
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleCopy(reviewPageUrl, "כתיבת ביקורת")}
            className="hover:bg-primary/10 p-1.5 h-auto w-auto"
          >
            {copiedLink === "כתיבת ביקורת" ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
