"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Building2 } from "lucide-react";
import Image from "next/image";
import { PlanData } from "@/app/dashboard/plans/page";

interface LivePreviewCardProps {
  data: PlanData;
  workspaceTypes: any[];
  workspaces: any[];
}

export function LivePreviewCard({ data, workspaceTypes, workspaces }: LivePreviewCardProps) {
  const workspaceTypeName = workspaceTypes.find(t => t.recId === data.fkWorkspaceType)?.name || "Plan Type";
  const workspaceName = workspaces.find(w => w.recId === data.fkWorkspace)?.name || "";

  return (
    <div className="sticky top-6">
      <div className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">Live Preview</div>
      <Card className="border-border/10 bg-white overflow-hidden relative group text-zinc-900 shadow-xl transition-all duration-300">
        <div className="relative aspect-video w-full bg-zinc-100 overflow-hidden">
            {data.images && data.images.length > 0 ? (
                <img 
                    src={URL.createObjectURL(data.images[0])} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="h-12 w-12 text-muted-foreground/20" />
                </div>
            )}
            <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-md border-white/10">
                    {workspaceTypeName}
                </Badge>
            </div>
        </div>
        
        <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-2xl font-bold">{data.name || "Plan Name"}</CardTitle>
                    <p className="text-sm text-zinc-500 mt-1">{workspaceTypeName}</p>
                    {workspaceName && <p className="text-xs text-primary font-medium mt-0.5">{workspaceName}</p>}
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">${data.price}</span>
              <span className="text-sm text-muted-foreground">/ {data.durationValue} {data.durationType}</span>
            </div>

            <div className="space-y-3">
                {data.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-sm text-zinc-600">
                        <CheckCircle className="mr-3 h-5 w-5 text-[#0078c2]" />
                        {feature}
                    </div>
                ))}
                 {data.features.length === 0 && (
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
