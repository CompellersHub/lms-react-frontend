"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Bell, Menu, Search, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  useGetOngoingLiveClassesQuery,
  useGetUpcomingLiveClassesQuery,
} from "@/services/coursesApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function HeaderNav({ onMenuClick, showMenuButton }) {
  const { user } = useSelector((state) => state.auth);

  const { data: ongoingClasses = [] } = useGetOngoingLiveClassesQuery();
  const { data: upcomingClasses = [] } = useGetUpcomingLiveClassesQuery();

  const [showSearch, setShowSearch] = useState(false);
  const [showLivePopup, setShowLivePopup] = useState(false);

  const notificationCount = 3;

  const getInitials = (name) => {
    if (!name) return "ST";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // format time (e.g. 05:30 PM)
  const formatTime = (dateString) => {
    const options = { hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleTimeString([], options);
  };

  // check if class is currently live
  const isLiveNow = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    return now >= start && now <= end;
  };

  // helper: check if class is starting within X minutes
  const isStartingSoon = (startTime, minutes = 5) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = (start - now) / (1000 * 60); // minutes
    return diff >= 0 && diff <= minutes;
  };

  // pick live or starting soon class
  let liveClass = null;
  let isUpcoming = false;
  if (ongoingClasses.length > 0) {
    // if server already says it's ongoing
    liveClass = ongoingClasses[0];
  } else if (upcomingClasses.length > 0) {
    // check manually if any starts in next 5 mins
    const soonClass = upcomingClasses.find((cls) =>
      isStartingSoon(cls.start_time, 5)
    );
    if (soonClass) {
      liveClass = soonClass;
      isUpcoming = true;
    }
  }

  // show popup when liveClass changes
  useEffect(() => {
    if (liveClass) {
      setShowLivePopup(true);
    }
  }, [liveClass]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        {/* 🔴 Live/Starting Soon banner */}
        {liveClass && (
          <div className="w-full bg-red-600 text-white px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Radio className="h-4 w-4 animate-pulse" />
              <span>
                {isLiveNow(liveClass.start_time, liveClass.end_time)
                  ? "LIVE NOW: "
                  : `STARTING AT ${formatTime(liveClass.start_time)}: `}
                <span className="font-semibold">{liveClass.title}</span>
              </span>
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white text-red-600 hover:bg-gray-100"
              onClick={() => window.open(liveClass.link, "_blank")}
            >
              <Radio className="h-4 w-4 mr-1" /> Join Now
            </Button>
          </div>
        )}

        {/* rest of your header content unchanged... */}
        <div className="flex h-16 items-center px-4 md:px-6">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
          {/* ... */}
        </div>
      </header>

      {/* Live popup */}
      <Dialog open={showLivePopup} onOpenChange={setShowLivePopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>📡 Live Class Alert</DialogTitle>
            <DialogDescription>
              {liveClass?.title}{" "}
              {isLiveNow(liveClass.start_time, liveClass.end_time)
                ? "is live now"
                : `starts at ${formatTime(liveClass.start_time)}`}
              . Would you like to join?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLivePopup(false)}>
              Maybe Later
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                window.open(liveClass.link, "_blank");
                setShowLivePopup(false);
              }}
            >
              <Radio className="h-4 w-4 mr-1" /> Join Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
