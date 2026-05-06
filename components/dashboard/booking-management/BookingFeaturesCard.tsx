"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, UploadCloud } from "lucide-react";
import { Label } from "@/components/ui/label";
import { BookingData } from "@/app/dashboard/booking-management/page";
import { FieldErrors } from "react-hook-form";

interface BookingFeaturesCardProps {
  data: BookingData;
  updateData: (key: keyof BookingData, value: any) => void;
  errors: FieldErrors<BookingData>;
  disabled?: boolean;
}

export function BookingFeaturesCard({ data, updateData, errors, disabled }: BookingFeaturesCardProps) {
  const [newFeature, setNewFeature] = useState("");

  const addFeature = () => {
    if (newFeature.trim()) {
      updateData("features", [...(data.features || []), newFeature]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    updateData("features", (data.features || []).filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      updateData("images", [...(data.images || []), ...Array.from(e.target.files)]);
    }
  };

  const removeImage = (index: number) => {
    updateData("images", (data.images || []).filter((_, i) => i !== index));
  };

  const getImageUrl = (image: any) => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    if (typeof image === "string") {
      if (image.startsWith("http")) return image;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "";
      return `${baseUrl}${image}`;
    }
    return "";
  };

  return (
    <Card className="border-border/5 bg-card overflow-hidden shadow-sm">
      <CardHeader className="border-b border-border/5 bg-muted/20">
        <CardTitle className="text-xl font-bold">Features & Media</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Plan Features</Label>
          {!disabled && (
            <div className="flex gap-2">
              <Input
                placeholder="e.g. High-speed WiFi"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                className="bg-background/50 h-11"
              />
              <Button onClick={addFeature} size="icon" className="h-11 w-11 shadow-sm">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          )}
          <div className="flex flex-wrap gap-2 pt-2">
            {(data.features || []).map((feature, index) => (
              <div key={index} className="group flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-lg text-sm font-medium border border-primary/10 hover:bg-primary/10 transition-colors">
                {feature}
                {!disabled && (
                  <X 
                    className="h-4 w-4 cursor-pointer text-primary/40 group-hover:text-destructive transition-colors" 
                    onClick={() => removeFeature(index)} 
                  />
                )}
              </div>
            ))}
            {(data.features || []).length === 0 && (
              <p className="text-sm text-muted-foreground italic">Add features to highlight the benefits of this plan.</p>
            )}
          </div>
          {errors.features && <p className="text-xs text-destructive">{errors.features.message}</p>}
        </div>

        <div className="space-y-4 border-t border-border/5 pt-8">
          <Label className="text-base font-semibold">Visual Assets</Label>
          <div className="grid grid-cols-4 gap-4">
            {(data.images || []).map((image, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-border/10 bg-muted group shadow-sm">
                <img 
                  src={getImageUrl(image)} 
                  alt="preview" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                {!disabled && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => removeImage(index)}
                      className="bg-destructive text-destructive-foreground rounded-full p-2 shadow-xl hover:scale-110 transition-transform"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
            {!disabled && (
              <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-primary/20 rounded-xl cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-all bg-background/20 group">
                <div className="p-3 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors mb-2">
                  <UploadCloud className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground font-semibold">Upload Image</span>
                <input type="file" className="hidden" multiple onChange={handleImageChange} accept="image/*" />
              </label>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
