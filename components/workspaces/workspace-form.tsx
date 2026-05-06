"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Building2, MapPin, Users, Info } from "lucide-react";

import { getWorkspaceTypes } from "@/lib/api/workspaceTypes";
import { getLocations } from "@/lib/api/locations";
import { createWorkspace, updateWorkspace } from "@/lib/api/workspaces";
import { toast } from "sonner";

const workspaceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  fkWorkspaceType: z.string().min(1, "Please select a workspace type"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  fkLocation: z.string().min(1, "Location is required"),
  inventoryType: z.enum(["UNIT", "SEAT"]),
  maxUnits: z.number().min(1, "Must be at least 1"),
  isActive: z.boolean(),
  isAvailable: z.boolean(),
  description: z.string().optional().default(""),
});

type WorkspaceFormValues = z.infer<typeof workspaceSchema>;

interface WorkspaceFormProps {
  initialData?: any;
  mode?: "create" | "view" | "edit";
  onSuccess: () => void;
  onCancel: () => void;
}

export function WorkspaceForm({ initialData, mode = "create", onSuccess, onCancel }: WorkspaceFormProps) {
  const [types, setTypes] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const isViewOnly = mode === "view";

  const form = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema) as any,
    defaultValues: {
      name: initialData?.name ?? "",
      fkWorkspaceType: initialData?.fkWorkspaceType ?? "",
      capacity: initialData?.capacity ?? 1,
      fkLocation: initialData?.fkLocation ?? "",
      inventoryType: (initialData?.inventoryType as "UNIT" | "SEAT") ?? "UNIT",
      maxUnits: initialData?.maxUnits ?? 1,
      isActive: initialData?.isActive ?? true,
      isAvailable: initialData?.isAvailable ?? true,
      description: initialData?.description ?? "",
    },
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [typesData, locationsData] = await Promise.all([
          getWorkspaceTypes(),
          getLocations()
        ]);
        setTypes(typesData);
        setLocations(locationsData);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptions();
  }, []);

  const onSubmit = async (values: WorkspaceFormValues) => {
    try {
      if (mode === "create") {
        await createWorkspace(values);
        toast.success("Workspace created successfully");
      } else {
        await updateWorkspace(initialData.recId, values);
        toast.success("Workspace updated successfully");
      }
      onSuccess();
    } catch (error) {
      console.error(`Error ${mode === "create" ? "creating" : "updating"} workspace:`, error);
      toast.error(`Failed to ${mode === "create" ? "create" : "update"} workspace.`);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold">Workspace Name</Label>
          <div className="relative group">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="name"
              disabled={isViewOnly}
              placeholder="e.g. Creative Suite A"
              className="pl-9 h-11 bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary/30"
              {...form.register("name")}
            />
          </div>
          {form.formState.errors.name && (
            <p className="text-xs font-medium text-destructive mt-1">{form.formState.errors.name.message}</p>
          )}
        </div>

        {/* Type Field */}
        <div className="space-y-2">
          <Label htmlFor="fkWorkspaceType" className="text-sm font-semibold">Workspace Type</Label>
          <Select 
            disabled={isViewOnly}
            onValueChange={(value) => form.setValue("fkWorkspaceType", value, { shouldValidate: true })} 
            value={form.watch("fkWorkspaceType")}
          >
            <SelectTrigger className="h-11 bg-muted/30 border-muted-foreground/20 focus:ring-primary/30">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {types.map((type) => (
                <SelectItem key={type.recId} value={type.recId}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.fkWorkspaceType && (
            <p className="text-xs font-medium text-destructive mt-1">{form.formState.errors.fkWorkspaceType.message}</p>
          )}
        </div>

        {/* Inventory Type & Max Units */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="inventoryType" className="text-sm font-semibold">Inventory Type</Label>
            <Select 
              disabled={isViewOnly}
              onValueChange={(value) => {
                form.setValue("inventoryType", value as "UNIT" | "SEAT", { shouldValidate: true });
                if (value === "UNIT") form.setValue("maxUnits", 1);
              }} 
              value={form.watch("inventoryType")}
            >
              <SelectTrigger className="h-11 bg-muted/30 border-muted-foreground/20 focus:ring-primary/30">
                <SelectValue placeholder="Select inventory model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UNIT">Unit (Whole Room)</SelectItem>
                <SelectItem value="SEAT">Seat (Per Person)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground px-1">
              {form.watch("inventoryType") === "UNIT" 
                ? "Booked as a single entity (e.g. Office, Meeting Room)." 
                : "Booked by individual seats (e.g. Hot Desks)."}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxUnits" className="text-sm font-semibold">Max Units/Slots</Label>
            <Input
              id="maxUnits"
              type="number"
              disabled={isViewOnly || form.watch("inventoryType") === "UNIT"}
              placeholder="1"
              className="h-11 bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary/30"
              {...form.register("maxUnits", { valueAsNumber: true })}
            />
            {form.formState.errors.maxUnits && (
              <p className="text-xs font-medium text-destructive mt-1">{form.formState.errors.maxUnits.message}</p>
            )}
          </div>
        </div>

        {/* Capacity & Status Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="capacity" className="text-sm font-semibold">Capacity</Label>
            <div className="relative group">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                id="capacity"
                type="number"
                disabled={isViewOnly}
                placeholder="4"
                className="pl-9 h-11 bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary/30"
                {...form.register("capacity", { valueAsNumber: true })}
              />
            </div>
            {form.formState.errors.capacity && (
              <p className="text-xs font-medium text-destructive mt-1">{form.formState.errors.capacity.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="isActive" className="text-sm font-semibold">Status</Label>
            <Select 
              disabled={isViewOnly}
              onValueChange={(value) => form.setValue("isActive", value === "true", { shouldValidate: true })} 
              value={form.watch("isActive") ? "true" : "false"}
            >
              <SelectTrigger className="h-11 bg-muted/30 border-muted-foreground/20 focus:ring-primary/30">
                <SelectValue placeholder="Active" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location & Availability Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fkLocation" className="text-sm font-semibold">Location</Label>
            <Select 
              disabled={isViewOnly}
              onValueChange={(value) => form.setValue("fkLocation", value, { shouldValidate: true })} 
              value={form.watch("fkLocation")}
            >
              <SelectTrigger className="h-11 bg-muted/30 border-muted-foreground/20 focus:ring-primary/30">
                <div className="flex items-center gap-2 overflow-hidden">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <SelectValue placeholder="Select location" className="truncate" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.recId} value={loc.recId}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="isAvailable" className="text-sm font-semibold">Availability</Label>
            <Select 
              disabled={isViewOnly}
              onValueChange={(value) => form.setValue("isAvailable", value === "true", { shouldValidate: true })} 
              value={form.watch("isAvailable") ? "true" : "false"}
            >
              <SelectTrigger className="h-11 bg-muted/30 border-muted-foreground/20 focus:ring-primary/30">
                <SelectValue placeholder="Available" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Available</SelectItem>
                <SelectItem value="false">Booked/Busy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-semibold">Description (Optional)</Label>
          <div className="relative group">
            <Info className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <textarea
              id="description"
              disabled={isViewOnly}
              placeholder="Tell us more about this space..."
              className="w-full min-h-[100px] pl-9 pt-2.5 rounded-md bg-muted/30 border border-muted-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition-all"
              {...form.register("description")}
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex flex-col gap-3">
        {!isViewOnly && (
          <Button 
            type="submit" 
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin rounded-full" />
                Saving...
              </div>
            ) : mode === "create" ? "Create Workspace" : "Save Changes"}
          </Button>
        )}
        <Button 
          type="button" 
          variant="ghost" 
          className="w-full h-11 text-muted-foreground hover:text-foreground"
          onClick={onCancel}
        >
          {isViewOnly ? "Close" : "Cancel"}
        </Button>
      </div>

      <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-3 items-start">
        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          {mode === "view" ? "You are in view-only mode. Click Edit to make changes." : 
           "Workspaces are immediately available for booking once active and available."}
        </p>
      </div>
    </form>
  );
}
