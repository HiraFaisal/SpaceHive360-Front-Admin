"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import dynamic from "next/dynamic";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Building2, 
  MapPin, 
  Loader2, 
  Info,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { createLocation, updateLocation, type Location } from "@/lib/api/locations";
import { findOrCreateCity } from "@/lib/api/cities";
import { cn } from "@/lib/utils";

// Dynamic import for MapPicker
const MapPicker = dynamic(() => import("./map-picker"), { 
  ssr: false,
  loading: () => <div className="h-[350px] w-full bg-muted/30 animate-pulse rounded-2xl flex items-center justify-center text-muted-foreground border border-dashed border-muted-foreground/20">Loading Map...</div>
});

const locationSchema = z.object({
  name: z.string().min(2, "Location name is required"),
  fkCity: z.string().optional(), // Will be auto-filled
  address: z.string().min(5, "Full address is required"),
  latitude: z.number({ required_error: "Please pick a location on the map" }),
  longitude: z.number({ required_error: "Please pick a location on the map" }),
  isActive: z.boolean().default(true),
});

type LocationFormValues = z.infer<typeof locationSchema>;

interface LocationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location?: Location | null;
  onSuccess: () => void;
}

export function LocationDrawer({ open, onOpenChange, location, onSuccess }: LocationDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [extractedCity, setExtractedCity] = useState<string>("");

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      fkCity: "",
      address: "",
      latitude: undefined,
      longitude: undefined,
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (location) {
        form.reset({
          name: location.name,
          fkCity: location.fkCity,
          address: location.address || "",
          latitude: location.latitude ? Number(location.latitude) : undefined,
          longitude: location.longitude ? Number(location.longitude) : undefined,
          isActive: location.isActive,
        });
      } else {
        form.reset({
          name: "",
          fkCity: "",
          address: "",
          latitude: undefined,
          longitude: undefined,
          isActive: true,
        });
        setExtractedCity("");
      }
    }
  }, [open, location, form]);

  const handleLocationSelect = (lat: number, lng: number, address?: string, city?: string) => {
    form.setValue("latitude", lat, { shouldValidate: true });
    form.setValue("longitude", lng, { shouldValidate: true });
    if (address) {
        form.setValue("address", address, { shouldValidate: true });
    }
    if (city) {
        setExtractedCity(city);
    }
  };

  const onSubmit = async (values: LocationFormValues) => {
    setLoading(true);
    try {
      // 1. Resolve City ID
      let cityId = values.fkCity;
      if (extractedCity) {
          cityId = await findOrCreateCity(extractedCity);
      }
      
      if (!cityId) {
          toast.error("Could not determine city. Please try searching for a more specific address.");
          setLoading(false);
          return;
      }

      const payload = { ...values, fkCity: cityId };

      if (location) {
        await updateLocation(location.recId, payload);
        toast.success("Location updated successfully");
      } else {
        await createLocation(payload);
        toast.success("Location created successfully");
      }
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl lg:max-w-2xl overflow-y-auto p-0 border-l border-border/50">
        <div className="h-full flex flex-col pt-6 pb-2 px-6">
          <SheetHeader className="pb-4 border-b mb-6 text-left relative">
            <SheetTitle className="text-xl font-bold tracking-tight">
              {location ? "Edit Location" : "New Location"}
            </SheetTitle>
            <SheetDescription className="mt-1 text-xs">
              {location ? "Update the location details below." : "Add a new operational location for your company."}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6 pb-8">
            <div className="space-y-5">
              
              {/* Map & Search Section (Top) */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="size-4 text-primary" />
                    Locate on Map
                </Label>
                <MapPicker 
                    onLocationSelect={handleLocationSelect} 
                    initialLocation={location?.latitude && location?.longitude ? [Number(location.latitude), Number(location.longitude)] : undefined}
                />
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-foreground/80">Location Name</Label>
                  <div className="relative group">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="name"
                      placeholder="e.g. Downtown Office"
                      className="pl-9 h-10 bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary/30 rounded-lg"
                      {...form.register("name")}
                    />
                  </div>
                  {form.formState.errors.name && (
                    <p className="text-[10px] font-medium text-destructive mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>

                {/* Auto-extracted City Info */}
                {extractedCity && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="size-3.5 shrink-0" />
                    <p className="text-[10px] font-bold tracking-tight uppercase">
                        City Detected: {extractedCity}
                    </p>
                  </div>
                )}
                {!extractedCity && !location && (
                   <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg">
                    <AlertCircle className="size-3.5 shrink-0" />
                    <p className="text-[10px] font-medium tracking-tight">
                        Pin a location to auto-detect city
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-foreground/80">Full Address</Label>
                  <div className="relative group">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <textarea
                      id="address"
                      placeholder="Full street address..."
                      className="w-full min-h-[80px] pl-9 pt-2.5 rounded-lg bg-muted/30 border border-muted-foreground/20 focus:outline-none focus:ring-1 focus:ring-primary/30 text-sm transition-all"
                      {...form.register("address")}
                    />
                  </div>
                  {form.formState.errors.address && (
                    <p className="text-[10px] font-medium text-destructive mt-1">{form.formState.errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Latitude</Label>
                    <Input 
                      value={form.watch("latitude") || ""} 
                      readOnly 
                      className="h-10 bg-muted/50 border-muted-foreground/10 text-muted-foreground font-mono text-[11px] rounded-lg"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Longitude</Label>
                    <Input 
                      value={form.watch("longitude") || ""} 
                      readOnly 
                      className="h-10 bg-muted/50 border-muted-foreground/10 text-muted-foreground font-mono text-[11px] rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <Button 
                type="submit" 
                className="flex-1 h-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 rounded-lg text-sm font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </div>
                ) : location ? "Update Location" : "Create Location"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="h-10 px-6 text-sm font-medium rounded-lg"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </div>

            <div className="mt-auto pt-4 p-3 rounded-lg bg-primary/5 border border-primary/10 flex gap-3 items-start">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Locations are vital for multi-tenant isolation. Ensure the city is correctly detected for proper filtering in other modules.
              </p>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
