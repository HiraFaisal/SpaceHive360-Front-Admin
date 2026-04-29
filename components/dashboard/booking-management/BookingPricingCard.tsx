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
import { BookingData } from "@/app/dashboard/booking-management/page";
import { FieldErrors } from "react-hook-form";

interface BookingPricingCardProps {
  data: BookingData;
  updateData: (key: keyof BookingData, value: any) => void;
  errors: FieldErrors<BookingData>;
  disabled?: boolean;
}

export function BookingPricingCard({ data, updateData, errors, disabled }: BookingPricingCardProps) {
  return (
    <Card className="border-border/5 bg-card overflow-hidden shadow-sm">
      <CardHeader className="border-b border-border/5 bg-muted/20">
        <CardTitle className="text-xl font-bold">Pricing Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="priceType">Price Type</Label>
            <Select 
              value={data.priceType} 
              onValueChange={(val) => updateData("priceType", val)}
              disabled={disabled}
            >
              <SelectTrigger id="priceType" className="bg-background/50">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
              </SelectContent>
            </Select>
            {errors.priceType && <p className="text-xs text-destructive">{errors.priceType.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                className="pl-7 bg-background/50"
                value={data.price}
                onChange={(e) => updateData("price", e.target.value)}
                disabled={disabled}
              />
            </div>
            {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
