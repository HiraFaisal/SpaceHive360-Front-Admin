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
import { PlanData } from "@/app/dashboard/plans/page";

interface PricingCardProps {
  data: PlanData;
  updateData: (key: keyof PlanData, value: any) => void;
}

export function PricingCard({ data, updateData }: PricingCardProps) {
  return (
    <Card className="border-border/5 bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Pricing & Payment Terms</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Monthly Price ($)</Label>
            <Input 
                id="price" 
                type="number" 
                placeholder="299" 
                className="bg-background/50" 
                value={data.price}
                onChange={(e) => updateData("price", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="billingCycle">Billing Cycle</Label>
            <Select value={data.billingCycle} onValueChange={(val) => updateData("billingCycle", val)}>
              <SelectTrigger id="billingCycle" className="bg-background/50">
                <SelectValue placeholder="Select cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="trialPeriod">Trial Period (Days)</Label>
           <Input 
                id="trialPeriod" 
                type="number" 
                placeholder="14" 
                className="bg-background/50" 
                value={data.trialPeriod}
                onChange={(e) => updateData("trialPeriod", e.target.value)}
           />
        </div>
      </CardContent>
    </Card>
  );
}
