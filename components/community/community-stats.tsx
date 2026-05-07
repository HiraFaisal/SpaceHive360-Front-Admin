"use client";

import { useState, useEffect } from "react";
import { communityApi } from "@/lib/api/community";
import { TrendingUp, Users, UserCheck, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function CommunityStats() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    communityApi.getStats().then(res => setStats(res.data));
  }, []);

  const items = [
    { label: "Total Members", value: stats?.totalMembers || "...", icon: Users, color: "text-blue-600" },
    { label: "Active Now", value: stats?.activeMembers || "...", icon: UserCheck, color: "text-emerald-600" },
    { label: "Monthly Posts", value: stats?.totalPosts || "...", icon: MessageSquare, color: "text-purple-600" },
    { label: "Engagement Rate", value: (stats?.monthlyEngagement || 0) + "%", icon: TrendingUp, color: "text-orange-600" },
  ];

  return (
    <Card className="border border-border/50 shadow-sm bg-card rounded-2xl">
      <CardHeader className="pb-4 pt-5 px-6">
        <CardTitle className="text-base font-bold tracking-tight">Community Insights</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center gap-2">
                <item.icon className={`h-4 w-4 ${item.color}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </span>
              </div>
              <p className="text-xl font-bold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Highlight Widget */}
        <div className="rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30 p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                Member Engagement
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">High</p>
            </div>
            <div className="bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-md">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Stable</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
