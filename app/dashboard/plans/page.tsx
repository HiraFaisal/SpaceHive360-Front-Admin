"use client";

import { useState } from "react";
import { PlanDetailsCard } from "@/components/dashboard/plans/plan-details-card";
import { PricingCard } from "@/components/dashboard/plans/pricing-card";
import { FeaturesCard } from "@/components/dashboard/plans/features-card";
import { SmartToolsCard } from "@/components/dashboard/plans/smart-tools-card";
import { LivePreviewCard } from "@/components/dashboard/plans/live-preview-card";
import { Button } from "@/components/ui/button";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const planSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  planCategory: z.string().min(1, "Category is required"),
  fkWorkspaceType: z.string().min(1, "Workspace type is required"),
  fkWorkspace: z.string().min(1, "Workspace selection is required"),
  fkLocation: z.string().min(1, "Location is required (derived from workspace)"),
  fkCompany: z.string().min(1, "Company is required (derived from workspace)"),
  durationType: z.string().min(1, "Duration type is required"),
  durationValue: z.number().min(1, "Value must be at least 1"),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: "Price must be a positive number",
  }),
  fkPaymentTerm: z.string().min(1, "Payment term is required"),
  isRecurring: z.boolean(),
  allowCancellation: z.boolean(),
  requiresApproval: z.boolean(),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  images: z.array(z.any()), // Handling Files via Zod can be complex, keeping as any array for now
  aiRecommendation: z.boolean(),
  tags: z.string().optional(),
});

export type PlanData = z.infer<typeof planSchema>;

import { useEffect } from "react";
import { getWorkspaces } from "@/lib/api/workspaces";
import { getWorkspaceTypes } from "@/lib/api/workspaceTypes";
import { getPaymentTerms } from "@/lib/api/paymentTerms";
import { createPlanMembership } from "@/lib/api/planMemberships";
import { getLocations } from "@/lib/api/locations";

import { toast } from "sonner";

export default function PlansPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<PlanData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: "",
      description: "",
      planCategory: "membership",
      fkWorkspaceType: "",
      fkWorkspace: "",
      fkLocation: "",
      fkCompany: "",
      durationType: "monthly",
      durationValue: 1,
      price: "0",
      fkPaymentTerm: "",
      isRecurring: true,
      allowCancellation: true,
      requiresApproval: false,
      features: [],
      images: [],
      aiRecommendation: false,
      tags: "",
    },
    mode: "onSubmit",
  });

  const data = watch();

  const [options, setOptions] = useState({
    workspaces: [] as any[],
    workspaceTypes: [] as any[],
    paymentTerms: [] as any[],
    locations: [] as any[],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [ws, wt, pt, loc] = await Promise.all([
          getWorkspaces(),
          getWorkspaceTypes(),
          getPaymentTerms(),
          getLocations(),
        ]);
        setOptions({
          workspaces: ws,
          workspaceTypes: wt,
          paymentTerms: pt,
          locations: loc,
        });
      } catch (err) {
        console.error("Error fetching options:", err);
      }
    };
    fetchOptions();
  }, []);

  const updateData = (key: keyof PlanData, value: any) => {
    setValue(key, value, { shouldValidate: true });
  };

  const handleSave = async (values: PlanData) => {
    const toastId = toast.loading("Creating plan membership...");
    try {
      const formData = new FormData();
      
      // Basic Info
      formData.append("Name", values.name);
      formData.append("Description", values.description);
      formData.append("PlanCategory", values.planCategory);

      // Workspace Selection
      if (values.fkWorkspaceType) formData.append("FkWorkspaceType", values.fkWorkspaceType);
      if (values.fkWorkspace) formData.append("FkWorkspace", values.fkWorkspace);
      if (values.fkLocation) formData.append("FkLocation", values.fkLocation);
      if (values.fkCompany) formData.append("FkCompany", values.fkCompany);

      // Duration
      formData.append("DurationType", values.durationType);
      formData.append("DurationValue", values.durationValue.toString());

      // Pricing
      formData.append("Price", values.price);
      if (values.fkPaymentTerm) formData.append("FkPaymentTerm", values.fkPaymentTerm);

      // Rules
      formData.append("IsRecurring", values.isRecurring.toString());
      formData.append("AllowCancellation", values.allowCancellation.toString());
      formData.append("RequiresApproval", values.requiresApproval.toString());

      // Features (JSON)
      values.features.forEach((feature, index) => {
        formData.append(`Features[${index}]`, feature);
      });

      // Images (Files)
      values.images.forEach((image) => {
        formData.append("Images", image);
      });

      await createPlanMembership(formData);
      toast.success("Plan Membership created successfully!", { id: toastId });
      reset();
    } catch (err: any) {
      console.error("Error saving plan:", err);
      toast.error("Failed to save plan: " + err.message, { id: toastId });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Create New Plan</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => reset()}>Discard</Button>
          <Button 
            onClick={handleSubmit(handleSave)} 
            className="bg-primary hover:bg-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Plan"}
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 space-y-6">
            <PlanDetailsCard 
              data={data} 
              updateData={updateData} 
              workspaces={options.workspaces}
              workspaceTypes={options.workspaceTypes}
              locations={options.locations}
              errors={errors}
            />
            <PricingCard 
              data={data} 
              updateData={updateData} 
              paymentTerms={options.paymentTerms}
              errors={errors}
            />
            <FeaturesCard data={data} updateData={updateData} errors={errors} />
            <SmartToolsCard data={data} updateData={updateData} />
        </div>
        <div className="hidden md:block col-span-3">
            <LivePreviewCard 
              data={data} 
              workspaces={options.workspaces}
              workspaceTypes={options.workspaceTypes}
            />
        </div>
      </div>
    </div>
  );
}
