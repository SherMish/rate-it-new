"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Star, ExternalLink } from "lucide-react";
import { VerifiedBadge } from "./verified-badge";
import { PricingModel } from "@/lib/types/website";
import { WebsiteType } from "@/lib/models/Website";
import { useRouter } from "next/navigation";
import { useLoading } from "@/contexts/loading-context";

interface WebsiteCardProps {
  website: WebsiteType;
}

export function WebsiteCard({ website }: WebsiteCardProps) {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

  const handleVisitWebsite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = website.url.startsWith("http")
      ? website.url
      : `https://${website.url}`;
    window.open(
      `${url}?utm_source=rate-it&utm_medium=marketplace&utm_campaign=rate-it`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleCardClick = async () => {
    startLoading();

    // Add a small delay to show the progress bar
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Navigate to the tool page
    router.push(`/tool/${encodeURIComponent(website.url)}`);

    // Stop loading after a delay (the page will change anyway)
    setTimeout(() => {
      stopLoading();
    }, 1500);
  };

  return (
    <div className="relative w-full max-w-full overflow-hidden" dir="rtl">
      <Card
        className="group p-0 bg-white hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-gray-300 rounded-xl overflow-hidden cursor-pointer w-full max-w-full"
        onClick={handleCardClick}
      >
        <div className="p-4 sm:p-6 max-w-full overflow-hidden">
          {/* Header Section with Logo */}
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 min-w-0 max-w-full">
            {/* Logo - On the right side */}
            <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
              {website.logo ? (
                <Image
                  src={website.logo}
                  alt={website.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <span className="text-white font-semibold text-sm sm:text-lg">
                    {website.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 max-w-full overflow-hidden">
              {/* Tight spacing for core elements */}
              <div className="space-y-1 max-w-full">
                {/* Business Name */}
                <div className="flex items-center gap-1 sm:gap-2 min-w-0 max-w-full">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate flex-1 min-w-0">
                    {website.name}
                  </h3>
                  <div className="flex-shrink-0">
                    <VerifiedBadge
                      isVerified={website.isVerified ?? false}
                      pricingModel={website.pricingModel ?? PricingModel.FREE}
                      licenseValidDate={website.licenseValidDate}
                      isVerifiedByRateIt={website.isVerifiedByRateIt}
                    />
                  </div>
                </div>

                {/* Website URL */}
                <div className="min-w-0 max-w-full">
                  <span className="text-xs sm:text-sm text-gray-500 truncate block max-w-full">
                    {website.url}
                  </span>
                </div>

                {/* Rating Section */}
                {(website.reviewCount ?? 0) > 0 && (
                  <div className="flex items-center gap-1 sm:gap-2 min-w-0 max-w-full">
                    <div className="flex items-center gap-1 min-w-0">
                      <div className="flex items-center flex-shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 sm:w-4 sm:h-4 ${
                              i < Math.floor(website.averageRating || 0)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300 fill-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-900 flex-shrink-0">
                        {website.averageRating?.toFixed(1) ?? "0.0"}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0 truncate">
                      ({website.reviewCount} ביקורות)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {website.shortDescription && (
            <div className="min-w-0 max-w-full overflow-hidden">
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2 break-words overflow-hidden">
                {website.shortDescription}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
