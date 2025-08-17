"use client";

import { useState } from "react";

interface TruncatedDescriptionProps {
  description: string;
  maxLength?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function TruncatedDescription({
  description,
  maxLength = 150,
  className = "",
  style = {},
}: TruncatedDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // If description is shorter than maxLength, show it fully
  if (description.length <= maxLength) {
    return (
      <p className={className} style={style}>
        {description}
      </p>
    );
  }

  const truncatedText = description.slice(0, maxLength);
  const remainingText = description.slice(maxLength);

  return (
    <p className={className} style={style}>
      {isExpanded ? (
        <>
          {description}
          <button
            onClick={() => setIsExpanded(false)}
            className="text-primary hover:text-primary/80 font-medium mr-2 underline text-sm"
          >
            הצג פחות
          </button>
        </>
      ) : (
        <>
          {truncatedText}...
          <button
            onClick={() => setIsExpanded(true)}
            className="text-primary hover:text-primary/80 font-medium mr-2 underline text-sm"
          >
            עוד
          </button>
        </>
      )}
    </p>
  );
}
