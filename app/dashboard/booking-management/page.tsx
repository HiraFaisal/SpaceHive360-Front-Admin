"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Save, Trash2, X } from "lucide-react";

import { getWorkspaces } from "@/lib/api/workspaces";
import { getWorkspaceTypes } from "@/lib/api/workspaceTypes";
import { getLocations } from "@/lib/api/locations";
import { createPlanBooking, getPlanBookingById, updatePlanBooking } from "@/lib/api/planBookings";

import { BookingDetailsCard } from "@/components/dashboard/booking-management/BookingDetailsCard";
import { BookingScheduleCard } from "@/components/dashboard/booking-management/BookingScheduleCard";
import { BookingPricingCard } from "@/components/dashboard/booking-management/BookingPricingCard";
import { BookingRulesCard } from "@/components/dashboard/booking-management/BookingRulesCard";
import { BookingFeaturesCard } from "@/components/dashboard/booking-management/BookingFeaturesCard";
import { BookingLivePreview } from "@/components/dashboard/booking-management/BookingLivePreview";

const bookingSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  fkWorkspaceType: z.string().min(1, "Workspace type is required"),
  fkWorkspace: z.string().min(1, "Workspace is required"),
  fkLocation: z.string().optional(),
  fkCompany: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  availableDays: z.array(z.string()).min(1, "Select at least one available day"),
  minDurationMinutes: z.number().min(1, "Minimum duration is required"),
  maxDurationMinutes: z.number().min(1, "Maximum duration is required"),
  priceType: z.string().min(1, "Price type is required"),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: "Price must be a positive number",
  }),
  allowCancellation: z.boolean(),
  requiresApproval: z.boolean(),
  isVisible: z.boolean(),
  features: z.array(z.string()).optional(),
  images: z.array(z.any()).optional(),
});

export type BookingData = z.infer<typeof bookingSchema>;

export default function BookingManagementPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("id");
  const isEdit = searchParams.get("edit") === "true";
  const isView = searchParams.get("view") === "true";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      description: "",
      fkWorkspaceType: "",
      fkWorkspace: "",
      startTime: "09:00",
      endTime: "18:00",
      availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      minDurationMinutes: 60,
      maxDurationMinutes: 480,
      priceType: "hourly",
      price: "0",
      allowCancellation: true,
      requiresApproval: false,
      isVisible: true,
      features: [],
      images: [],
    },
  });

  const data = watch();

  const [options, setOptions] = useState({
    workspaces: [] as any[],
    workspaceTypes: [] as any[],
    locations: [] as any[],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [ws, wt, loc] = await Promise.all([
          getWorkspaces(),
          getWorkspaceTypes(),
          getLocations(),
        ]);
        setOptions({
          workspaces: ws,
          workspaceTypes: wt,
          locations: loc,
        });

        if ((isEdit || isView) && bookingId) {
          const res = await getPlanBookingById(bookingId);
          if (res.success) {
            const booking = res.data;
            reset({
              name: booking.name,
              description: booking.description || "",
              fkWorkspaceType: booking.fkWorkspaceType || "",
              fkWorkspace: booking.fkWorkspace || "",
              fkLocation: booking.fkLocation || "",
              fkCompany: booking.fkCompany || "",
              startTime: booking.startTime?.substring(0, 5) || "09:00",
              endTime: booking.endTime?.substring(0, 5) || "18:00",
              availableDays: booking.availableDays || [],
              minDurationMinutes: booking.minDurationMinutes || 60,
              maxDurationMinutes: booking.maxDurationMinutes || 480,
              priceType: booking.priceType || "hourly",
              price: booking.price?.toString() || "0",
              allowCancellation: booking.allowCancellation,
              requiresApproval: booking.requiresApproval,
              isVisible: booking.isVisible,
              features: booking.features || [],
              images: booking.images || [],
            });
          }
        }
      } catch (err) {
        console.error("Error fetching options:", err);
        toast.error("Failed to load options");
      }
    };
    fetchOptions();
  }, [bookingId, isEdit, isView, reset]);

  const updateData = (key: keyof BookingData, value: any) => {
    setValue(key, value, { shouldValidate: true });
  };

  const handleSave = async (values: BookingData) => {
    const toastId = toast.loading(isEdit ? "Updating booking plan..." : "Creating booking plan...");
    try {
      const formData = new FormData();
      formData.append("Name", values.name);
      formData.append("Description", values.description);
      formData.append("FkWorkspaceType", values.fkWorkspaceType);
      formData.append("FkWorkspace", values.fkWorkspace);
      if (values.fkLocation) formData.append("FkLocation", values.fkLocation);
      if (values.fkCompany) formData.append("FkCompany", values.fkCompany);
      formData.append("StartTime", values.startTime + ":00");
      formData.append("EndTime", values.endTime + ":00");
      formData.append("MinDurationMinutes", values.minDurationMinutes.toString());
      formData.append("MaxDurationMinutes", values.maxDurationMinutes.toString());
      formData.append("PriceType", values.priceType);
      formData.append("Price", values.price);
      formData.append("AllowCancellation", values.allowCancellation.toString());
      formData.append("RequiresApproval", values.requiresApproval.toString());
      formData.append("IsVisible", values.isVisible.toString());

      values.availableDays.forEach((day, index) => {
        formData.append(`AvailableDays[${index}]`, day);
      });

      if (values.features) {
        values.features.forEach((feature, index) => {
          formData.append(`Features[${index}]`, feature);
        });
      }

      if (values.images) {
        values.images.forEach((image) => {
          if (image instanceof File) {
            formData.append("Images", image);
          }
        });
      }

      if (isEdit && bookingId) {
        const response = await updatePlanBooking(bookingId, formData);
        if (response.success) {
          toast.success("Booking plan updated successfully!", { id: toastId });
          setTimeout(() => {
            router.push("/dashboard/booking-management/all");
          }, 1000);
        } else {
          toast.error(response.message || "Failed to update plan", { id: toastId });
        }
      } else {
        const response = await createPlanBooking(formData);
        if (response.success) {
          toast.success("Booking plan created successfully!", { id: toastId });
          setTimeout(() => {
            router.push("/dashboard/booking-management/all");
          }, 1000);
        } else {
          toast.error(response.message || "Failed to create plan", { id: toastId });
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred", { id: toastId });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/dashboard/booking-management/all" className="hover:text-primary transition-colors">Booking Management</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">
              {isView ? "View Plan" : isEdit ? "Edit Plan" : "Create Plan"}
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            {isView ? "Plan Details" : isEdit ? "Edit Booking Plan" : "Create Booking Plan"}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            {isView ? "Back" : "Discard"}
          </Button>
          {!isView && (
            <Button onClick={handleSubmit(handleSave)} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEdit ? "Update Plan" : "Save Plan"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 space-y-6">
          <BookingDetailsCard
            data={data}
            updateData={updateData}
            workspaces={options.workspaces}
            workspaceTypes={options.workspaceTypes}
            errors={errors}
            disabled={isView}
          />
          <BookingScheduleCard
            data={data}
            updateData={updateData}
            errors={errors}
            disabled={isView}
          />
          <BookingPricingCard
            data={data}
            updateData={updateData}
            errors={errors}
            disabled={isView}
          />
          <BookingRulesCard
            data={data}
            updateData={updateData}
            disabled={isView}
          />
          <BookingFeaturesCard
            data={data}
            updateData={updateData}
            errors={errors}
            disabled={isView}
          />
        </div>
        <div className="hidden md:block col-span-3">
          <BookingLivePreview
            data={data}
            workspaces={options.workspaces}
          />
        </div>
      </div>
    </div>
  );
}
