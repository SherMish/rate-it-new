"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Star, LucideIcon } from "lucide-react";
import RatingTiles from "@/components/ui/rating-tiles";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { PricingModel } from "@/lib/types/website";
import { WebsiteType, SerializedWebsiteType } from "@/lib/models/Website";
import { VerifiedBadge } from "@/components/verified-badge";
import categoriesData from "@/lib/data/categories.json";
import * as Icons from "lucide-react";
import { WebsiteLogo } from "@/components/website-logo";

interface LatestToolCardProps {
  website: SerializedWebsiteType;
  index: number;
}

export function LatestToolCard({ website, index }: LatestToolCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Find the category data from categories.json using the first category
  const firstCategoryId = website.categories?.[0];
  const categoryData = firstCategoryId
    ? categoriesData.categories.find((cat) => cat.id === firstCategoryId)
    : null;
  const Icon = categoryData?.icon
    ? (Icons[categoryData.icon as keyof typeof Icons] as LucideIcon)
    : null;

  const categoryObj = categoryData
    ? {
        ...categoryData,
        Icon: Icon as LucideIcon,
      }
    : null;

  return (
    <motion.div
      ref={ref}
      className="relative w-full max-w-full overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
      dir="rtl"
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
      <Link href={`/tool/${encodeURIComponent(website.url)}`}>
        <Card className="group relative p-0 bg-white hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-primary/30 rounded-xl overflow-hidden h-[200px] w-full max-w-full cursor-pointer hover:shadow-primary/10">
          {/* Animated gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
          
          <div className="relative p-4 sm:p-6 h-full flex flex-col max-w-full overflow-hidden z-10">
            {/* Header Section */}
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 min-w-0 max-w-full">
              {/* Logo - On the right side with hover animation */}
              <div className="group-hover:scale-110 transition-transform duration-300">
                <WebsiteLogo logo={website.logo} name={website.name} size="md" />
              </div>

              <div className="flex-1 min-w-0 max-w-full overflow-hidden">
                {/* Tight spacing for core elements */}
                <div className="space-y-1 max-w-full">
                  {/* Business Name with hover color change */}
                  <div className="flex items-center gap-1 sm:gap-2 min-w-0 max-w-full">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-primary truncate flex-1 min-w-0 transition-colors duration-300">
                      {website.name}
                    </h3>
                    <div className="flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <VerifiedBadge
                        isVerified={website.isVerified ?? false}
                        pricingModel={website.pricingModel ?? PricingModel.BASIC}
                        licenseValidDate={website.licenseValidDate}
                        isVerifiedByRateIt={website.isVerifiedByRateIt}
                      />
                    </div>
                  </div>

                  {/* Website URL with hover effect */}
                  <div className="min-w-0 max-w-full">
                    <span className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-700 truncate block max-w-full transition-colors duration-300">
                      {website.url}
                    </span>
                  </div>

                  {/* Rating Section - Only show if there are actual reviews */}
                  {(website.reviewCount ?? 0) > 0 && (
                    <div className="flex items-center gap-1 sm:gap-2 min-w-0 max-w-full">
                      <div className="flex items-center gap-1 min-w-0">
                        <div className="flex items-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                          <RatingTiles
                            value={website.averageRating || 0}
                            size={16}
                            starFontSize={12}
                            gap={2}
                            emptyColor="#e5e7eb"
                            tileRadius={3}
                            useDynamicColor
                          />
                        </div>
                        {(website.averageRating ?? 0) > 0 && (
                          <span className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-primary flex-shrink-0 transition-colors duration-300">
                            {website.averageRating?.toFixed(1)}
                          </span>
                        )}
                        <span className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-700 flex-shrink-0 transition-colors duration-300">
                          ({website.reviewCount})
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description with enhanced hover effects */}
            {website.shortDescription && (
              <div className="flex-1 min-w-0 max-w-full overflow-hidden">
                <p className="text-gray-600 group-hover:text-gray-800 text-xs sm:text-sm leading-relaxed line-clamp-2 break-words overflow-hidden transition-colors duration-300">
                  {website.shortDescription}
                </p>
              </div>
            )}
            
            {/* Hover indicator */}
            <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-1 text-xs text-primary font-medium">
                <span>לחץ לצפייה</span>
                <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
