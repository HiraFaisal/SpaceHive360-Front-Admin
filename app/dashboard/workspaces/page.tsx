"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Layers,
  ArrowRight,
  MonitorSmartphone,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  PieChart,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkspaceStats } from "@/lib/api/workspaces";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

interface WorkspaceStats {
  totalWorkspaces: number;
  activeWorkspaces: number;
  availableWorkspaces: number;
  occupiedWorkspaces: number;
}

export default function WorkspacesPage() {
  const [stats, setStats] = useState<WorkspaceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getWorkspaceStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const occupancyRate = stats?.activeWorkspaces 
    ? Math.round((stats.occupiedWorkspaces / stats.activeWorkspaces) * 100) 
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <MotionWrapper delay={0.05}>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Workspaces Overview</h1>
          <p className="text-muted-foreground">Manage your workspace resources, types, and locations.</p>
        </div>
      </MotionWrapper>

      {/* Main Navigation Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Workspace Types Card */}
        <MotionWrapper delay={0.1}>
          <Link href="/dashboard/workspaces/types">
            <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer border-l-4 border-l-chart-1 h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-chart-1/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardHeader className="pb-2">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-chart-1/10 text-chart-1 group-hover:bg-chart-1 group-hover:text-white transition-colors duration-300">
                  <Layers className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Workspace Types</CardTitle>
                <CardDescription>Define and manage categories like Desks, Private Offices, and Meeting Rooms.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm font-medium text-chart-1 mt-4 group-hover:underline">
                  Manage Types <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </MotionWrapper>

        {/* All Workspaces Card */}
        <MotionWrapper delay={0.15}>
          <Link href="/dashboard/workspaces/list">
            <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer border-l-4 border-l-chart-2 h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-chart-2/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardHeader className="pb-2">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-chart-2/10 text-chart-2 group-hover:bg-chart-2 group-hover:text-white transition-colors duration-300">
                  <Building2 className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">All Workspaces</CardTitle>
                <CardDescription>View, edit, and manage all individual workspace units across locations.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm font-medium text-chart-2 mt-4 group-hover:underline">
                  View List <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </MotionWrapper>

        {/* Resource / Asset Management Card */}
        <MotionWrapper delay={0.2}>
          <Link href="/dashboard/workspaces/resources">
            <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer border-l-4 border-l-chart-4 h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-chart-4/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardHeader className="pb-2">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-chart-4/10 text-chart-4 group-hover:bg-chart-4 group-hover:text-white transition-colors duration-300">
                  <MonitorSmartphone className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Resources</CardTitle>
                <CardDescription>Manage equipment, amenities, and inventory for your spaces.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm font-medium text-chart-4 mt-4 group-hover:underline">
                  Manage Resources <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </MotionWrapper>
      </div>

      {/* Real-time Stats & Insights Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Quick Stats Grid */}
        <MotionWrapper delay={0.25} className="md:col-span-2 lg:col-span-3">
          <Card className="h-full shadow-sm border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold">Quick Stats</CardTitle>
                <CardDescription>Real-time workspace inventory for your organization</CardDescription>
              </div>
              <LayoutDashboard className="h-5 w-5 text-muted-foreground/50" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatItem 
                  label="Total Workspaces" 
                  value={loading ? "..." : stats?.totalWorkspaces ?? 0} 
                  icon={<Building2 className="h-4 w-4" />}
                  color="text-blue-500"
                  bg="bg-blue-500/10"
                />
                <StatItem 
                  label="Active Units" 
                  value={loading ? "..." : stats?.activeWorkspaces ?? 0} 
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  color="text-emerald-500"
                  bg="bg-emerald-500/10"
                />
                <StatItem 
                  label="Available Now" 
                  value={loading ? "..." : stats?.availableWorkspaces ?? 0} 
                  icon={<Clock className="h-4 w-4" />}
                  color="text-amber-500"
                  bg="bg-amber-500/10"
                />
                <StatItem 
                  label="Occupied" 
                  value={loading ? "..." : stats?.occupiedWorkspaces ?? 0} 
                  icon={<PieChart className="h-4 w-4" />}
                  color="text-rose-500"
                  bg="bg-rose-500/10"
                />
              </div>
            </CardContent>
          </Card>
        </MotionWrapper>

        {/* Utilization/Insight Card (Replacement for Quick Add) */}
        <MotionWrapper delay={0.3} className="md:col-span-2 lg:col-span-1">
          <Card className="h-full shadow-sm border-primary/10 bg-primary/5 group">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Space Utilization</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <CardDescription>Overall occupancy rate</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 pt-4">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="text-4xl font-black text-primary">{loading ? "..." : `${occupancyRate}%`}</div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Current Occupancy</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Available Capacity</span>
                    <span className="text-primary">{loading ? "..." : `${100 - occupancyRate}%`}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-primary/10 overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000 ease-in-out" 
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-background/50 p-2 text-center border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase">Available</p>
                    <p className="text-sm font-bold">{loading ? "..." : stats?.availableWorkspaces}</p>
                  </div>
                  <div className="rounded-lg bg-background/50 p-2 text-center border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase">Occupied</p>
                    <p className="text-sm font-bold">{loading ? "..." : stats?.occupiedWorkspaces}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionWrapper>
      </div>
    </div>
  );
}

function StatItem({ label, value, icon, color, bg }: { label: string; value: string | number; icon: React.ReactNode; color: string; bg: string }) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-border/50 bg-background/50 hover:border-border hover:shadow-sm transition-all duration-300">
      <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
      </div>
    </div>
  );
}
