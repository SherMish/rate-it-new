"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Star, ExternalLink } from "lucide-react";
import { VerifiedBadge } from "./verified-badge";
import { PricingModel } from "@/lib/types/website";
import { WebsiteType } from "@/lib/models/Website";

interface WebsiteCardProps {
  website: WebsiteType;
}

export function WebsiteCard({ website }: WebsiteCardProps) {
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

  return (
    <div className="relative" dir="rtl">
      <Link href={`/tool/${encodeURIComponent(website.url)}`}>
        <Card className="group p-0 bg-white hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-gray-300 rounded-xl overflow-hidden">
          <div className="p-6">
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
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
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
                      <div className="flex items-center gap-2 mb-2">
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
                          ({website.reviewCount} ביקורות)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Visit Button */}
                  <button
                    onClick={handleVisitWebsite}
                    className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm hover:shadow-md"
                  >
                    <span>בקר באתר</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            {website.shortDescription && (
              <div className="mb-4">
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                  {website.shortDescription}
                </p>
              </div>
            )}

            {/* Footer Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {website.reviewCount && website.reviewCount > 0 && (
                  <span>{website.reviewCount} ביקורות</span>
                )}
              </div>
              <div className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors">
                לחץ לפרטים נוספים ←
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}
