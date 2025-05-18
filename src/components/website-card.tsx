"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Star, Radar as RadarIcon } from "lucide-react";
import { Types } from "mongoose";

interface WebsiteCardProps {
  website: {
    _id: Types.ObjectId;
    name: string;
    url: string;
    description?: string;
    shortDescription?: string;
    logo?: string;
    averageRating: number;
    reviewCount: number;
    radarTrust?: number;
  };
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
        <Card className="p-6 bg-white hover:bg-gray-50 transition-colors border-border">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center overflow-hidden">
              {website.logo ? (
                <Image
                  src={website.logo}
                  alt={website.name}
                  width={48}
                  height={48}
                  className="rounded-xl object-cover"
                />
              ) : (
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xs text-primary">
                    {website.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {website.name}
                </h2>
                <div className="flex items-center gap-3">
                  {website.reviewCount > 0 && (
                    <>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < (website.averageRating || 0)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-zinc-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {website.averageRating.toFixed(1)}
                      </span>
                    </>
                  )}
                  {website.radarTrust && (
                    <>
                      {website.reviewCount > 0 && (
                        <div className="w-px h-4 bg-border" />
                      )}
                      <div className="flex items-center gap-1 text-primary">
                        <RadarIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {website.radarTrust.toFixed(1)}
                          <span className="mr-1">ציון אמון</span>
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {website.shortDescription && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {website.shortDescription}
                </p>
              )}

              <div className="flex items-center">
                <div className="sm:mr-auto">
                  <button
                    onClick={handleVisitWebsite}
                    className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors text-sm"
                  >
                    בקר באתר
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}
