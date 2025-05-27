"use client";

import { useState } from "react";
import { ReviewCard } from "@/components/review-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

export interface Review {
  _id: string;
  title: string;
  body: string;
  rating: number;
  createdAt: string;
  helpfulCount?: number;
  isVerified?: boolean;
  relatedUser?: {
    name: string;
    image?: string;
  };
  relatedWebsite?: {
    name: string;
    url: string;
  };
  businessResponse?: {
    text: string;
    lastUpdated: string;
  };
}

interface ReviewsSectionProps {
  reviews: Review[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

  const sortedAndFilteredReviews = reviews
    .filter((review) => {
      if (filterBy === "verified") return review.isVerified;
      if (filterBy === "unverified") return !review.isVerified;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        case "helpful":
          return (b.helpfulCount || 0) - (a.helpfulCount || 0);
        default: // newest
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold">חוות דעת ({reviews.length})</h2>
        {/* <div className="flex items-center gap-3"> */}
        {/* <Select onValueChange={setFilterBy} defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="verified">Verified Only</SelectItem>
              <SelectItem value="unverified">Unverified Only</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setSortBy} defaultValue="newest">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Rated</SelectItem>
              <SelectItem value="lowest">Lowest Rated</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
            </SelectContent>
          </Select> */}
        {/* </div> */}
      </div>

      <div className="space-y-6">
        {sortedAndFilteredReviews.length > 0 ? (
          sortedAndFilteredReviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No reviews match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
