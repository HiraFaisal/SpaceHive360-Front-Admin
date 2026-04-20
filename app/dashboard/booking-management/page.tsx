"use client";

import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  MoreHorizontal,
  Clock,
  MapPin,
  User,
  Download,
  Plus,
  RefreshCcw,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Percent,
  CalendarCheck
} from "lucide-react";
import { format } from "date-fns";

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
import { cn } from "@/lib/utils";
import { NewBookingSheet } from "@/components/bookings/new-booking-sheet";

const stats = [
  {
    title: "Total Bookings",
    value: "1,284",
    trend: "+12.5%",
    trendUp: true,
    icon: CalendarCheck,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Active Bookings",
    value: "42",
    trend: "+4.2%",
    trendUp: true,
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    title: "Occupancy Rate",
    value: "84.2%",
    trend: "-2.1%",
    trendUp: false,
    icon: Percent,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "Total Revenue",
    value: "$128,450",
    trend: "+18.2%",
    trendUp: true,
    icon: DollarSign,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  }
];

const mockBookings = [
  {
    id: "BKG-1",
    user: "Marcus Sterling",
    email: "marcus@fintech.io",
    avatar: "MS",
    resource: "Studio 4B",
    type: "Meeting Room",
    date: new Date(2023, 9, 14),
    startTime: "09:00 AM",
    endTime: "11:30 AM",
    status: "Active"
  },
  {
    id: "BKG-2",
    user: "Elena Rodriguez",
    email: "elena.r@designhub.com",
    avatar: "ER",
    resource: "Desk H-12",
    type: "Hot Desk",
    date: new Date(2023, 9, 14),
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    duration: "Full Day",
    status: "Active"
  },
  {
    id: "BKG-3",
    user: "James Harrison",
    email: "james@nexus.tech",
    avatar: "JH",
    resource: "Executive Suite 2",
    type: "Private Office",
    date: new Date(2023, 9, 15),
    startTime: "02:00 PM",
    endTime: "05:00 PM",
    status: "Upcoming"
  },
  {
    id: "BKG-4",
    user: "Sarah Jenkins",
    email: "s.jenkins@freelance.com",
    avatar: "SJ",
    resource: "Desk G-01",
    type: "Hot Desk",
    date: new Date(2023, 9, 15),
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    duration: "Full Day",
    status: "Upcoming"
  }
];

export default function BookingManagementPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Bookings Management</h1>
          <p className="text-muted-foreground text-sm">Monitor and organize all workspace reservations in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-transparent border-input hover:bg-accent/50 transition-colors">
            <Download className="h-4 w-4" /> Export Report
          </Button>
          <NewBookingSheet />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="p-6 rounded-2xl border bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                </div>
                <div className={cn("p-2.5 rounded-xl transition-colors", stat.bg)}>
                  <Icon className={cn("h-5 w-5", stat.color)} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm gap-1.5">
                <span className={cn(
                  "flex items-center font-medium",
                  stat.trendUp ? "text-emerald-500" : "text-rose-500"
                )}>
                  {stat.trendUp ? <TrendingUp className="h-3.5 w-3.5 mr-1" /> : <TrendingUp className="h-3.5 w-3.5 mr-1 rotate-180" />}
                  {stat.trend}
                </span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="rounded-2xl border bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-80 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                className="pl-9 bg-background/50 border-input w-full transition-shadow focus-visible:ring-1 focus-visible:ring-primary/50" 
                placeholder="Search bookings by name, email, or workspace..." 
              />
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button variant="outline" size="sm" className="h-9 gap-2 text-muted-foreground hover:text-foreground">
              <Filter className="h-4 w-4" /> Filters
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="py-4 pl-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[300px]">Member Details</TableHead>
                <TableHead className="py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Workspace</TableHead>
                <TableHead className="py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date & Time</TableHead>
                <TableHead className="py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</TableHead>
                <TableHead className="py-4 pr-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBookings.map((booking) => (
                <TableRow key={booking.id} className="hover:bg-muted/20 transition-colors border-b group">
                  <TableCell className="py-4 pl-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/10 text-primary font-semibold text-sm">
                        {booking.avatar}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-sm text-foreground truncate">{booking.user}</span>
                        <span className="text-sm text-muted-foreground truncate">{booking.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{booking.resource}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <MapPin className="h-3 w-3" /> {booking.type}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-foreground">
                        {format(booking.date, 'MMM dd, yyyy')}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Clock className="h-3 w-3" /> {booking.duration || `${booking.startTime} - ${booking.endTime}`}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
                      booking.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30' 
                        : 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30'
                    )}>
                      {booking.status === 'Active' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />}
                      {booking.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-lg border-muted/50 p-1">
                        <DropdownMenuItem className="cursor-pointer rounded-md">Edit Details</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer rounded-md">View Receipt</DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-muted/50" />
                        <DropdownMenuItem className="cursor-pointer rounded-md text-destructive focus:text-destructive focus:bg-destructive/10">Cancel Booking</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination Info */}
        <div className="p-4 border-t border-border/50 text-sm flex items-center justify-between text-muted-foreground">
          <span>Showing <span className="font-medium text-foreground">1</span> to <span className="font-medium text-foreground">4</span> of <span className="font-medium text-foreground">1,284</span> bookings</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 shadow-sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="h-8 shadow-sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
