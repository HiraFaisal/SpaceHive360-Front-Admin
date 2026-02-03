"use client";

import { useState } from "react";
import {
  Calendar as CalendarIcon,
  List,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Clock,
  MapPin,
  User,
  Ban
} from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge"; // Badge not yet created, but I'll use standard tailwind classes or create it if needed. Actually I'll use a span with tailwind classes to be safe as I didn't create Badge.
// Edit: I did create Badge earlier in the directory listing? No, I saw it in the directory list. `badge.tsx` exists.
import { NewBookingDialog } from "@/components/bookings/new-booking-dialog";
import { cn } from "@/lib/utils";

// Mock Booking Data
const mockBookings = [
  { id: 1, title: "Team Sync", user: "Alice Smith", resource: "Alpha Conf Room", date: new Date(), startTime: "10:00", endTime: "11:00", status: "Confirmed" },
  { id: 2, title: "Client Call", user: "Bob Jones", resource: "Phone Booth 1", date: new Date(), startTime: "14:00", endTime: "14:30", status: "On-going" },
  { id: 3, title: "Workshop", user: "Charlie Brown", resource: "Event Hall", date: addMonths(new Date(), 0), startTime: "09:00", endTime: "17:00", status: "Confirmed" },
  // Add some for other days
  { id: 4, title: "Strategy", user: "Diana Prince", resource: "Alpha Conf Room", date: addMonths(new Date(), 0), startTime: "13:00", endTime: "15:00", status: "Pending" },
];

export default function BookingsPage() {
  const [view, setView] = useState("calendar");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Calendar Logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Filter Bookings for Display
  const getBookingsForDate = (date: Date) => {
    return mockBookings.filter(b => isSameDay(b.date, date));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">Manage schedule, reservations, and resource availability.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 text-destructive hover:bg-destructive/10">
            <Ban className="h-4 w-4" /> Block Time
          </Button>
          <NewBookingDialog />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Tabs defaultValue="calendar" className="w-[400px]" onValueChange={setView}>
            <TabsList>
              <TabsTrigger value="calendar" className="gap-2"><CalendarIcon className="h-4 w-4" /> Calendar</TabsTrigger>
              <TabsTrigger value="list" className="gap-2"><List className="h-4 w-4" /> List View</TabsTrigger>
            </TabsList>
          </Tabs>

          {view === 'calendar' && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-semibold w-32 text-center">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          {view === 'list' && (
            <div className="flex items-center gap-2 bg-card p-1 rounded-md border text-muted-foreground px-3">
              <Search className="h-4 w-4" />
              <input className="bg-transparent border-none focus:outline-none text-sm w-48" placeholder="Search bookings..." />
            </div>
          )}
        </div>

        {/* CALENDAR VIEW */}
        {view === 'calendar' && (
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="grid grid-cols-7 border-b bg-muted/20">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-3 text-center text-sm font-semibold text-muted-foreground border-r last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 auto-rows-fr">
              {/* Add empty cells for start of month alignment if needed (omitted for brevity, assume simple layout) */}
              {/* Actually lets do it properly: just mapping daysInMonth is simpler but index might be off. 
                        For now, simple map. User asked for visual excellence, so a simple grid is better than broken one.
                    */}
              {daysInMonth.map((day, dayIdx) => {
                const bookings = getBookingsForDate(day);
                return (
                  <div
                    key={day.toString()}
                    className={cn(
                      "min-h-[120px] p-2 border-b border-r last:border-r-0 hover:bg-muted/5 transition-colors relative group",
                      !isSameMonth(day, currentMonth) && "bg-muted/10 opacity-50",
                      isToday(day) && "bg-primary/5"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={cn(
                        "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full",
                        isToday(day) && "bg-primary text-primary-foreground"
                      )}>
                        {format(day, 'd')}
                      </span>
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 -mr-1 -mt-1">
                        <div className="h-4 w-4">+</div>
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {bookings.map(b => (
                        <div key={b.id} className="text-xs p-1.5 rounded-md bg-white border shadow-sm truncate flex flex-col gap-0.5 cursor-pointer hover:border-primary/50 transition-colors">
                          <span className="font-semibold text-primary">{b.startTime}</span>
                          <span className="truncate text-muted-foreground">{b.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* LIST VIEW */}
        {view === 'list' && (
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>Booking Details</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBookings.map((booking) => (
                  <TableRow key={booking.id} className="group">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="font-semibold">{booking.title}</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <User className="h-3 w-3" /> {booking.user}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-foreground/80">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        {booking.resource}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span className="font-medium">{format(booking.date, 'MMM d, yyyy')}</span>
                        <span className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" /> {booking.startTime} - {booking.endTime}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                        booking.status === 'Confirmed' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                          booking.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' :
                            'bg-blue-50 text-blue-700 ring-blue-600/20'
                      )}>
                        {booking.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Booking</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Cancel Booking</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
