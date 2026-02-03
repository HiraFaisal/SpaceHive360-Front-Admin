import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AIInsightPanel() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-primary/10 bg-gradient-to-r from-primary/5 via-primary/5 to-transparent p-1 shadow-sm">
      <div className="flex flex-col gap-4 rounded-lg bg-card/60 p-5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              AI Optimization Insight
              <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                New
              </span>
            </h3>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Based on recent booking patterns, demand for private offices has increased by <span className="font-medium text-foreground">18%</span> this week. Consider adjusting availability for Suite B to maximize revenue.
            </p>
          </div>
        </div>
        <Button size="sm" className="gap-2 shrink-0">
          Apply Recommendation
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
