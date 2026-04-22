"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PlanData } from "@/app/dashboard/plans/page";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { FieldErrors } from "react-hook-form";

interface PricingCardProps {
  data: PlanData;
  updateData: (key: keyof PlanData, value: any) => void;
  paymentTerms: any[];
  errors: FieldErrors<PlanData>;
}

export function PricingCard({ data, updateData, paymentTerms, errors }: PricingCardProps) {
  return (
    <Card className="border-border/5 bg-card overflow-hidden shadow-sm">
      <CardHeader className="border-b border-border/5 bg-muted/20">
        <CardTitle className="text-xl font-bold">Duration & Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Duration Type</Label>
          <RadioGroup 
            value={data.durationType} 
            onValueChange={(val) => updateData("durationType", val)}
            className="grid grid-cols-4 gap-4"
          >
            {["daily", "weekly", "monthly", "yearly"].map((type) => (
              <Label
                key={type}
                htmlFor={type}
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
              >
                <RadioGroupItem value={type} id={type} className="sr-only" />
                <span className="capitalize font-medium">{type}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="durationValue" className="font-semibold">Duration Value</Label>
          <Input 
            id="durationValue" 
            type="number" 
            placeholder="e.g. 1" 
            className="bg-background/50 h-11" 
            value={isNaN(data.durationValue) ? "" : data.durationValue}
            onChange={(e) => {
                const val = parseInt(e.target.value);
                updateData("durationValue", isNaN(val) ? 0 : val);
            }}
          />
          {errors.durationValue && <p className="text-xs text-destructive">{errors.durationValue.message}</p>}
        </div>

        <div className="border-t border-border/5 pt-8">
            <CardTitle className="text-xl font-bold mb-6">Pricing Details</CardTitle>
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="price" className="font-semibold">Price ($)</Label>
                    <Input 
                        id="price" 
                        type="number" 
                        placeholder="299" 
                        className="bg-background/50 h-11" 
                        value={data.price === "NaN" ? "" : data.price}
                        onChange={(e) => updateData("price", e.target.value)}
                    />
                    {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paymentTerm" className="font-semibold">Payment Term</Label>
                    <Select value={data.fkPaymentTerm} onValueChange={(val) => updateData("fkPaymentTerm", val)}>
                        <SelectTrigger id="paymentTerm" className="bg-background/50 h-11">
                            <SelectValue placeholder="Select term" />
                        </SelectTrigger>
                        <SelectContent>
                            {paymentTerms.map((term) => (
                                <SelectItem key={term.recId} value={term.recId}>
                                    {term.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.fkPaymentTerm && <p className="text-xs text-destructive">{errors.fkPaymentTerm.message}</p>}
                </div>
            </div>
        </div>

        <div className="border-t border-border/5 pt-8">
            <CardTitle className="text-xl font-bold mb-6">Rules & Automation</CardTitle>
            <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border/5 bg-muted/10">
                    <div className="space-y-1">
                        <Label className="text-base font-semibold">Recurring Plan</Label>
                        <p className="text-sm text-muted-foreground">Automatically renew plan at end of period</p>
                    </div>
                    <Switch 
                        checked={data.isRecurring} 
                        onCheckedChange={(val) => updateData("isRecurring", val)} 
                    />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border/5 bg-muted/10">
                    <div className="space-y-1">
                        <Label className="text-base font-semibold">Allow Cancellation</Label>
                        <p className="text-sm text-muted-foreground">Permit users to cancel active memberships</p>
                    </div>
                    <Switch 
                        checked={data.allowCancellation} 
                        onCheckedChange={(val) => updateData("allowCancellation", val)} 
                    />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border/5 bg-muted/10">
                    <div className="space-y-1">
                        <Label className="text-base font-semibold">Requires Approval</Label>
                        <p className="text-sm text-muted-foreground">Manual review required for new bookings</p>
                    </div>
                    <Switch 
                        checked={data.requiresApproval} 
                        onCheckedChange={(val) => updateData("requiresApproval", val)} 
                    />
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
