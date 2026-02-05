import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";

const RECOMMENDATIONS = [
  {
    title: "Demand Prediction",
    description: "High demand for meeting rooms expected next Tuesday.",
    type: "Prediction",
  },
  {
    title: "Pricing Optimization",
    description: "Consider a 10% price increase for private offices due to 95% occupancy.",
    type: "Strategy",
  },
];

export function AIRecommendations() {
  return (
    <Card className="col-span-1 rounded-xl border-border/40 shadow-sm transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border/40">
        <div className="flex items-center gap-2">
           <div className="p-2 rounded-lg bg-primary/10">
               <Sparkles className="h-4 w-4 text-primary" />
           </div>
           <CardTitle className="text-base font-semibold tracking-tight">AI Insights</CardTitle>
        </div>
        <Badge variant="outline" className="font-normal text-xs text-muted-foreground">Updated now</Badge>
      </CardHeader>
      <CardContent className="grid gap-4 pt-6">
        {RECOMMENDATIONS.map((rec, index) => (
          <div
            key={index}
            className="flex items-start justify-between space-x-4 rounded-md border p-4 transition-all hover:bg-muted/50"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{rec.title}</p>
              <p className="text-sm text-muted-foreground">
                {rec.description}
              </p>
            </div>
            {/* <Badge variant="secondary" className="text-primary bg-primary/10">{rec.type}</Badge> */}
          </div>
        ))}
         <div className="flex items-center text-sm text-primary hover:underline cursor-pointer pt-2">
            View all insights <ArrowRight className="ml-1 h-3 w-3" />
        </div>
      </CardContent>
    </Card>
  );
}
