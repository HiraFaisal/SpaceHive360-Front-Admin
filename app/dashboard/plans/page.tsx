"use client";

import { useState } from "react";
import { PlanDetailsCard } from "@/components/dashboard/plans/plan-details-card";
import { PricingCard } from "@/components/dashboard/plans/pricing-card";
import { FeaturesCard } from "@/components/dashboard/plans/features-card";
import { SmartToolsCard } from "@/components/dashboard/plans/smart-tools-card";
import { LivePreviewCard } from "@/components/dashboard/plans/live-preview-card";
import { Button } from "@/components/ui/button";

export interface PlanData {
  name: string;
  type: string;
  description: string;
  price: string;
  billingCycle: string;
  trialPeriod: string;
  features: string[];
  aiRecommendation: boolean;
  tags: string;
  image: string | null;
}

export default function PlansPage() {
  const [data, setData] = useState<PlanData>({
    name: "Ultimate Freelancer Desk",
    type: "hotDesk",
    description: "",
    price: "299",
    billingCycle: "monthly",
    trialPeriod: "14",
    features: ["24/7 Access", "High-Speed WiFi", "Free Coffee / Snacks"],
    aiRecommendation: true,
    tags: "Popular",
    image: null,
  });

  const updateData = (key: keyof PlanData, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Create New Plan</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Discard</Button>
          <Button>Save Plan</Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 space-y-6">
            <PlanDetailsCard data={data} updateData={updateData} />
            <PricingCard data={data} updateData={updateData} />
            <FeaturesCard data={data} updateData={updateData} />
            <SmartToolsCard data={data} updateData={updateData} />
        </div>
        <div className="hidden md:block col-span-3">
            <LivePreviewCard data={data} />
        </div>
      </div>
    </div>
  );
}
