"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface WebsiteLogoProps {
  logo?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function WebsiteLogo({
  logo,
  name,
  size = "md",
  className,
}: WebsiteLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12 sm:w-16 sm:h-16",
    lg: "w-20 h-20",
  };

  const fallbackSizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6 sm:w-8 sm:h-8",
    lg: "w-10 h-10",
  };

  const fallbackTextSizeClasses = {
    sm: "text-xs",
    md: "text-sm sm:text-lg",
    lg: "text-xl",
  };

  return (
    <div
      className={cn(
        "flex-shrink-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm",
        sizeClasses[size],
        className
      )}
    >
      {logo ? (
        <Image
          src={logo}
          alt={name}
          width={64}
          height={64}
          className="object-contain w-full h-full"
        />
      ) : (
        <div
          className={cn(
            "bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center",
            fallbackSizeClasses[size]
          )}
        >
          <span
            className={cn(
              "text-white font-semibold",
              fallbackTextSizeClasses[size]
            )}
          >
            {name.charAt(0)}
          </span>
        </div>
      )}
    </div>
  );
}
