"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock, User, Building2, MapPin, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const spaces = [
  { id: "s1", name: "Studio 4B", detail: "Level 4 • Floor Plan A", type: "Meeting Room" },
  { id: "s2", name: "Studio 2A", detail: "Level 2 • Floor Plan B", type: "Meeting Room" },
  { id: "s3", name: "Desk H-12", detail: "Level 1 • Hot Desk Zone", type: "Hot Desk" },
  { id: "s4", name: "Executive Suite 2", detail: "Level 5 • Premium", type: "Private Office" },
];

interface BookingFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function BookingForm({ onSuccess, onCancel }: BookingFormProps) {
  const [date, setDate] = useState<Date>();
  const [selectedSpace, setSelectedSpace] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Customer Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground border-b pb-2">Customer Information</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
             <Label htmlFor="memberName">Member Name</Label>
             <div className="relative">
                 <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input id="memberName" placeholder="e.g. Sarah Jenkins" className="pl-9" />
             </div>
          </div>
          <div className="space-y-2">
             <Label htmlFor="email">Email address</Label>
             <Input id="email" type="email" placeholder="sarah.j@example.com" />
          </div>
        </div>
      </div>

      {/* Space Selection */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground border-b pb-2">Space Selection</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {spaces.map((space) => (
            <div 
              key={space.id}
              onClick={() => setSelectedSpace(space.id)}
              className={cn(
                "p-3 rounded-xl border cursor-pointer transition-all duration-200",
                selectedSpace === space.id 
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                  : "border-border hover:border-primary/50 hover:bg-accent/50"
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="block font-medium text-sm">{space.name}</span>
                  <span className="block text-xs text-muted-foreground mt-0.5">{space.detail}</span>
                </div>
                <MapPin className={cn("h-4 w-4", selectedSpace === space.id ? "text-primary" : "text-muted-foreground/50")} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduling */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground border-b pb-2">Scheduling</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
             <Label>Date</Label>
             <Popover>
                 <PopoverTrigger asChild>
                     <Button
                         variant={"outline"}
                         className={cn(
                             "w-full justify-start text-left font-normal bg-background/50",
                             !date && "text-muted-foreground"
                         )}
                     >
                         <CalendarIcon className="mr-2 h-4 w-4" />
                         {date ? format(date, "PPP") : <span>Pick a date</span>}
                     </Button>
                 </PopoverTrigger>
                 <PopoverContent className="w-auto p-0" align="start">
                     <Calendar
                         mode="single"
                         selected={date}
                         onSelect={setDate}
                         initialFocus
                     />
                 </PopoverContent>
             </Popover>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <Label>Start Time</Label>
               <div className="relative">
                   <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                   <Input type="time" className="pl-9 bg-background/50" defaultValue="09:00" />
               </div>
            </div>
            <div className="space-y-2">
               <Label>End Time</Label>
               <div className="relative">
                   <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                   <Input type="time" className="pl-9 bg-background/50" defaultValue="17:00" />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Finalize & AI Insights */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground border-b pb-2">Finalize</h3>
        <div className="rounded-xl border bg-card/60 p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Hourly Rate</span>
            <span className="font-medium">$12.00</span>
          </div>
          <div className="flex items-center justify-between font-semibold border-t pt-3">
            <span>Total (8 Hours)</span>
            <span className="text-primary text-lg">$96.00</span>
          </div>
        </div>
        
        {/* AI Insight banner */}
        <div className="flex gap-3 items-start rounded-xl border border-blue-500/20 bg-blue-500/10 p-3.5 text-sm text-blue-700 dark:text-blue-300">
           <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
           <p className="leading-snug">
             <span className="font-semibold block mb-0.5">AI Insights</span>
             Studio 4B is 95% booked for tomorrow. Consider adjusting peak pricing.
           </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button variant="ghost" type="button" onClick={onCancel} className="hover:bg-muted/50">Cancel</Button>
        <Button type="submit" className="gap-2 shadow-sm">Schedule Booking</Button>
      </div>
    </form>
  );
}
