"use client";

import { useEffect, useState } from "react";
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
  Ban,
  Loader2
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
import { NewBookingDialog } from "@/components/bookings/new-booking-dialog";
import { cn } from "@/lib/utils";
import { bookingApi } from "@/lib/api/bookings";

export default function BookingsPage() {
  const [view, setView] = useState("calendar");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookings, setBookings] = useState<any[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, [search, view]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (view === "list") {
        const res = await bookingApi.getAll(search);
        if (res.success) {
          setBookings(res.data.items);
        }
      } else {
        const res = await bookingApi.getCalendar();
        if (res.success) {
          setCalendarEvents(res.data);
        }
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calendar Logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Filter Bookings for Display
  const getBookingsForDate = (date: Date) => {
    return calendarEvents.filter(b => isSameDay(new Date(b.date), date));
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
              <input 
                className="bg-transparent border-none focus:outline-none text-sm w-48" 
                placeholder="Search bookings..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-muted-foreground animate-pulse">Loading bookings...</p>
          </div>
        ) : (
          <>
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
                        </div>
                        <div className="space-y-1 mt-1 overflow-hidden">
                          {bookings.map((b: any) => (
                            <div 
                              key={b.recId} 
                              className={cn(
                                "text-[10px] p-1.5 rounded-lg border shadow-sm flex flex-col gap-0.5 cursor-pointer transition-all hover:scale-[1.02]",
                                b.planType === 'Booking' 
                                  ? "bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-400" 
                                  : "bg-purple-50 border-purple-200 text-purple-700 hover:border-purple-400"
                              )}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold truncate">{b.title}</span>
                                <span className="bg-white/50 px-1 rounded text-[8px] font-black uppercase tracking-tighter">LOCKED</span>
                              </div>
                              <div className="flex items-center gap-1 opacity-80">
                                <Clock className="h-2 w-2" />
                                <span>{format(new Date(b.date), 'HH:mm')}</span>
                              </div>
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
                      <TableHead>Member Details</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Booking Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                          No bookings found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      bookings.map((booking) => (
                        <TableRow key={booking.recId} className="group">
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span className="font-semibold">{booking.memberName}</span>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                <User className="h-3 w-3" /> {booking.memberEmail}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{booking.planName}</span>
                              <span className="text-[10px] text-muted-foreground uppercase">{booking.planType}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col text-sm">
                              <span className="font-medium">{format(new Date(booking.bookingDate), 'MMM d, yyyy')}</span>
                              <span className="text-muted-foreground text-xs mt-0.5">
                                {format(new Date(booking.bookingDate), 'h:mm a')}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
                              booking.bookingStatus === 'Confirmed' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                              booking.bookingStatus === 'Pending' ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' :
                              'bg-red-50 text-red-700 ring-red-600/20'
                            )}>
                              {booking.bookingStatus}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-bold text-primary">
                            ${booking.totalAmount?.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
