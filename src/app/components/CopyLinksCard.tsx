"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Copy,
  Check,
  ExternalLink,
  MessageSquarePlus,
  Info,
} from "lucide-react";
import Link from "next/link";

interface CopyLinksCardProps {
  websiteUrl?: string;
  className?: string;
}

export function CopyLinksCard({ websiteUrl, className }: CopyLinksCardProps) {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const businessPageUrl = websiteUrl
    ? `${window.location.origin}/tool/${encodeURIComponent(websiteUrl)}`
    : "";
  const reviewPageUrl = websiteUrl
    ? `${window.location.origin}/tool/${encodeURIComponent(
        websiteUrl
      )}/review`
    : "";

  const handleCopy = async (textToCopy: string, linkType: string) => {
    if (!textToCopy) return;

    try {
      console.log("Attempting to copy:", textToCopy);
      await navigator.clipboard.writeText(textToCopy);
      console.log("Copy successful");

      setCopiedLink(linkType);
      toast({
        title: "הועתק!",
        description: `קישור ל-${linkType} הועתק בהצלחה`,
      });
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (error) {
      console.error("Clipboard API failed:", error);
      // Fallback method
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        setCopiedLink(linkType);
        toast({
          title: "הועתק!",
          description: `${linkType} הועתק בהצלחה`,
        });
        setTimeout(() => setCopiedLink(null), 2000);
      } catch (err) {
        console.error("execCommand copy failed:", err);
        toast({
          variant: "destructive",
          title: "שגיאה בהעתקה",
          description: "לא ניתן היה להעתיק את הקישור.",
        });
      }
      document.body.removeChild(textArea);
    }
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
          תנו ללקוחות לפרגן לכם – בקליק
        </h3>
        <p className="text-xs text-muted-foreground">
          שתפו את הקישור בסיום השירות – ותנו לביקורות לעבוד בשבילכם.{" "}
        </p>
      </div>

      <div className="space-y-3 flex-grow flex flex-col justify-around">
        {/* Copy Business Page Link */}
        <button
          onClick={() => handleCopy(businessPageUrl, "דף העסק")}
          className="w-full flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border/70 hover:bg-secondary/70 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2 min-w-0">
            <ExternalLink className="w-4 h-4 text-primary flex-shrink-0" />
            <span
              className="text-sm text-foreground truncate"
              title={businessPageUrl}
            >
              קישור לדף העסק
            </span>
          </div>
          <div className="p-1.5">
            {copiedLink === "דף העסק" ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
          </div>
        </button>

        {/* Copy Review Page Link */}
        <button
          onClick={() => handleCopy(reviewPageUrl, "כתיבת ביקורת")}
          className="w-full flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border/70 hover:bg-secondary/70 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2 min-w-0">
            <MessageSquarePlus className="w-4 h-4 text-primary flex-shrink-0" />
            <span
              className="text-sm text-foreground truncate"
              title={reviewPageUrl}
            >
            קישור לכתיבת ביקורת
            </span>
          </div>
          <div className="p-1.5">
            {copiedLink === "כתיבת ביקורת" ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
          </div>
        </button>
      </div>

      <Link href={businessPageUrl} target="_blank">
        <Button variant="outline" className="w-full text-xs">
          <ExternalLink className="w-3 h-3 ml-1.5" />
          צפו בדף העסק שלכם
        </Button>
      </Link>
    </Card>
  );
}
