"use client";

import { useState } from "react";
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

import { useGetOngoingLiveClassesQuery } from "@/services/coursesApi";

export default function HeaderNav({ onMenuClick, showMenuButton }) {
  const { user } = useSelector((state) => state.auth);
  const { data: ongoingClasses = [], isLoading } = useGetOngoingLiveClassesQuery();

  const [showSearch, setShowSearch] = useState(false);

  
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

  
  const liveClass = ongoingClasses.length > 0 ? ongoingClasses[0] : null;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      
      {liveClass && (
        <div className="w-full bg-red-600 text-white px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Radio className="h-4 w-4 animate-pulse" />
            <span>
              LIVE NOW:{" "}
              <span className="font-semibold">{liveClass.title}</span>
            </span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white text-red-600 hover:bg-gray-100"
            onClick={() => (window.location.href = liveClass.link)}
          >
            <Radio className="h-4 w-4 mr-1" /> Join Now
          </Button>
        </div>
      )}

    
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

        <div className="flex-1">
          {showSearch ? (
            <div className="relative max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-8 md:w-64 lg:w-80"
                autoFocus
                onBlur={() => setShowSearch(false)}
              />
            </div>
          ) : (
            <h1 className="text-lg font-semibold">Student Portal</h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!showSearch && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(true)}
              className="mr-1"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
              >
                {notificationCount}
              </Badge>
            )}
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.avatar || "/placeholder.svg"}
                    alt={user?.username || "User"}
                  />
                  <AvatarFallback>{getInitials(user?.username)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Help</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
