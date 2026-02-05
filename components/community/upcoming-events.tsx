import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const EVENTS = [
  {
    title: "Founder Mixer & Drinks",
    time: "5:00 PM",
    month: "OCT",
    day: "24",
    location: "Rooftop Lounge",
    attendees: [
      { src: "/avatars/john.jpg", initials: "JD" },
      { src: "/avatars/alice.jpg", initials: "AS" },
      { src: "/avatars/bob.jpg", initials: "BJ" },
    ],
    extraCount: 18,
  },
  {
    title: "SEO Masterclass 2024",
    time: "11:00 AM",
    month: "OCT",
    day: "28",
    location: "Main Studio",
    attendees: [
      { src: "/avatars/emma.jpg", initials: "EW" },
      { src: "/avatars/sarah.jpg", initials: "SC" },
    ],
    extraCount: 32,
  },
];

export function UpcomingEvents() {
  return (
    <Card className="border border-border/50 shadow-sm bg-card rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-5 px-6">
        <CardTitle className="text-base font-bold tracking-tight">Upcoming Events</CardTitle>
        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          See All
        </button>
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-5">
        {EVENTS.map((event, index) => (
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
                {event.attendees.map((attendee, i) => (
                  <Avatar
                    key={i}
                    className="inline-block h-6 w-6 ring-2 ring-background border border-border/50"
                  >
                    <AvatarImage src={attendee.src} />
                    <AvatarFallback className="bg-muted text-[9px] font-semibold">
                      {attendee.initials}
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
        ))}
      </CardContent>
    </Card>
  );
}
