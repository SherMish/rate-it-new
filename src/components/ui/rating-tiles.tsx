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
  starFontSize?: number; // px
  useDynamicColor?: boolean; // color tiles by value thresholds
  tileRadius?: number; // px; if not provided, computed from size
  hoverValue?: number; // optional value to display on hover (e.g., preview)
  onHover?: (value: number) => void; // called with 1..5 on hover, 0 on leave
  onChange?: (value: number) => void; // called with 1..5 on click
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
  starFontSize = 32,
  useDynamicColor = false,
  tileRadius,
  hoverValue,
  onHover,
  onChange,
  className,
}: RatingTilesProps) {
  const normalized = Number(value) || 0;
  const displayValue = hoverValue && hoverValue > 0 ? hoverValue : normalized;

  const dynamicColor = useDynamicColor
    ? displayValue >= 4.5
      ? "#059669" // dark green - Excellent
      : displayValue >= 4.0
      ? "#10B981" // light green - Very Good
      : displayValue >= 3.0
      ? "#F59E0B" // amber - Good
      : displayValue >= 2.0
      ? "#EA580C" // orange-red - Poor
      : displayValue >= 1.0
      ? "#DC2626" // red - Very Poor
      : filledColor
    : filledColor;

  const radius =
    typeof tileRadius === "number"
      ? tileRadius
      : Math.max(3, Math.round(size / 6));

  const tiles = Array.from({ length: 5 }).map((_, i) => {
    const fill = getFillForIndex(displayValue, i);
    const bgColor = dynamicColor;
    const background =
      fill === 1
        ? bgColor
        : fill === 0.5
        ? `linear-gradient(90deg, ${emptyColor} 50%, ${bgColor} 50%)`
        : emptyColor;
    const starColor = fill === 0 ? starEmptyColor : starFilledColor;

    const isInteractive = Boolean(onHover || onChange);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!onChange) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onChange(i + 1);
      }
    };

    return (
      <div
        key={i}
        role={isInteractive ? "button" : undefined}
        aria-label={isInteractive ? `דירוג ${i + 1}` : undefined}
        tabIndex={isInteractive ? 0 : -1}
        onMouseEnter={onHover ? () => onHover(i + 1) : undefined}
        onMouseLeave={onHover ? () => onHover(0) : undefined}
        onClick={onChange ? () => onChange(i + 1) : undefined}
        onKeyDown={isInteractive ? handleKeyDown : undefined}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          background,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
          cursor: isInteractive ? "pointer" : "default",
          outline: "none",
        }}
      >
        <span
          style={{
            color: starColor,
            fontSize: starFontSize,
            lineHeight: 1,
            fontWeight: "bold",
            opacity: fill === 0 ? 0.85 : 1,
            textShadow: fill === 0 ? "none" : "0 1px 2px rgba(0,0,0,0.25)",
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
