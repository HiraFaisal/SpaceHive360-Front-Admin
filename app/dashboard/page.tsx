import { 
  Building2, 
  Users, 
  CreditCard, 
  Calendar,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { AnalyticsCard } from "@/components/dashboard/analytics-card";
import { AIRecommendations } from "@/components/dashboard/ai-recommendations";
import { LatestActivities } from "@/components/dashboard/latest-activities";
import { BookingsTable, type Booking } from "@/components/dashboard/bookings-table";

// Mock Data Constants matching Stitch Design
const MOCK_STATS = [
  {
    title: "Total Revenue",
    value: "$42,500",
    icon: CreditCard,
    trend: "up" as const,
    trendValue: "+5.2%",
    description: "this month",
  },
  {
    title: "Active Members",
    value: "312",
    icon: Users,
    trend: "up" as const,
    trendValue: "+12",
    description: "vs last month",
  },
  {
    title: "Total Bookings Today",
    value: "58",
    icon: Calendar,
    trend: "neutral" as const,
    trendValue: "",
    description: "Scheduled for today",
  },
  {
    title: "Occupancy Rate",
    value: "82%",
    icon: Building2,
    trend: "up" as const,
    trendValue: "+1.8%",
    description: "vs last month",
  },
  {
    title: "Unpaid Invoices",
    value: "$5,230",
    icon: AlertCircle,
    trend: "neutral" as const,
    trendValue: "Pending",
    description: "Needs attention",
  },
  {
    title: "AI Insights Alerts",
    value: "3",
    icon: TrendingUp, // Using TrendingUp as a placeholder for AutoAwesome/AI icon
    trend: "neutral" as const,
    trendValue: "Alerts",
    description: "needing attention",
  },
];

const MOCK_BOOKINGS: Booking[] = [
  {
    id: "BK-1024",
    workspace: "Private Suite A1",
    user: {
      name: "Olivia Rhye",
      email: "olivia@untitledui.com",
      image: "/avatars/olivia.jpg",
    },
    date: "Oct 24, 2024",
    duration: "9:00 AM - 5:00 PM",
    status: "confirmed",
    amount: "$320.00",
  },
  {
    id: "BK-1023",
    workspace: "Conference Room B",
    user: {
      name: "Phoenix Baker",
      email: "phoenix@math.dev",
      image: "/avatars/phoenix.jpg",
    },
    date: "Oct 24, 2024",
    duration: "1:00 PM - 2:30 PM",
    status: "pending",
    amount: "$150.00",
  },
  {
    id: "BK-1022",
    workspace: "Hot Desk Zone",
    user: {
      name: "Lana Steiner",
      email: "lana@design.co",
      image: "/avatars/lana.jpg",
    },
    date: "Oct 23, 2024",
    duration: "All Day",
    status: "confirmed",
    amount: "$45.00",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
      </div>

      {/* 2. KPI Stats Grid (6 items) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_STATS.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* 3. Analytics Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <AnalyticsCard
          title="Revenue Analytics"
          description="Monthly revenue data for the current year."
          type="bar"
        />
        <AnalyticsCard
          title="Occupancy Overview"
          description="Occupancy trends over the last 6 months."
          type="line"
        />
      </div>

      {/* 4. AI & Activities Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <AIRecommendations />
        <LatestActivities />
      </div>

      {/* 5. Recent Bookings (Timeline) */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Bookings Timeline</h2>
        <BookingsTable bookings={MOCK_BOOKINGS} />
      </div>
    </div>
  );
}
