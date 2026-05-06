"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadCloud } from "lucide-react";
import { PlanData } from "@/app/dashboard/plans/page";

import { FieldErrors } from "react-hook-form";

interface PlanDetailsCardProps {
  data: PlanData;
  updateData: (key: keyof PlanData, value: any) => void;
  workspaces: any[];
  workspaceTypes: any[];
  locations: any[];
  errors: FieldErrors<PlanData>;
}

export function PlanDetailsCard({ data, updateData, workspaces, workspaceTypes, errors }: PlanDetailsCardProps) {
  const handleWorkspaceChange = (workspaceId: string) => {
    const selectedWorkspace = workspaces.find(w => w.recId === workspaceId);
    console.log("Selected Workspace:", selectedWorkspace);
    
    if (selectedWorkspace) {
      updateData("fkWorkspace", workspaceId);
      
      // Extract properties (checking all possible casings for robustness)
      const locationId = selectedWorkspace.fkLocation || 
                         selectedWorkspace.fk_location || 
                         selectedWorkspace.FkLocation || "";
                         
      const companyId = selectedWorkspace.fkCompany || 
                        selectedWorkspace.fk_company || 
                        selectedWorkspace.FkCompany || "";
                        
      const typeId = selectedWorkspace.fkWorkspaceType || 
                     selectedWorkspace.fk_workspace_type || 
                     selectedWorkspace.FkWorkspaceType || "";

      console.log("Derived Values:", { locationId, companyId, typeId });

      // Automatically derive associated fields
      updateData("fkWorkspaceType", typeId);
      updateData("fkLocation", locationId);
      updateData("fkCompany", companyId);
    }
  };

  return (
    <Card className="border-border/5 bg-card overflow-hidden shadow-sm">
      <CardHeader className="border-b border-border/5 bg-muted/20">
        <CardTitle className="text-xl font-bold">General Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="planName">Plan Name</Label>
                <Input 
                    id="planName" 
                    placeholder="e.g. Professional Plan" 
                    className="bg-background/50"
                    value={data.name}
                    onChange={(e) => updateData("name", e.target.value)}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="planCategory">Plan Category</Label>
                <Select value={data.planCategory} onValueChange={(val) => updateData("planCategory", val)}>
                    <SelectTrigger id="planCategory" className="bg-background/50">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="membership">Membership</SelectItem>
                        <SelectItem value="hot-desk">Hot Desk</SelectItem>
                        <SelectItem value="private-office">Private Office</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="planDescription">Description</Label>
          <Textarea
            id="planDescription"
            placeholder="Briefly describe what this plan offers..."
            className="min-h-[100px] bg-background/50 resize-y"
            value={data.description}
            onChange={(e) => updateData("description", e.target.value)}
          />
          {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
        </div>

        <div className="border-t border-border/5 pt-6 mt-6">
            <CardTitle className="text-xl font-bold mb-6">Workspace Configuration</CardTitle>
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="workspaceType">Workspace Type</Label>
                    <Select value={data.fkWorkspaceType} onValueChange={(val) => updateData("fkWorkspaceType", val)}>
                        <SelectTrigger id="workspaceType" className="bg-background/50">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            {workspaceTypes.map((type) => (
                                <SelectItem key={type.recId} value={type.recId}>
                                    {type.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.fkWorkspaceType && <p className="text-xs text-destructive">{errors.fkWorkspaceType.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="workspace">Workspace</Label>
                    <Select value={data.fkWorkspace} onValueChange={handleWorkspaceChange}>
                        <SelectTrigger id="workspace" className="bg-background/50">
                            <SelectValue placeholder="Select workspace" />
                        </SelectTrigger>
                        <SelectContent>
                            {workspaces.map((ws) => (
                                <SelectItem key={ws.recId} value={ws.recId}>
                                    {ws.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.fkWorkspace && <p className="text-xs text-destructive">{errors.fkWorkspace.message}</p>}
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
