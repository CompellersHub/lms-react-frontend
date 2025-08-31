import React from "react";
import { Badge } from "@/components/ui/badge";
import { Radio, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * LiveIndicator Component
 * Displays various live session indicators with animations
 */
export function LiveIndicator({
  variant = "badge",
  className = "",
  showTimer = false,
  timeRemaining = "",
  size = "default",
}) {
  if (variant === "badge") {
    return (
      <Badge
        className={cn(
          "bg-red-500 text-white border-red-500 font-bold",
          "animate-pulse shadow-lg shadow-red-500/50",
          size === "sm" && "text-xs px-2 py-0.5",
          size === "lg" && "text-sm px-3 py-1",
          className
        )}
        role="status"
        aria-label="Live session in progress"
      >
        <Radio className="h-3 w-3 mr-1 fill-current" aria-hidden="true" />
        LIVE
      </Badge>
    );
  }

  if (variant === "dot") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="relative">
          <div className="h-3 w-3 bg-red-500 rounded-full animate-ping absolute"></div>
          <div className="h-3 w-3 bg-red-500 rounded-full"></div>
        </div>
        <span className="text-red-500 font-semibold text-sm">LIVE</span>
        {showTimer && timeRemaining && (
          <span className="text-muted-foreground text-xs">
            • {timeRemaining}
          </span>
        )}
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={cn(
          "bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2",
          "flex items-center justify-center gap-2 font-semibold",
          "animate-pulse shadow-lg",
          className
        )}
      >
        <Radio className="h-4 w-4 fill-current animate-pulse" />
        <span>LIVE MASTERCLASS IN PROGRESS</span>
        {showTimer && timeRemaining && (
          <>
            <Clock className="h-4 w-4 ml-2" />
            <span>{timeRemaining}</span>
          </>
        )}
      </div>
    );
  }

  if (variant === "glow") {
    return (
      <div
        className={cn(
          "relative inline-flex items-center gap-2 px-3 py-1.5",
          "bg-red-500 text-white rounded-full font-bold text-sm",
          "shadow-lg shadow-red-500/50",
          "before:absolute before:inset-0 before:rounded-full",
          "before:bg-red-500 before:animate-ping before:opacity-75",
          className
        )}
      >
        <Radio className="h-3 w-3 fill-current relative z-10" />
        <span className="relative z-10">LIVE</span>
      </div>
    );
  }

  return null;
}

/**
 * LiveCardBorder Component
 * Adds animated border to event cards when live
 */
export function LiveCardBorder({ children, isLive = false, className = "" }) {
  if (!isLive) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={cn(
        "relative p-0.5 rounded-xl",
        "bg-gradient-to-r from-red-500 via-red-400 to-red-500",
        "bg-[length:200%_100%] animate-shimmer",
        className
      )}
    >
      <div className="bg-card rounded-xl">{children}</div>
    </div>
  );
}

/**
 * PulsingDot Component
 * Simple pulsing dot indicator
 */
export function PulsingDot({ className = "" }) {
  return (
    <div className={cn("relative inline-flex", className)}>
      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
      <div className="absolute h-2 w-2 bg-red-500 rounded-full animate-ping"></div>
    </div>
  );
}
