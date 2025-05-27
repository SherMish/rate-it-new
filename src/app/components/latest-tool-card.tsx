"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Star, LucideIcon } from "lucide-react";
import { Types } from "mongoose";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { PricingModel, WebsiteType } from "@/lib/types/website";
import { VerifiedBadge } from "@/components/verified-badge";
import categoriesData from "@/lib/data/categories.json";
import * as Icons from "lucide-react";

interface LatestToolCardProps {
  website: WebsiteType;
  index: number;
}

export function LatestToolCard({ website, index }: LatestToolCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Find the category data from categories.json
  const categoryData = categoriesData.categories.find(
    (cat) => cat.id === website.category
  );
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
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
      dir="rtl"
    >
      <Link href={`/tool/${encodeURIComponent(website.url)}`}>
        <Card className="group p-0 bg-white hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-gray-300 rounded-xl overflow-hidden h-[200px]">
          <div className="p-6 h-full flex flex-col">
            {/* Header Section */}
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
                {website.logo ? (
                  <Image
                    src={website.logo}
                    alt={website.name}
                    width={64}
                    height={64}
                    className="rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {website.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold text-gray-900 truncate">
                    {website.name}
                  </h3>
                  <VerifiedBadge
                    isVerified={website.isVerified ?? false}
                    pricingModel={website.pricingModel ?? PricingModel.FREE}
                    licenseValidDate={website.licenseValidDate}
                    isVerifiedByRateIt={website.isVerifiedByRateIt}
                  />
                </div>

                {/* Rating Section */}
                {website.reviewCount && website.reviewCount > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(website.averageRating || 0)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300 fill-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {website.averageRating?.toFixed(1) ?? "0.0"}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({website.reviewCount})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {website.shortDescription && (
              <div className="flex-1">
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                  {website.shortDescription}
                </p>
              </div>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
