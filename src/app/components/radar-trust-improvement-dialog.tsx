"use client";

import { ArrowUpRight, Radar as RadarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RadarTrustImprovementDialogProps {
  children: React.ReactNode;
}

export function RadarTrustImprovementDialog({
  children,
}: RadarTrustImprovementDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <RadarIcon className="w-5 h-5 text-primary mr-2" />
            Improve Your RadarTrust™ Score
          </DialogTitle>
          <DialogDescription>
            Your score is based on multiple signals - including reviews, feature
            depth, reputation, and pricing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3 text-sm">
          <p className="text-muted-foreground">
            The most influential factor is verified user feedback, which
            accounts for 40% of the score. One of the most effective ways to
            improve your score is by inviting real users to share their
            experience.
          </p>

          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="font-medium text-sm mb-3">Take action now:</h4>
            <Link
              href="/business/dashboard/reviews-generator"
              className="flex items-center justify-center w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
            >
              Generate review invitations
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Use the Reviews Generator to invite your customers to leave
              verified feedback.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
