import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  description?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  description,
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-primary transition-colors group-hover:bg-primary/10">
          <Icon className="size-5" />
        </div>
      </div>
      
      {(trend || description) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={cn(
                "flex items-center gap-0.5 font-medium",
                trend === "up" && "text-emerald-500",
                trend === "down" && "text-rose-500",
                trend === "neutral" && "text-muted-foreground"
              )}
            >
              {trend === "up" && <ArrowUpRight className="size-3" />}
              {trend === "down" && <ArrowDownRight className="size-3" />}
              {trendValue}
            </span>
          )}
          {description && (
            <span className="text-muted-foreground/70">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}
