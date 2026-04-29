"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Plus,
  RefreshCcw,
  FileText,
  DollarSign,
  Calendar,
  Layers,
  Edit,
  Trash2,
  ChevronRight,
  Eye,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllPlanBookings, deletePlanBooking, getPlanBookingStats } from "@/lib/api/planBookings";

export default function AllBookingPlansPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [stats, setStats] = useState<any>(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await getAllPlanBookings({
        search: searchTerm,
        pageNumber: page,
        pageSize: pageSize
      });
      if (response.success) {
        setPlans(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch booking plans");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await getPlanBookingStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch stats only once on mount or when manually refreshed
  useEffect(() => {
    fetchStats();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // Reset to first page on search
      fetchPlans();
    }, 500); // Wait 500ms after last keystroke

    return () => clearTimeout(timer);
  }, [searchTerm, page, pageSize]);

  const handleDeleteClick = (plan: any) => {
    setSelectedPlan(plan);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPlan) return;
    
    const toastId = toast.loading("Deleting booking plan...");
    try {
      const response = await deletePlanBooking(selectedPlan.recId);
      if (response.success) {
        toast.success("Booking plan deleted successfully", { id: toastId });
        fetchPlans();
        fetchStats();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete plan", { id: toastId });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8 p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/dashboard/booking-management" className="hover:text-primary transition-colors">Booking Management</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">All Booking Plans</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">All Booking Plans</h1>
          <p className="text-muted-foreground text-sm">Manage hourly and daily booking plans for meeting rooms and workspaces.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/booking-management">
            <Button className="gap-2 bg-primary hover:bg-primary/90 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] px-6 h-11 rounded-xl">
              <Plus className="h-4.5 w-4.5" /> Create New Booking Plan
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { title: "Total Plans", value: stats?.totalPlans?.toString() || "0", icon: Layers, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Active Plans", value: stats?.activePlans?.toString() || "0", icon: Clock, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { title: "Avg. Rate", value: stats ? `$${Math.round(stats.averagePrice)}` : "$0", icon: DollarSign, color: "text-amber-500", bg: "bg-amber-500/10" },
          { title: "New This Month", value: stats?.newPlansThisMonth?.toString() || "0", icon: Plus, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((stat, index) => (
          <div key={index} className="p-6 rounded-2xl border bg-card/60 backdrop-blur-xl shadow-sm transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                {statsLoading ? (
                  <Skeleton className="h-9 w-16 mt-1" />
                ) : (
                  <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                )}
              </div>
              <div className={cn("p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-80 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
              <Input 
                className="pl-9 bg-background/50 border-input w-full" 
                placeholder="Search plans..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button variant="outline" size="sm" className="h-9 gap-2" onClick={() => fetchPlans()}>
              <RefreshCcw className={cn("h-4 w-4", loading && "animate-spin")} /> Refresh
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="py-4 pl-6 text-xs font-semibold uppercase tracking-wider">Plan Details</TableHead>
                <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider">Schedule</TableHead>
                <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider">Price</TableHead>
                <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                <TableHead className="py-4 pr-6 text-xs font-semibold uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6"><Skeleton className="h-10 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell className="pr-6"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : plans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-muted-foreground">
                    No booking plans found.
                  </TableCell>
                </TableRow>
              ) : plans.map((plan) => (
                <TableRow key={plan.recId} className="hover:bg-muted/20 transition-colors border-b group">
                  <TableCell className="py-4 pl-6">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{plan.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {plan.recId.substring(0, 8).toUpperCase()} • {format(new Date(plan.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{plan.startTime?.substring(0,5)} - {plan.endTime?.substring(0,5)}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{plan.availableDays?.length} Days Available</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">${plan.price}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{plan.priceType}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-1.5">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border w-fit",
                        plan.isActive 
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      )}>
                        {plan.isActive ? 'Active' : 'Deleted'}
                      </span>
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border w-fit",
                        plan.isVisible 
                          ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' 
                          : 'bg-slate-500/10 text-slate-600 border-slate-500/20'
                      )}>
                        {plan.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-lg p-1">
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/booking-management?id=${plan.recId}&view=true`)}>
                          <Eye className="mr-2 h-3.5 w-3.5" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/booking-management?id=${plan.recId}&edit=true`)}>
                          <Edit className="mr-2 h-3.5 w-3.5" /> Edit Plan
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          onClick={() => handleDeleteClick(plan)}
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete Plan
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" /> Delete Booking Plan
            </DialogTitle>
            <DialogDescription className="py-3">
              Are you sure you want to delete <span className="font-semibold text-foreground">"{selectedPlan?.name}"</span>? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Confirm Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
