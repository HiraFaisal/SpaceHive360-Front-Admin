import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Booking {
  id: string;
  workspace: string;
  user: {
    name: string;
    email: string;
    image?: string;
  };
  date: string;
  duration: string;
  status: "confirmed" | "pending" | "cancelled";
  amount: string;
}

interface BookingsTableProps {
  bookings: Booking[];
}

export function BookingsTable({ bookings }: BookingsTableProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-card shadow-sm">
      <div className="flex items-center justify-between p-6">
        <div>
           <h3 className="text-base font-semibold text-foreground">Recent Bookings</h3>
           <p className="text-sm text-muted-foreground">Manage your latest workspace reservations.</p>
        </div>
        <Button variant="outline" size="sm">View All</Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/30 text-muted-foreground">
            <tr>
              <th className="px-6 py-3 font-medium">Workspace</th>
              <th className="px-6 py-3 font-medium">User</th>
              <th className="px-6 py-3 font-medium">Date & Time</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Amount</th>
              <th className="px-6 py-3 font-medium w-[50px]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {bookings.map((booking) => (
              <tr key={booking.id} className="group transition-colors hover:bg-muted/30">
                <td className="px-6 py-4">
                  <span className="font-medium text-foreground">{booking.workspace}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarImage src={booking.user.image} alt={booking.user.name} />
                      <AvatarFallback className="bg-primary/5 text-xs font-medium text-primary">
                        {booking.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{booking.user.name}</span>
                      <span className="text-xs text-muted-foreground">{booking.user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                     <span className="text-foreground">{booking.date}</span>
                     <span className="text-xs text-muted-foreground">{booking.duration}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="px-6 py-4 text-right font-medium text-foreground">
                  {booking.amount}
                </td>
                <td className="px-6 py-4">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Booking["status"] }) {
  const styles = {
    confirmed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    cancelled: "bg-muted text-muted-foreground border-border",
  };

  const labels = {
    confirmed: "Confirmed",
    pending: "Pending",
    cancelled: "Cancelled",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles[status]
      )}
    >
      <span className={cn("size-1.5 rounded-full bg-current opacity-60")} />
      {labels[status]}
    </span>
  );
}
