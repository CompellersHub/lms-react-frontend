import React from "react";
import { Button } from "@/components/ui/button";
import { Radio, ExternalLink, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * JoinLiveButton Component
 * Displays a prominent button to join live masterclass sessions
 */
export function JoinLiveButton({
  session,
  className = "",
  onJoinClick,
  showTimer = true,
}) {
  if (!session) return null;

  const handleJoinClick = () => {
    if (onJoinClick) {
      onJoinClick(session);
    } else {
      // Default behavior - open Zoom link in new tab
      window.open(session.zoomLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 mt-6 p-3 md:p-4 rounded-xl",
        "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20",
        "border border-red-200 dark:border-red-800",
        "animate-live-pulse max-w-md mx-auto",
        className
      )}
      role="region"
      aria-label="Live masterclass session"
    >
      {/* Live indicator */}
      <div className="flex items-center gap-2" role="status" aria-live="polite">
        <div className="relative" aria-hidden="true">
          <div className="h-3 w-3 bg-red-500 rounded-full animate-ping absolute"></div>
          <div className="h-3 w-3 bg-red-500 rounded-full"></div>
        </div>
        <span className="text-red-600 dark:text-red-400 font-bold text-sm">
          LIVE MASTERCLASS IN PROGRESS
        </span>
      </div>

      {/* Session title */}
      <h3 className="text-lg font-bold text-center text-foreground">
        {session.title}
      </h3>

      {/* Timer */}
      {showTimer && (
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <Clock className="h-4 w-4" />
          <span>Session in progress</span>
        </div>
      )}

      {/* Join button */}
      <Button
        onClick={handleJoinClick}
        className={cn(
          "bg-red-500 hover:bg-red-600 text-white font-bold",
          "px-8 py-6 rounded-full text-lg shadow-lg",
          "transform hover:scale-105 transition-all duration-200",
          "flex items-center gap-2 font-sans"
        )}
        aria-label={`Join live masterclass: ${session.title}`}
      >
        <Radio className="h-5 w-5 fill-current" aria-hidden="true" />
        Join Live Masterclass
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </Button>

      {/* Additional info */}
      <p className="text-xs text-muted-foreground text-center max-w-md">
        Click to join the live session via Zoom. Free for all participants.
      </p>
    </div>
  );
}

/**
 * LiveSessionBanner Component
 * Top banner notification for live sessions
 */
export function LiveSessionBanner({ session, onJoinClick, onDismiss }) {
  if (!session) return null;

  const handleJoinClick = () => {
    if (onJoinClick) {
      onJoinClick(session);
    } else {
      window.open(session.zoomLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 shadow-lg">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="relative" aria-hidden="true">
            <div className="h-3 w-3 bg-white rounded-full animate-ping absolute"></div>
            <div className="h-3 w-3 bg-white rounded-full"></div>
          </div>
          <div className="text-sm sm:text-base">
            <span className="font-bold">LIVE NOW:</span>
            <span className="ml-2">{session.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleJoinClick}
            variant="secondary"
            size="sm"
            className="font-sans bg-white text-red-600 hover:bg-red-50 font-semibold text-sm"
            aria-label={`Join live session: ${session.title}`}
          >
            <Radio className="h-4 w-4 mr-1" aria-hidden="true" />
            Join Now
          </Button>

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="font-sans text-white hover:text-red-200 transition-colors text-xl leading-none"
              aria-label="Dismiss live session banner"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
