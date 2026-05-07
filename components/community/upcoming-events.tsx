"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { communityApi } from "@/lib/api/community";

export function UpcomingEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    communityApi.getEvents()
      .then(res => setEvents(res.data))
      .catch(err => console.error("Failed to fetch events:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="border border-border/50 shadow-sm bg-card rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-5 px-6">
        <CardTitle className="text-base font-bold tracking-tight">Upcoming Events</CardTitle>
        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          See All
        </button>
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-5">
        {loading ? (
          <div className="text-center py-4 text-muted-foreground text-sm">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground text-sm">No upcoming events.</div>
        ) : (
          events.map((event, index) => (
            <div key={index} className="flex gap-4 group cursor-pointer">
              {/* Date Badge */}
              <div className="flex flex-col items-center justify-center h-16 w-14 rounded-xl bg-background border-2 border-border shadow-sm shrink-0 group-hover:border-primary/40 transition-colors">
                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wide">
                  {event.month}
                </span>
                <span className="text-xl font-bold text-foreground leading-none">{event.day}</span>
              </div>

              {/* Event Details */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                    {event.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {event.time} • {event.location}
                  </p>
                </div>

                {/* Attendee Avatars */}
                <div className="flex items-center -space-x-2">
                  {event.attendeeInitials?.map((initials: string, i: number) => (
                    <Avatar
                      key={i}
                      className="inline-block h-6 w-6 ring-2 ring-background border border-border/50"
                    >
                      <AvatarFallback className="bg-muted text-[9px] font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {event.extraCount > 0 && (
                    <div className="flex h-6 w-auto min-w-[24px] px-1.5 items-center justify-center rounded-full ring-2 ring-background bg-blue-100 dark:bg-blue-900/30 border border-blue-200/50 dark:border-blue-800/30">
                      <span className="text-[9px] font-bold text-blue-700 dark:text-blue-400">
                        +{event.extraCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
