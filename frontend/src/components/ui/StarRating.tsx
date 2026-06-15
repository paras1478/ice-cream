"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

const sizeClasses = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRatingChange,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = hoverRating || rating;

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= displayRating;
        const isHalfFilled =
          !isFilled &&
          starValue - 0.5 <= displayRating &&
          displayRating < starValue;

        return (
          <button
            key={i}
            type={interactive ? "button" : undefined}
            disabled={!interactive}
            onClick={() => interactive && onRatingChange?.(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={cn(
              "relative transition-transform",
              interactive &&
                "cursor-pointer hover:scale-110 focus:outline-none"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors duration-150",
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : isHalfFilled
                  ? "fill-amber-200 text-amber-400"
                  : "fill-transparent text-gray-300 dark:text-gray-600"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

export function RatingDisplay({
  rating,
  reviewCount,
  size = "sm",
}: {
  rating: number;
  reviewCount: number;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div className="flex items-center gap-1.5">
      <StarRating rating={rating} size={size} />
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {rating.toFixed(1)} ({reviewCount})
      </span>
    </div>
  );
}
