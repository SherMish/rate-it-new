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

  const formattedDate = new Date(review.createdAt).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <Card className="overflow-hidden bg-white border-border" dir="rtl">
        {/* Header Section with User Info and Date */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-border">
          <div className="flex items-center gap-3">
            {/* User Avatar */}
            {review.relatedUser?.image ? (
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={review.relatedUser.image}
                  alt={review.relatedUser.name}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            ) : review.relatedUser?.name ? (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {getInitials(review.relatedUser.name)}
                </span>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-500">אנ</span>
              </div>
            )}

            {/* User Name and Verification */}
            <div>
              <div className="font-medium text-sm">
                {review.relatedUser?.name || "אנונימי"}
                {review.isVerified && (
                  <span className="inline-flex items-center gap-1 text-emerald-500 mr-2">
                    <ShieldCheck className="w-3 h-3 fill-emerald-500/10" />
                    <span className="text-xs font-medium">מאומת</span>
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {formattedDate}
              </div>
            </div>
          </div>

          {/* Rating Stars */}
          <div className="flex">
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
        </div>

        {/* Review Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-3">{review.title}</h3>
          <p className="text-gray-700 mb-4">{review.body}</p>

          {/* Business Response */}
          {review.businessResponse?.text && (
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-medium text-blue-700">
                  תגובת העסק
                </h4>
                <span className="text-xs text-blue-500 mr-auto">
                  {new Date(
                    review.businessResponse.lastUpdated
                  ).toLocaleDateString("he-IL", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-sm text-blue-800">
                {review.businessResponse.text}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHelpfulClick}
              disabled={hasVoted}
              className={`${hasVoted ? "opacity-70" : "hover:bg-gray-100"}`}
            >
              <ThumbsUp
                className={`w-4 h-4 ml-2 ${
                  hasVoted ? "fill-primary text-primary" : ""
                }`}
              />
              <span>מועיל</span>
              <span className="mx-1">(</span>
              <span id={`helpful-count-${review._id}`}>
                {review.helpfulCount || 0}
              </span>
              <span>)</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReportModalOpen(true)}
              className="hover:bg-gray-100 text-gray-700"
            >
              <Flag className="w-4 h-4 ml-2" />
              <span>דווח</span>
            </Button>
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
