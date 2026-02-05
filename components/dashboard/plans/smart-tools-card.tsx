import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Sparkles, BarChart, Zap } from "lucide-react";
import { PlanData } from "@/app/dashboard/plans/page";

interface SmartToolsCardProps {
  data: PlanData;
  updateData: (key: keyof PlanData, value: any) => void;
}

export function SmartToolsCard({ data, updateData }: SmartToolsCardProps) {
  return (
    <Card className="border-border/5 bg-card">
      <CardHeader>
        <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium">Smart Tools</CardTitle>
        </div>
        <CardDescription>AI-powered features to optimize your plan.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
                <Label htmlFor="smart-pricing" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Smart Pricing
                </Label>
                <div className="text-xs text-muted-foreground">
                    Automatically adjust prices based on demand.
                </div>
            </div>
          <Switch id="smart-pricing" />
        </div>
        <div className="flex items-center justify-between space-x-2">
             <div className="flex flex-col space-y-1">
                <Label htmlFor="usage-analytics" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Usage Analytics
                </Label>
                <div className="text-xs text-muted-foreground">
                    Track user engagement and plan utilization.
                </div>
            </div>
          <Switch id="usage-analytics" defaultChecked />
        </div>
        <div className="flex items-center justify-between space-x-2">
             <div className="flex flex-col space-y-1">
                <Label htmlFor="ai-recommendation" className="text-sm font-medium leading-none">
                    AI Recommendation
                </Label>
                <div className="text-xs text-muted-foreground">
                    Enable to feature this plan as AI-recommended.
                </div>
            </div>
          <Switch 
            id="ai-recommendation" 
            checked={data.aiRecommendation}
            onCheckedChange={(checked) => updateData("aiRecommendation", checked)}
            className="data-[state=checked]:bg-primary" 
          />
        </div>

        <div className="space-y-2 pt-2">
             <Label htmlFor="tags">Tags / Labels</Label>
             <Input 
                id="tags" 
                placeholder="e.g. Popular, Best Value" 
                className="bg-background/50" 
                value={data.tags}
                onChange={(e) => updateData("tags", e.target.value)}
             />
             <p className="text-[10px] text-muted-foreground">Comma separated tags will appear on the card.</p>
        </div>
      </CardContent>
    </Card>
  );
}
