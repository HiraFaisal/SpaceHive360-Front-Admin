"use client";

import Link from "next/link";
import {
  Building2,
  Layers,
  MapPin,
  Plus,
  ArrowRight,
  MonitorSmartphone,
  Users
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function WorkspacesPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Workspaces Overview</h1>
        <p className="text-muted-foreground">Manage your workspace resources, types, and locations.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Workspace Types Card */}
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

        {/* All Workspaces Card */}
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

        {/* Resource / Asset Management (Optional 3rd Card) */}
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
      </div>

      {/* Quick Stats or Recent Activity Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Overview of your inventory.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 p-4 rounded-lg bg-muted/50">
                <span className="text-sm font-medium text-muted-foreground">Total Spaces</span>
                <span className="text-2xl font-bold">124</span>
              </div>
              <div className="flex flex-col gap-1 p-4 rounded-lg bg-muted/50">
                <span className="text-sm font-medium text-muted-foreground">Active Types</span>
                <span className="text-2xl font-bold">8</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-sm bg-primary/5 border-primary/10">
          <CardHeader>
            <CardTitle>Quick Add</CardTitle>
            <CardDescription>Create a new resource quickly.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button className="w-full justify-start gap-2" size="lg">
              <Plus className="h-4 w-4" /> Add New Workspace
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 border-primary/20 hover:bg-primary/10" size="lg">
              <Layers className="h-4 w-4" /> Add Workspace Type
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
