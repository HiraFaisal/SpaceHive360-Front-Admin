"use client";

import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Building2, 
  ExternalLink,
  Map as MapIcon,
  SearchX,
  Plus
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { getLocations, deleteLocation, type Location } from "@/lib/api/locations";
import { getCities, type City } from "@/lib/api/cities";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

interface LocationListProps {
  refreshTrigger: number;
  onEdit: (location: Location) => void;
  onAdd: () => void;
  searchTerm?: string;
}

export function LocationList({ refreshTrigger, onEdit, onAdd, searchTerm = "" }: LocationListProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [cities, setCities] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [locs, cityList] = await Promise.all([
        getLocations(),
        getCities()
      ]);
      
      setLocations(locs || []);
      
      const cityMap: Record<string, string> = {};
      if (cityList && Array.isArray(cityList)) {
          cityList.forEach((c: City) => {
            cityMap[c.recId] = c.name;
          });
      }
      setCities(cityMap);
    } catch (err) {
      console.error("Error loading locations:", err);
      toast.error("Failed to load locations");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this location?")) return;
    
    try {
      await deleteLocation(id);
      toast.success("Location deleted successfully");
      loadData();
    } catch (err) {
      toast.error("Failed to delete location");
    }
  };

  const filteredLocations = locations.filter(loc => {
    const searchLower = searchTerm.toLowerCase();
    const cityName = cities[loc.fkCity]?.toLowerCase() || "";
    return (
      loc.name.toLowerCase().includes(searchLower) ||
      (loc.address && loc.address.toLowerCase().includes(searchLower)) ||
      cityName.includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[320px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (filteredLocations.length === 0) {
    return (
      <MotionWrapper delay={0.2}>
        <div className="flex flex-col items-center justify-center py-20 bg-card/50 backdrop-blur-sm rounded-xl border border-dashed border-muted-foreground/20 text-center px-6">
            <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                <SearchX className="size-8 text-primary/40" />
            </div>
            <h3 className="text-xl font-bold tracking-tight">
                {searchTerm ? "No Matching Locations" : "No Locations Found"}
            </h3>
            <p className="text-muted-foreground mt-2 text-sm max-w-sm mx-auto">
                {searchTerm 
                    ? `We couldn't find any locations matching "${searchTerm}".` 
                    : "Your company doesn't have any locations registered yet."}
            </p>
            {searchTerm ? (
                <Button variant="outline" onClick={() => onAdd()} className="mt-6 rounded-lg h-10 px-6">
                    Clear Search
                </Button>
            ) : (
                <Button onClick={onAdd} className="mt-6 rounded-lg h-10 px-6 gap-2 shadow-sm">
                    <Plus className="size-4" />
                    Add Your First Location
                </Button>
            )}
        </div>
      </MotionWrapper>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredLocations.map((loc, index) => (
        <MotionWrapper key={loc.recId} delay={index * 0.05} className="h-full">
            <Card className="group relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
            <div className="h-24 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden shrink-0">
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <MapIcon className="absolute -right-2 -bottom-2 size-24 rotate-12" />
                </div>
                
                <div className="absolute top-3 right-3 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-background/50 backdrop-blur-sm hover:bg-background transition-colors">
                        <MoreVertical className="size-3.5" />
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-lg p-1 min-w-[140px] shadow-lg">
                    <DropdownMenuItem onClick={() => onEdit(loc)} className="gap-2 rounded-md py-1.5 cursor-pointer text-xs">
                        <Edit className="size-3.5" />
                        <span>Edit Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(loc.recId)} className="gap-2 rounded-md py-1.5 cursor-pointer text-xs text-destructive focus:text-destructive">
                        <Trash2 className="size-3.5" />
                        <span>Remove</span>
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>
                
                <div className="absolute -bottom-4 left-6 p-3 bg-background rounded-xl shadow-md border border-primary/10 group-hover:scale-105 transition-transform duration-500">
                    <Building2 className="size-5 text-primary" />
                </div>
            </div>
            
            <CardHeader className="pt-8 px-6 flex-1">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-lg font-bold tracking-tight line-clamp-1" title={loc.name}>
                            {loc.name}
                        </CardTitle>
                        <Badge variant="secondary" className="rounded-full bg-primary/5 text-primary border-none px-2 py-0 text-[10px] font-bold uppercase tracking-wider shrink-0">
                            {cities[loc.fkCity] || "Active"}
                        </Badge>
                    </div>
                    <CardDescription className="flex items-start gap-2 mt-2 h-10 overflow-hidden">
                        <MapPin className="size-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground line-clamp-2 leading-relaxed">
                            {loc.address}
                        </span>
                    </CardDescription>
                </div>
            </CardHeader>
            
            <CardContent className="px-6 pb-4 shrink-0">
                <div className="flex items-center gap-4 py-3 border-y border-border/50">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider">Lat</span>
                        <span className="text-xs font-mono font-medium text-foreground/70">{loc.latitude?.toFixed(4) || "N/A"}</span>
                    </div>
                    <div className="h-6 w-px bg-border/50" />
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider">Lng</span>
                        <span className="text-xs font-mono font-medium text-foreground/70">{loc.longitude?.toFixed(4) || "N/A"}</span>
                    </div>
                </div>
            </CardContent>
            
            <CardFooter className="px-6 pb-6 pt-2 shrink-0">
                <Button variant="outline" className="w-full h-9 rounded-lg gap-2 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                    <ExternalLink className="size-3.5" />
                    Explore Workspace
                </Button>
            </CardFooter>
            </Card>
        </MotionWrapper>
      ))}
    </div>
  );
}
