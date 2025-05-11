"use client";

import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

interface RadarTrustInfoProps {
  children?: React.ReactNode;
}

export function RadarTrustInfo({ children }: RadarTrustInfoProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <button className="inline-flex items-center hover:opacity-80 transition-opacity">
            <Info className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>What is RadarTrust™?</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm text-muted-foreground py-4">
          <p>
            RadarTrust™ is a 1–10 score that reflects an AI tool’s overall
            credibility. It’s based on four weighted factors: user reviews,
            product innovation, market adoption, and pricing transparency.
          </p>
          <p>
            The most influential factor is verified user feedback, which makes
            up 40% of the total score. Scores are updated regularly to reflect
            real performance over time.
          </p>
          <p>
            RadarTrust™ helps professionals quickly evaluate quality and gives
            trustworthy tools the visibility they deserve.
          </p>
          <p>
            <a
              href="/blog/understanding-radartrust-how-ai-tools-are-evaluated-on-ai-radar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Read the full article →
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
