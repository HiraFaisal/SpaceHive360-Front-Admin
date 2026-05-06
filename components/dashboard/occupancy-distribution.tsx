"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DATA = [
  { name: "Private Offices", value: 45 },
  { name: "Dedicated Desks", value: 25 },
  { name: "Hot Desks", value: 20 },
  { name: "Meeting Rooms", value: 10 },
];

const COLORS = ["hsl(var(--primary))", "#3b82f6", "#10b981", "#f59e0b"];

export function OccupancyDistribution() {
  return (
    <Card className="rounded-xl border-border/40 shadow-sm transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Occupancy Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={DATA}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
                 contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
