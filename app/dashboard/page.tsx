"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  Users, 
  CreditCard, 
  Calendar,
  AlertCircle,
  TrendingUp,
  Loader2
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { AnalyticsCard } from "@/components/dashboard/analytics-card";
import { AIRecommendations } from "@/components/dashboard/ai-recommendations";
import { LatestActivities } from "@/components/dashboard/latest-activities";
import { BookingsTable, type Booking } from "@/components/dashboard/bookings-table";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { bookingApi } from "@/lib/api/bookings";
import { OccupancyDistribution } from "@/components/dashboard/occupancy-distribution";
import { RevenueByPlan } from "@/components/dashboard/revenue-by-plan";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        bookingApi.getStats(),
        bookingApi.getAll("", 1, 5)
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (bookingsRes.success) {
        setRecentBookings(bookingsRes.data.items.map((b: any) => ({
          id: b.recId,
          workspace: b.planName,
          user: { name: b.memberName, email: b.memberEmail },
          date: new Date(b.bookingDate).toLocaleDateString(),
          duration: b.planType,
          status: b.bookingStatus.toLowerCase(),
          amount: `$${b.totalAmount}`
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statItems = [
    { title: "Total Revenue", value: stats ? `$${stats.totalRevenue.toLocaleString()}` : "$0", icon: CreditCard, trend: "up" as const, trendValue: "+5.2%", description: "this month" },
    { title: "Active Members", value: stats ? stats.activeMembers.toString() : "0", icon: Users, trend: "up" as const, trendValue: "+12", description: "vs last month" },
    { title: "Bookings Today", value: stats ? stats.totalBookingsToday.toString() : "0", icon: Calendar, trend: "neutral" as const, trendValue: "", description: "Scheduled for today" },
    { title: "Occupancy Rate", value: "82%", icon: Building2, trend: "up" as const, trendValue: "+1.8%", description: "vs last month" },
    { title: "Unpaid Invoices", value: "$0", icon: AlertCircle, trend: "neutral" as const, trendValue: "Pending", description: "Needs attention" },
    { title: "AI Insights", value: "3", icon: TrendingUp, trend: "neutral" as const, trendValue: "Alerts", description: "needing attention" },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
      </div>

      {/* 2. KPI Stats Grid (6 items) */}
      <MotionWrapper delay={0.1}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {statItems.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </MotionWrapper>

      {/* 3. Analytics Section */}
      <MotionWrapper delay={0.2}>
        <div className="grid gap-4 md:grid-cols-2">
          <AnalyticsCard title="Revenue Analytics" description="Monthly revenue data for the current year." type="area" />
          <AnalyticsCard title="Occupancy Overview" description="Occupancy trends over the last 6 months." type="line" />
        </div>
      </MotionWrapper>

      {/* 4. Distribution & Revenue Row */}
      <MotionWrapper delay={0.25}>
        <div className="grid gap-4 md:grid-cols-2">
          <OccupancyDistribution />
          <RevenueByPlan />
        </div>
      </MotionWrapper>

      {/* 5. AI & Activities Row */}
      <MotionWrapper delay={0.3}>
        <div className="grid gap-4 md:grid-cols-2">
          <AIRecommendations />
          <LatestActivities />
        </div>
      </MotionWrapper>

      {/* 6. Recent Bookings (Timeline) */}
      <MotionWrapper delay={0.4}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Recent Bookings</h2>
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          <BookingsTable bookings={recentBookings} />
        </div>
      </MotionWrapper>
    </div>
  );
}