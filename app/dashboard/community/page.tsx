"use client";

import { useState, useRef } from "react";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { CommunityFeed } from "@/components/community/community-feed";
import { CommunityStats } from "@/components/community/community-stats";
import { UpcomingEvents } from "@/components/community/upcoming-events";
import { ActiveMembers } from "@/components/community/active-members";
import { Button } from "@/components/ui/button";
import { CalendarPlus, PenSquare } from "lucide-react";
import { CreatePostModal } from "@/components/community/create-post-modal";
import { CreateEventModal } from "@/components/community/create-event-modal";

export default function CommunityPage() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  
  // Create refs to trigger refreshes in child components if needed
  const feedRef = useRef<any>(null);
  const eventsRef = useRef<any>(null);

  const handlePostSuccess = () => {
    // In a real app, you might use a shared state or event bus to refresh the feed
    window.location.reload(); // Simple refresh for now to show new data
  };

  const handleEventSuccess = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <MotionWrapper delay={0.05}>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Community Hub</h1>
            <p className="text-sm text-muted-foreground">
              Engage, connect, and grow your workspace community
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsEventModalOpen(true)}
              className="hidden sm:flex items-center gap-2 rounded-lg border-border hover:bg-muted transition-all active:scale-95"
            >
              <CalendarPlus className="h-4 w-4" />
              Create Event
            </Button>
            <Button 
              onClick={() => setIsPostModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/90 transition-all active:scale-95 shadow-md shadow-primary/10"
            >
              <PenSquare className="h-4 w-4" />
              Create Post
            </Button>
          </div>
        </div>
      </MotionWrapper>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-[1fr_380px] items-start">
        {/* Main Feed Column */}
        <div className="min-w-0">
          <MotionWrapper delay={0.1}>
            <CommunityFeed />
          </MotionWrapper>
        </div>

        {/* Sidebar Widgets Column */}
        <div className="space-y-6">
          <MotionWrapper delay={0.15}>
            <CommunityStats />
          </MotionWrapper>

          <MotionWrapper delay={0.2}>
            <UpcomingEvents />
          </MotionWrapper>

          <MotionWrapper delay={0.25}>
            <ActiveMembers />
          </MotionWrapper>
        </div>
      </div>

      {/* Modals */}
      <CreatePostModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
        onSuccess={handlePostSuccess}
      />
      <CreateEventModal 
        isOpen={isEventModalOpen} 
        onClose={() => setIsEventModalOpen(false)} 
        onSuccess={handleEventSuccess}
      />
    </div>
  );
}
