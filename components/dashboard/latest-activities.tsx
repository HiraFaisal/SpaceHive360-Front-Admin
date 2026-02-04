import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, CalendarDays, DollarSign } from "lucide-react";

const ACTIVITIES = [
  {
    text: "New booking created by Jane Doe",
    time: "2 min ago",
    icon: CalendarDays,
    color: "text-blue-500",
  },
  {
    text: "Payment completed for Invoice #1234",
    time: "15 min ago",
    icon: DollarSign,
    color: "text-green-500",
  },
  {
    text: "Guest pass generated for John Smith",
    time: "1 hour ago",
    icon: CheckCircle2,
    color: "text-orange-500",
  },
  {
    text: "Member Alex Ray checked in",
    time: "2 hours ago",
    icon: Clock,
    color: "text-primary",
  },
];

export function LatestActivities() {
  return (
    <Card className="col-span-1 rounded-xl border-border/40 shadow-sm transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border/40">
        <CardTitle className="text-base font-semibold tracking-tight">Latest Activities</CardTitle>
        <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">View All</span>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-8">
          {ACTIVITIES.map((activity, index) => {
             const Icon = activity.icon;
             return (
                <div key={index} className="flex px-1">
                    <div className="flex flex-col items-center mr-4">
                        <div className={`p-1.5 rounded-full bg-muted ${activity.color?.replace('text-', 'bg-')}/10`}>
                             <Icon className={`h-4 w-4 ${activity.color || "text-foreground"}`} />
                        </div>
                        {index !== ACTIVITIES.length - 1 && (
                            <div className="w-px h-full bg-border my-1" />
                        )}
                    </div>
                    <div className="space-y-1 pb-4">
                        <p className="text-sm font-medium leading-none">{activity.text}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                </div>
             );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
