"use client";

import { useState, useEffect } from "react";
import { Star, ThumbsUp, Flag, ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Review } from "./reviews-section";
import { ReportReviewModal } from "./report-review-modal";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface ReviewCardProps {
  review: Review;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { data: session } = useSession();

  // Check if user has already voted on mount
  useEffect(() => {
    const votedReviews = JSON.parse(
      localStorage.getItem("votedReviews") || "[]"
    );
    setHasVoted(votedReviews.includes(review._id));
  }, [review._id]);

  const handleHelpfulClick = async () => {
    // Prevent voting if already voted
    if (hasVoted) return;

    try {
      const response = await fetch("/api/reviews/helpful", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId: review._id }),
      });

      if (response.ok) {
        // Update localStorage
        const votedReviews = JSON.parse(
          localStorage.getItem("votedReviews") || "[]"
        );
        localStorage.setItem(
          "votedReviews",
          JSON.stringify([...votedReviews, review._id])
        );

        // Update UI state
        setHasVoted(true);

        // Update helpful count display
        const reviewElement = document.getElementById(
          `helpful-count-${review._id}`
        );
        if (reviewElement) {
          const currentCount = parseInt(reviewElement.textContent || "0");
          reviewElement.textContent = (currentCount + 1).toString();
        }
      }
    } catch (error) {
      console.error("Error marking as helpful:", error);
    }
  };

  return (
    <>
      <Card
        className="p-6 bg-white hover:bg-gray-50 transition-colors border-border"
        dir="rtl"
      >
        <div className="flex gap-4">
          <div className="flex-shrink-0 pt-1">
            {review.relatedUser?.image ? (
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={review.relatedUser.image}
                  alt={review.relatedUser.name}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
            ) : review.relatedUser?.name ? (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {getInitials(review.relatedUser.name)}
                </span>
              </div>
            ) : null}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {review.title}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-zinc-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    מאת {review.relatedUser?.name || "אנונימי"}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {review.isVerified ? (
                          <div className="flex items-center gap-1 text-emerald-500">
                            <ShieldCheck className="w-4 h-4 fill-emerald-500/10" />
                            <span className="text-xs font-medium">מאומת</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <ShieldAlert className="w-4 h-4" />
                            <span className="text-xs font-medium">
                              לא מאומת
                            </span>
                          </div>
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        {review.isVerified
                          ? "הביקורת הזו אומתה עם הוכחת שימוש בשירות"
                          : "הביקורת הזו נמסרה ללא הוכחת שימוש בשירות"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(review.createdAt).toLocaleDateString("he-IL", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <p className="text-foreground mt-6">{review.body}</p>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={handleHelpfulClick}
                disabled={hasVoted}
                className={hasVoted ? "opacity-50 cursor-not-allowed" : ""}
              >
                <ThumbsUp
                  className={`w-4 h-4 ml-2 ${hasVoted ? "fill-current" : ""}`}
                />
                מועיל (
                <span id={`helpful-count-${review._id}`}>
                  {review.helpfulCount || 0}
                </span>
                )
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReportModalOpen(true)}
              >
                <Flag className="w-4 h-4 ml-2" />
                דווח
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <ReportReviewModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        review={review}
        userEmail={session?.user?.email || ""}
      />
    </>
  );
}
