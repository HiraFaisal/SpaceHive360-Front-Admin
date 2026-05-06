"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import { PlanData } from "./types";

interface LivePreviewCardProps {
  data: PlanData;
}


export function LivePreviewCard({ data }: LivePreviewCardProps) {
  return (
    <div className="sticky top-6">
      <div className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">Live Preview</div>
      <Card className="border-border/10 bg-white overflow-hidden relative group text-zinc-900 shadow-xl transition-all duration-300">
        <div className="h-48 relative w-full bg-zinc-100">
            {data.image ? (
                 <Image 
                    src={data.image} 
                    alt="Workspace Preview" 
                    fill 
                    className="object-cover"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-100">
                    <span className="text-zinc-400 text-sm">No Image Preview</span>
                </div>
            )}
             <div className="absolute top-4 right-4 flex gap-2">
                 {data.tags?.split(',').map((tag, i) => tag.trim() && (
                    <Badge key={i} variant="secondary" className="bg-white/90 text-zinc-900 hover:bg-white backdrop-blur-md border border-zinc-200/50 shadow-sm">{tag.trim()}</Badge>
                 ))}
             </div>
        </div>
        
        <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{data.name || "Plan Name"}</CardTitle>
            <p className="text-sm text-zinc-500 mt-1 capitalize">
                {data.type?.replace(/([A-Z])/g, ' $1').trim() || "Standard"}
            </p>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-baseline">
                <span className="text-3xl font-bold">${data.price || "0"}</span>
                <span className="text-sm text-zinc-500 ml-1">/{data.billingCycle}</span>
            </div>

            <div className="space-y-3">
                {data.features?.map((feature, i) => (
                    <div key={i} className="flex items-center text-sm text-zinc-600">
                        <CheckCircle className="mr-3 h-5 w-5 text-[#0078c2]" />
                        {feature}
                    </div>
                ))}
                 {(!data.features || data.features.length === 0) && (
                    <div className="text-sm text-zinc-400 italic">No features added</div>
                )}
            </div>
        </CardContent>
        <CardFooter>
            <Button className="w-full bg-[#0078c2] hover:bg-[#0066a5] text-white py-6 text-lg">Get Started</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

