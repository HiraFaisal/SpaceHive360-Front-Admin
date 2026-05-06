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
import { BookingData } from "@/app/dashboard/booking-management/page";
import { FieldErrors } from "react-hook-form";

interface BookingDetailsCardProps {
  data: BookingData;
  updateData: (key: keyof BookingData, value: any) => void;
  workspaces: any[];
  workspaceTypes: any[];
  errors: FieldErrors<BookingData>;
  disabled?: boolean;
}

export function BookingDetailsCard({ data, updateData, workspaces, workspaceTypes, errors, disabled }: BookingDetailsCardProps) {
  const handleWorkspaceChange = (workspaceId: string) => {
    const selectedWorkspace = workspaces.find(w => w.recId === workspaceId);
    if (selectedWorkspace) {
      updateData("fkWorkspace", workspaceId);
      
      const typeId = selectedWorkspace.fkWorkspaceType || 
                     selectedWorkspace.fk_workspace_type || 
                     selectedWorkspace.FkWorkspaceType || "";
                     
      const locationId = selectedWorkspace.fkLocation || 
                         selectedWorkspace.fk_location || 
                         selectedWorkspace.FkLocation || "";

      const companyId = selectedWorkspace.fkCompany || 
                        selectedWorkspace.fk_company || 
                        selectedWorkspace.FkCompany || "";

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
        <div className="space-y-2">
          <Label htmlFor="name">Plan Name</Label>
          <Input 
            id="name" 
            placeholder="e.g. Executive Meeting Room" 
            className="bg-background/50"
            value={data.name}
            onChange={(e) => updateData("name", e.target.value)}
            disabled={disabled}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the workspace and what's included in this booking plan..."
            className="min-h-[100px] bg-background/50 resize-y"
            value={data.description}
            onChange={(e) => updateData("description", e.target.value)}
            disabled={disabled}
          />
          {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border/5">
          <div className="space-y-2">
            <Label htmlFor="workspace">Workspace</Label>
            <Select 
              value={data.fkWorkspace} 
              onValueChange={handleWorkspaceChange}
              disabled={disabled}
            >
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

          <div className="space-y-2">
            <Label htmlFor="workspaceType">Workspace Type</Label>
            <Select 
              value={data.fkWorkspaceType} 
              onValueChange={(val) => updateData("fkWorkspaceType", val)}
              disabled={disabled}
            >
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
        </div>
      </CardContent>
    </Card>
  );
}
