"use client";

import { useEffect } from "react";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface Review {
  _id: string;
  body: string;
  rating: number;
  createdAt: Date;
  relatedWebsite: {
    name: string;
    url: string;
  };
  relatedUser?: {
    name: string;
  };
}

export function LatestReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: "center",
      containScroll: "trimSnaps",
      dragFree: true
    }, 
    [(Autoplay as any)({ delay: 3000, stopOnInteraction: false })]
  );

  return (
    <div className="py-16 relative">
      <div className="container max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Latest Reviews</h2>
        <div className="overflow-hidden -mx-4" ref={emblaRef}>
          <div className="flex backface-hidden -ml-[1%]">
            {reviews.map((review) => (
              <div 
                key={review._id} 
                className="flex-[0_0_98%] md:flex-[0_0_48%] lg:flex-[0_0_32%] mx-[1%]"
              >
                <Card className="bg-secondary/50 backdrop-blur-sm h-full">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold gradient-text">
                          {(review.relatedUser?.name || 'A')[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{review.relatedUser?.name || "Anonymous"}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Link href={`/tool/${encodeURIComponent(review.relatedWebsite.url)}`}>
                      <div className="mb-4">
                        <div className="font-medium text-foreground">{review.relatedWebsite.name}</div>
                        <div className="text-sm text-muted-foreground">{review.relatedWebsite.url}</div>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {review.body}
                      </p>
                    </Link>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 