"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { PlanData } from "./types";


interface FeaturesCardProps {
  data: PlanData;
  updateData: (key: keyof PlanData, value: any) => void;
}

export function FeaturesCard({ data, updateData }: FeaturesCardProps) {
  const [newFeature, setNewFeature] = useState("");

  const addFeature = () => {
    if (newFeature.trim()) {
      updateData("features", [...data.features, newFeature]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    updateData("features", data.features.filter((_, i) => i !== index));
  };

  return (
    <Card className="border-border/5 bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Plan Features</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a new feature..."
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addFeature()}
            className="bg-background/50"
          />
          <Button onClick={addFeature} size="icon" variant="secondary">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {data.features.map((feature, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-md bg-background/50 border border-border/5 group">
              <span className="text-sm">{feature}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFeature(index)}
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {data.features.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-4">
              No features added yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
