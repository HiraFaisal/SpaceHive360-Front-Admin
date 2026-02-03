import { 
  Building2, 
  Users, 
  CreditCard, 
  Percent 
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { AnalyticsCard } from "@/components/dashboard/analytics-card";
import { BookingsTable, type Booking } from "@/components/dashboard/bookings-table";
import { AIInsightPanel } from "@/components/dashboard/ai-insight";

// Mock Data Constants
const MOCK_STATS = [
  {
    title: "Total Workspaces",
    value: "142",
    icon: Building2,
    trend: "up" as const,
    trendValue: "+12%",
    description: "vs last month",
  },
  {
    title: "Active Bookings",
    value: "1,294",
    icon: Users,
    trend: "up" as const,
    trendValue: "+8.4%",
    description: "vs last month",
  },
  {
    title: "Monthly Revenue",
    value: "$48,290",
    icon: CreditCard,
    trend: "up" as const,
    trendValue: "+15.3%",
    description: "vs last month",
  },
  {
    title: "Occupancy Rate",
    value: "86%",
    icon: Percent,
    trend: "neutral" as const,
    trendValue: "+1%",
    description: "vs last month",
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
  {
    id: "BK-1021",
    workspace: "Podcast Studio",
    user: {
      name: "Demi Wilkinson",
      email: "demi@podcast.net",
      image: "/avatars/demi.jpg",
    },
    date: "Oct 23, 2024",
    duration: "10:00 AM - 12:00 PM",
    status: "cancelled",
    amount: "$80.00",
  },
  {
    id: "BK-1020",
    workspace: "Private Suite C4",
    user: {
      name: "Drew Cano",
      email: "drew@startup.io",
      image: "/avatars/drew.jpg",
    },
    date: "Oct 22, 2024",
    duration: "Weekly Rate",
    status: "confirmed",
    amount: "$1,200.00",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back. Here is what is happening with your spaces today.
        </p>
      </div>

      {/* 2. AI Insight */}
      <AIInsightPanel />

      {/* 3. KPI Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_STATS.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* 4. Analytics Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <AnalyticsCard
          title="Booking Trends"
          description="Daily booking volume over the last 30 days."
          type="bar"
        />
        <AnalyticsCard
          title="Revenue Overview"
          description="Net revenue comparison with projected targets."
          type="line"
        />
      </div>

      {/* 5. Recent Bookings */}
      <BookingsTable bookings={MOCK_BOOKINGS} />
    </div>
  );
}
