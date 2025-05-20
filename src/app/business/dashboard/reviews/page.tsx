"use client";

import { useState, useEffect } from "react";
import { useBusinessGuard } from "@/hooks/use-business-guard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Review } from "@/components/reviews-section";
import {
  Star,
  MessageSquare,
  Reply,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewResponseDialog } from "@/components/business/review-response-dialog";
import { ReviewRemovalDialog } from "@/components/business/review-removal-dialog";
import { useSession } from "next-auth/react";

export default function ReviewsPage() {
  const { website, isLoading } = useBusinessGuard();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [isRemovalDialogOpen, setIsRemovalDialogOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `/api/reviews/get?websiteId=${website?._id}`
        );
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    if (website?._id) {
      fetchReviews();
    }
  }, [website]);

  const handleResponseClick = (review: Review) => {
    setSelectedReview(review);
    setIsResponseDialogOpen(true);
  };

  const handleRemovalClick = (review: Review) => {
    setSelectedReview(review);
    setIsRemovalDialogOpen(true);
  };

  const handleResponseSubmitted = () => {
    // Refresh reviews after a response is submitted
    if (website?._id) {
      setIsLoadingReviews(true);
      fetch(`/api/reviews/get?websiteId=${website._id}`)
        .then((response) => response.json())
        .then((data) => setReviews(data))
        .catch((error) => console.error("Error refreshing reviews:", error))
        .finally(() => setIsLoadingReviews(false));
    }
  };

  if (isLoading || isLoadingReviews) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-2xl font-bold mb-8">ביקורות</h1>

      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">אין ביקורות עדיין</h3>
          <p className="text-muted-foreground">
            העסק שלך עדיין לא קיבל ביקורות. הביקורות יופיעו כאן ברגע שמשתמשים
            יתחילו לשתף את החוויות שלהם.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="p-6 rounded-lg bg-card border border-border shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "text-yellow-500"
                          : "text-muted-foreground"
                      }`}
                      fill={i < review.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h4 className="font-medium mb-2">{review.title}</h4>
              <p className="text-muted-foreground text-sm mb-4">
                {review.body}
              </p>
              <div className="text-sm text-muted-foreground mb-4">
                מאת {review.relatedUser?.name || "אנונימי"}
              </div>

              {/* Business Response Section */}
              {review.businessResponse?.text && (
                <div className="mt-2 mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-blue-600" />
                      <h4 className="text-xs font-medium text-blue-700">
                        התגובה שלך
                      </h4>
                    </div>
                    <span className="text-xs text-blue-500">
                      {new Date(
                        review.businessResponse.lastUpdated
                      ).toLocaleDateString("he-IL", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800 whitespace-pre-line">
                    {review.businessResponse.text}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className={`w-full ${
                    review.businessResponse?.text
                      ? "bg-blue-50 hover:bg-blue-100 border-blue-200"
                      : ""
                  }`}
                  onClick={() => handleResponseClick(review)}
                >
                  <Reply
                    className={`w-3 h-3 ml-1 ${
                      review.businessResponse?.text ? "text-blue-600" : ""
                    }`}
                  />
                  {review.businessResponse?.text ? "ערוך תגובה" : "הגב"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => handleRemovalClick(review)}
                >
                  <AlertTriangle className="w-3 h-3 ml-1" />
                  בקש הסרה
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Response Dialog */}
      {selectedReview && (
        <ReviewResponseDialog
          isOpen={isResponseDialogOpen}
          onClose={() => setIsResponseDialogOpen(false)}
          review={selectedReview}
          onResponseSubmitted={handleResponseSubmitted}
        />
      )}

      {/* Removal Dialog */}
      {selectedReview && website && (
        <ReviewRemovalDialog
          isOpen={isRemovalDialogOpen}
          onClose={() => setIsRemovalDialogOpen(false)}
          review={selectedReview}
          businessName={website.name}
          businessEmail={session?.user?.email || ""}
        />
      )}
    </div>
  );
}
