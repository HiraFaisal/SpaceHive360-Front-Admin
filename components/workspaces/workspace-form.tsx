"use client";

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

import { useEffect, useState } from "react";
import { getWorkspaceTypes } from "@/lib/api/workspaceTypes";
import { getLocations } from "@/lib/api/locations";
import { createWorkspace } from "@/lib/api/workspaces";
import { toast } from "sonner";

const workspaceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  fkWorkspaceType: z.string().min(1, "Please select a workspace type"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  fkLocation: z.string().min(1, "Location is required"),
  isActive: z.boolean(),
  description: z.string().optional().default(""),
});

type WorkspaceFormValues = z.infer<typeof workspaceSchema>;

interface WorkspaceFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function WorkspaceForm({ initialData, onSuccess, onCancel }: WorkspaceFormProps) {
  const [types, setTypes] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  const form = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema) as any,
    defaultValues: {
      name: initialData?.name ?? "",
      fkWorkspaceType: initialData?.fkWorkspaceType ?? "",
      capacity: initialData?.capacity ?? 1,
      fkLocation: initialData?.fkLocation ?? "",
      isActive: initialData?.isActive ?? true,
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
      await createWorkspace({
        ...values,
        isAvailable: true 
      });
      toast.success("Workspace created successfully");
      onSuccess();
    } catch (error) {
      console.error("Error creating workspace:", error);
      toast.error("Failed to create workspace. Please check your inputs.");
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

        {/* Capacity & Status Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="capacity" className="text-sm font-semibold">Capacity</Label>
            <div className="relative group">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                id="capacity"
                type="number"
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
            <Label htmlFor="isActive" className="text-sm font-semibold">Initial Status</Label>
            <Select 
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

        {/* Location Field */}
        <div className="space-y-2">
          <Label htmlFor="fkLocation" className="text-sm font-semibold">Location</Label>
          <Select 
            onValueChange={(value) => form.setValue("fkLocation", value, { shouldValidate: true })} 
            value={form.watch("fkLocation")}
          >
            <SelectTrigger className="h-11 bg-muted/30 border-muted-foreground/20 focus:ring-primary/30">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select location" />
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
          {form.formState.errors.fkLocation && (
            <p className="text-xs font-medium text-destructive mt-1">{form.formState.errors.fkLocation.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-semibold">Description (Optional)</Label>
          <div className="relative group">
            <Info className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <textarea
              id="description"
              placeholder="Tell us more about this space..."
              className="w-full min-h-[100px] pl-9 pt-2.5 rounded-md bg-muted/30 border border-muted-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition-all"
              {...form.register("description")}
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex flex-col gap-3">
        <Button 
          type="submit" 
          className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin rounded-full" />
              Creating...
            </div>
          ) : "Create Workspace"}
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          className="w-full h-11 text-muted-foreground hover:text-foreground"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>

      <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-3 items-start">
        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Creating a new workspace will make it immediately available for booking unless set to <span className="font-semibold">Maintenance</span>.
        </p>
      </div>
    </form>
  );
}
