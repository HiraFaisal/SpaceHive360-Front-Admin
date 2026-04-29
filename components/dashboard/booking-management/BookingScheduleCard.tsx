"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { BookingData } from "@/app/dashboard/booking-management/page";
import { FieldErrors } from "react-hook-form";

interface BookingScheduleCardProps {
  data: BookingData;
  updateData: (key: keyof BookingData, value: any) => void;
  errors: FieldErrors<BookingData>;
  disabled?: boolean;
}

const DAYS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

export function BookingScheduleCard({ data, updateData, errors, disabled }: BookingScheduleCardProps) {
  const toggleDay = (day: string) => {
    if (disabled) return;
    const current = data.availableDays;
    if (current.includes(day)) {
      updateData("availableDays", current.filter(d => d !== day));
    } else {
      updateData("availableDays", [...current, day]);
    }
  };

  return (
    <Card className="border-border/5 bg-card overflow-hidden shadow-sm">
      <CardHeader className="border-b border-border/5 bg-muted/20">
        <CardTitle className="text-xl font-bold">Schedule & Availability</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="startTime">Daily Start Time</Label>
            <Input
              id="startTime"
              type="time"
              className="bg-background/50"
              value={data.startTime}
              onChange={(e) => updateData("startTime", e.target.value)}
              disabled={disabled}
            />
            {errors.startTime && <p className="text-xs text-destructive">{errors.startTime.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime">Daily End Time</Label>
            <Input
              id="endTime"
              type="time"
              className="bg-background/50"
              value={data.endTime}
              onChange={(e) => updateData("endTime", e.target.value)}
              disabled={disabled}
            />
            {errors.endTime && <p className="text-xs text-destructive">{errors.endTime.message}</p>}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Available Days</Label>
          <div className="flex flex-wrap gap-4 pt-2">
            {DAYS.map((day) => (
              <div key={day} className="flex items-center space-x-2 bg-muted/30 p-2 rounded-lg border border-border/5 hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={`day-${day}`}
                  checked={data.availableDays.includes(day)}
                  onCheckedChange={() => toggleDay(day)}
                  disabled={disabled}
                />
                <Label
                  htmlFor={`day-${day}`}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {day}
                </Label>
              </div>
            ))}
          </div>
          {errors.availableDays && <p className="text-xs text-destructive">{errors.availableDays.message}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
