"use client";

import { useState } from "react";
import { Plus, MapPin, Building2, Search, ArrowRight, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocationList } from "@/components/settings/location-list";
import { LocationDrawer } from "@/components/settings/location-drawer";
import { type Location } from "@/lib/api/locations";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

export default function LocationsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAdd = () => {
    setSelectedLocation(null);
    setDrawerOpen(true);
  };

  const handleEdit = (location: Location) => {
    setSelectedLocation(location);
    setDrawerOpen(true);
  };

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <MotionWrapper delay={0.1}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Business Locations
                </h1>
                <p className="text-muted-foreground text-sm">
                    Configure and manage your organization's geographical branches.
                </p>
            </div>

            <Button 
                onClick={handleAdd}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
                <Plus className="h-4 w-4" />
                Add Location
            </Button>
        </div>
      </MotionWrapper>

      {/* Search & Actions Bar */}
      <MotionWrapper delay={0.2}>
        <div className="flex items-center gap-2 bg-card p-4 rounded-lg border shadow-sm">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input 
                placeholder="Search locations by name or address..." 
                className="border-none shadow-none focus-visible:ring-0 flex-1 bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </MotionWrapper>

      {/* Locations Display Area */}
      <div className="relative min-h-[400px]">
        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -left-24 size-96 bg-primary/5 rounded-full blur-[100px] -z-10" />
        <div className="absolute -bottom-24 -right-24 size-96 bg-primary/10 rounded-full blur-[120px] -z-10" />
        
        <LocationList 
            refreshTrigger={refreshTrigger} 
            onEdit={handleEdit} 
            onAdd={handleAdd}
            searchTerm={searchTerm}
        />
      </div>

      {/* Add/Edit Side Drawer */}
      <LocationDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen} 
        location={selectedLocation}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
