"use client";

import React from "react";

export type RatingTilesProps = {
  value: number; // 0..5
  size?: number; // tile square size in px
  gap?: number;
  filledColor?: string;
  emptyColor?: string;
  starFilledColor?: string;
  starEmptyColor?: string;
  className?: string;
};

// Rounds to nearest half using thresholds (.25 -> .5, .75 -> 1)
function getFillForIndex(value: number, indexZeroBased: number): 0 | 0.5 | 1 {
  const diff = value - indexZeroBased; // e.g., for index 3 and value 4.3 -> 1.3
  if (diff >= 0.75) return 1;
  if (diff >= 0.25) return 0.5;
  return 0;
}

export default function RatingTiles({
  value,
  size = 48,
  gap = 6,
  filledColor = "#494bd6",
  emptyColor = "#e2e8f0",
  starFilledColor = "#ffffff",
  starEmptyColor = "#ffffff",
  className,
}: RatingTilesProps) {
  const tiles = Array.from({ length: 5 }).map((_, i) => {
    const fill = getFillForIndex(value, i);
    const background =
      fill === 1
        ? filledColor
        : fill === 0.5
        ? `linear-gradient(90deg, ${emptyColor} 50%, ${filledColor} 50%)`
        : emptyColor;
    const starColor = fill === 0 ? starEmptyColor : starFilledColor;

    return (
      <div
        key={i}
        style={{
          width: size,
          height: size,
          borderRadius: 8,
          background,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
        }}
      >
        <span
          style={{
            color: starColor,
            fontSize: Math.round(size * 0.5),
            lineHeight: 1,
            fontWeight: "bold",
          }}
        >
          ★
        </span>
      </div>
    );
  });

  return (
    <div
      className={className}
      style={{ display: "flex", gap, justifyContent: "center" }}
    >
      {tiles}
    </div>
  );
}
