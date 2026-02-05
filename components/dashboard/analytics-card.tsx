import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LineChart, BarChart } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  description?: string;
  type?: "line" | "bar";
  className?: string;
}

export function AnalyticsCard({ title, description, type = "line", className }: AnalyticsCardProps) {
  return (
    <div className={cn("flex flex-col rounded-xl border border-border/40 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/10", className)}>
      <div className="p-6 border-b border-border/40">
        <h3 className="text-base font-semibold text-foreground tracking-tight">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      
      <div className="relative flex min-h-[300px] w-full flex-1 flex-col items-center justify-center gap-4 overflow-hidden bg-muted/20 p-6">
        {/* Placeholder Visuals */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
             {type === "line" ? (
                 <svg viewBox="0 0 100 100" className="h-full w-full stroke-foreground" fill="none">
                     <path d="M0 100 C 20 50 50 80 100 20" strokeWidth="2" />
                 </svg>
             ) : (
                 <div className="flex items-end gap-2 h-1/2">
                     <div className="w-8 h-1/2 bg-foreground" />
                     <div className="w-8 h-3/4 bg-foreground" />
                     <div className="w-8 h-full bg-foreground" />
                 </div>
             )}
        </div>

        <div className="z-10 flex flex-col items-center gap-3 text-center">
            <div className="rounded-full bg-background p-4 shadow-sm ring-1 ring-border/50">
                {type === "line" ? <LineChart className="size-6 text-primary" /> : <BarChart className="size-6 text-primary" />}
            </div>
            <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Chart Visualization</p>
                <p className="max-w-[12rem] text-xs text-muted-foreground/80">
                    Detailed {type} chart data will be rendered here via Recharts.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
