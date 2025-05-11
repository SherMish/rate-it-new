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
        const response = await fetch(`/api/reviews/get?websiteId=${website?._id}`);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Reviews</h1>
      
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-200 mb-2">No Reviews Yet</h3>
          <p className="text-gray-400">
            Your tool hasn&apos;t received any reviews yet. Reviews will appear here once users start sharing their experiences.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="p-6 rounded-lg bg-white/5 border border-white/[0.08]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? "text-yellow-500" : "text-gray-600"
                      }`}
                      fill={i < review.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h4 className="font-medium text-gray-200 mb-2">{review.title}</h4>
              <p className="text-gray-400 text-sm mb-4">{review.body}</p>
              <div className="text-sm text-gray-500">
                By {review.relatedUser?.name || "Anonymous"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 