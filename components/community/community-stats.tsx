import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export function CommunityStats() {
  return (
    <Card className="border border-border/50 shadow-sm bg-card rounded-2xl">
      <CardHeader className="pb-4 pt-5 px-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-bold tracking-tight">Community Health</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-5">
        {/* Top Row Stats */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Total Members
            </p>
            <p className="text-3xl font-bold text-foreground">1,240</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Posts / Month
            </p>
            <p className="text-3xl font-bold text-foreground">482</p>
          </div>
        </div>

        {/* Active This Week - Highlighted */}
        <div className="rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30 p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                Active This Week
              </p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">856</p>
            </div>
            <div className="bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-md">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">+12%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
