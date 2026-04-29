"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { BookingData } from "@/app/dashboard/booking-management/page";

interface BookingRulesCardProps {
  data: BookingData;
  updateData: (key: keyof BookingData, value: any) => void;
  disabled?: boolean;
}

export function BookingRulesCard({ data, updateData, disabled }: BookingRulesCardProps) {
  return (
    <Card className="border-border/5 bg-card overflow-hidden shadow-sm">
      <CardHeader className="border-b border-border/5 bg-muted/20">
        <CardTitle className="text-xl font-bold">Booking Rules</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="minDuration">Min Duration (mins)</Label>
            <Input
              id="minDuration"
              type="number"
              className="bg-background/50"
              value={data.minDurationMinutes}
              onChange={(e) => updateData("minDurationMinutes", parseInt(e.target.value))}
              disabled={disabled}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxDuration">Max Duration (mins)</Label>
            <Input
              id="maxDuration"
              type="number"
              className="bg-background/50"
              value={data.maxDurationMinutes}
              onChange={(e) => updateData("maxDurationMinutes", parseInt(e.target.value))}
              disabled={disabled}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-4 border-t border-border/5">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/5">
            <div className="space-y-0.5">
              <Label className="text-base">Allow Cancellation</Label>
              <p className="text-sm text-muted-foreground">Members can cancel their bookings before start time.</p>
            </div>
            <Switch
              checked={data.allowCancellation}
              onCheckedChange={(val) => updateData("allowCancellation", val)}
              disabled={disabled}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/5">
            <div className="space-y-0.5">
              <Label className="text-base">Requires Approval</Label>
              <p className="text-sm text-muted-foreground">Admin must approve bookings before they are confirmed.</p>
            </div>
            <Switch
              checked={data.requiresApproval}
              onCheckedChange={(val) => updateData("requiresApproval", val)}
              disabled={disabled}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/10">
            <div className="space-y-0.5">
              <Label className="text-base text-primary">Is Visible</Label>
              <p className="text-sm text-primary/70">If disabled, this plan will be hidden from all users.</p>
            </div>
            <Switch
              checked={data.isVisible}
              onCheckedChange={(val) => updateData("isVisible", val)}
              disabled={disabled}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
