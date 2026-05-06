"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadCloud } from "lucide-react";
import { PlanData } from "./types";


interface PlanDetailsCardProps {
  data: PlanData;
  updateData: (key: keyof PlanData, value: any) => void;
}

export function PlanDetailsCard({ data, updateData }: PlanDetailsCardProps) {
  return (
    <Card className="border-border/5 bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Plan Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="planName">Plan Name</Label>
          <Input 
            id="planName" 
            placeholder="e.g. Professional Plan" 
            className="bg-background/50"
            value={data.name}
            onChange={(e) => updateData("name", e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
              <Label htmlFor="planType">Plan Type</Label>
              <Select value={data.type} onValueChange={(val) => updateData("type", val)}>
                  <SelectTrigger id="planType" className="bg-background/50">
                      <SelectValue placeholder="Select plan type" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="hotDesk">Hot Desk</SelectItem>
                      <SelectItem value="dedicatedDesk">Dedicated Desk</SelectItem>
                      <SelectItem value="privateOffice">Private Office</SelectItem>
                  </SelectContent>
              </Select>
          </div>
          <div className="space-y-2">
              <Label htmlFor="maxSlots">Max Slots (0 for Unlimited)</Label>
              <Input 
                id="maxSlots" 
                type="number"
                placeholder="50" 
                className="bg-background/50"
                value={data.maxSlots}
                onChange={(e) => updateData("maxSlots", parseInt(e.target.value) || 0)}
              />
          </div>
        </div>

        <div className="space-y-2">
            <Label>Plan Images</Label>
            <div className="border-2 border-dashed border-border/10 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-muted/5 transition-colors cursor-pointer bg-background/20">
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                    <UploadCloud className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG (REC. 800x600px)</p>
            </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="planDescription">Description</Label>
          <Textarea
            id="planDescription"
            placeholder="Briefly describe what this plan offers..."
            className="min-h-[100px] bg-background/50 resize-y"
            value={data.description}
            onChange={(e) => updateData("description", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
