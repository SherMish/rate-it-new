"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Types } from "mongoose";

interface SuggestedToolCardProps {
  website: {
    _id: Types.ObjectId;
    name: string;
    url: string;
    logo?: string;
    averageRating: number;
    reviewCount: number;
    radarTrust?: number;
  };
}

export function SuggestedToolCard({ website }: SuggestedToolCardProps) {
  return (
    <Link href={`/tool/${website.url}`} dir="rtl">
      <Card className="p-4 bg-white hover:bg-gray-50 transition-colors border-border">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center overflow-hidden">
            {website.logo ? (
              <Image
                src={website.logo}
                alt={website.name}
                width={40}
                height={40}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xs text-primary">
                  {website.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-foreground">{website.name}</h3>
            <div className="flex items-center gap-2">
              {website.reviewCount > 0 && (
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < (website.averageRating || 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-zinc-300"
                      }`}
                    />
                  ))}
                </div>
              )}
              {website.reviewCount > 0 && website.radarTrust && (
                <div className="w-px h-3 bg-border" />
              )}
              {website.radarTrust && (
                <div className="flex items-center gap-1 text-primary text-xs">
                  <span>{website.radarTrust.toFixed(1)}</span>
                  <span>ציון אמון</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
