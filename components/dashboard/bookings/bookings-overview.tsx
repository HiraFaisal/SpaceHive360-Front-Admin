"use strict";

import { CalendarCheck, Zap, Activity, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const OVERVIEW_DATA = [
  {
    title: "Total Bookings",
    value: "1,284",
    trend: "+12%",
    trendUp: true,
    icon: CalendarCheck,
    iconColor: "text-primary",
    iconBg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    title: "Active Bookings",
    value: "42",
    badgeLabel: "Active",
    icon: Zap,
    iconColor: "text-indigo-600 dark:text-indigo-400",
    iconBg: "bg-indigo-50 dark:bg-indigo-900/20",
    badgeColor: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400",
  },
  {
    title: "Occupancy Rate",
    value: "84.2%",
    badgeLabel: "Target 90%",
    icon: Activity,
    iconColor: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-50 dark:bg-purple-900/20",
    badgeColor: "text-slate-400 dark:text-slate-500",
  },
  {
    title: "Total Revenue",
    value: "$128,450",
    badgeLabel: "+$4.2k today",
    icon: DollarSign,
    iconColor: "text-green-600 dark:text-green-400",
    iconBg: "bg-green-50 dark:bg-green-900/20",
    badgeColor: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
  },
];

export function BookingsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {OVERVIEW_DATA.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="p-6 border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-2 rounded-lg transition-colors group-hover:bg-opacity-80", card.iconBg)}>
                <Icon className={cn("h-6 w-6", card.iconColor)} strokeWidth={2} />
              </div>
              {card.trend && (
                <span className={cn(
                  "text-xs font-bold px-2 py-1 rounded-full",
                  card.trendUp ? "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400" : "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400"
                )}>
                  {card.trend}
                </span>
              )}
              {card.badgeLabel && !card.trend && (
                <span className={cn("text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap", card.badgeColor)}>
                  {card.badgeLabel}
                </span>
              )}
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
                {card.title}
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {card.value}
              </h3>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
