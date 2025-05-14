"use client";

import { useState, useEffect } from "react";
import { useBusinessGuard } from "@/hooks/use-business-guard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Review } from "@/components/reviews-section";
import { Star, MessageSquare } from "lucide-react";

export default function ReviewsPage() {
  const { website, isLoading } = useBusinessGuard();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

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
              <div className="text-sm text-muted-foreground">
                מאת {review.relatedUser?.name || "אנונימי"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
