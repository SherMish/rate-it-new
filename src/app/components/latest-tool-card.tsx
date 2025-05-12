"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Star, Radar as RadarIcon } from "lucide-react";
import { Types } from "mongoose";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

interface LatestToolCardProps {
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
  index: number;
}

export function LatestToolCard({ website, index }: LatestToolCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
    >
      <Link href={`/tool/${encodeURIComponent(website.url)}`}>
        <Card className=" h-[178px] p-6 bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors border-zinc-700/50">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex items-center gap-3 sm:block">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center overflow-hidden">
                {website.logo ? (
                  <Image
                    src={website.logo}
                    alt={website.name}
                    width={48}
                    height={48}
                    className="rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 bg-zinc-700 rounded-full flex items-center justify-center">
                    <span className="text-xs text-zinc-400">
                      {website.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <h2 className="text-lg font-semibold text-zinc-50 sm:hidden">
                {website.name}
              </h2>
            </div>
            <div className="flex-1 min-w-0 space-y-3 text-right">
              <div>
                <h2 className="hidden sm:block text-lg font-semibold text-zinc-50">
                  {website.name}
                </h2>
                <div className="flex flex-col gap-2">
                  {website.reviewCount > 0 && (
                    <div className="flex items-center gap-3 justify-end">
                      <span className="text-sm text-zinc-400">
                        {website.averageRating.toFixed(1)}
                      </span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < (website.averageRating || 0)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-zinc-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {website.radarTrust && (
                    <div className="flex items-center gap-1 text-primary justify-end">
                      <span className="text-sm font-medium">
                        <span className="mr-1">RadarTrust™</span>
                        {website.radarTrust.toFixed(1)}
                      </span>
                      <RadarIcon className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>

              {website.shortDescription && (
                <p className="text-sm text-zinc-400 line-clamp-2 text-right">
                  {website.shortDescription}
                </p>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
