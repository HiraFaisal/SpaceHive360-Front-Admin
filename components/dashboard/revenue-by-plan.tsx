"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DATA = [
  { name: "Premium Suite", revenue: 12500 },
  { name: "Team Hub", revenue: 8400 },
  { name: "Dedicated Desk", revenue: 5200 },
  { name: "Flex Pass", revenue: 3100 },
  { name: "Meeting Pro", revenue: 2500 },
];

export function RevenueByPlan() {
  return (
    <Card className="rounded-xl border-border/40 shadow-sm transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Revenue by Plan</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
            <XAxis type="number" hide />
            <YAxis 
                dataKey="name" 
                type="category" 
                fontSize={11} 
                width={100}
                axisLine={false}
                tickLine={false}
            />
            <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
            />
            <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
