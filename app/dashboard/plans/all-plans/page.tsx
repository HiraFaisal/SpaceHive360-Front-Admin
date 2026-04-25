"use client";

import { useState } from "react";
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
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

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
import { useEffect } from "react";
import { getPlanMemberships, deletePlanMembership, getPlanStats } from "@/lib/api/planMemberships";
import { toast } from "sonner";
import { Skeleton } from "../../../../components/ui/skeleton";


export default function AllPlansPage() {
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
      const response = await getPlanMemberships({
        search: searchTerm,
        pageNumber: page,
        pageSize: pageSize
      });
      if (response.success) {
        setPlans(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await getPlanStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchStats();
  }, [searchTerm, page, pageSize]);

  const handleDeleteClick = (plan: any) => {
    setSelectedPlan(plan);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPlan) return;
    
    try {
      const response = await deletePlanMembership(selectedPlan.recId);
      if (response.success) {
        toast.success("Plan deleted successfully");
        fetchPlans();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete plan");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/dashboard/plans" className="hover:text-primary transition-colors">Plans</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">All Plans</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">All Plans</h1>
          <p className="text-muted-foreground text-sm">Manage and monitor all your workspace membership plans and pricing.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/plans">
            <Button className="gap-2 bg-primary hover:bg-primary/90 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] px-6 h-11 rounded-xl">
              <Plus className="h-4.5 w-4.5" /> Create New Plan
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards (Optional but keeping consistent with Booking Management) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { title: "Total Plans", value: stats?.totalPlans?.toString() || "0", icon: Layers, color: "text-blue-500", bg: "bg-blue-500/10", hover: "hover:bg-blue-500 hover:border-blue-500" },
          { title: "Active Plans", value: stats?.activePlans?.toString() || "0", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-500/10", hover: "hover:bg-emerald-500 hover:border-emerald-500" },
          { title: "Avg. Price", value: stats ? `$${Math.round(stats.averagePrice)}` : "$0", icon: DollarSign, color: "text-amber-500", bg: "bg-amber-500/10", hover: "hover:bg-amber-500 hover:border-amber-500" },
          { title: "New This Month", value: stats?.newPlansThisMonth?.toString() || "0", icon: Plus, color: "text-purple-500", bg: "bg-purple-500/10", hover: "hover:bg-purple-500 hover:border-purple-500" },
        ].map((stat, index) => (
          <div key={index} className={cn(
            "p-6 rounded-2xl border bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-lg transition-all duration-300 group cursor-default",
            stat.hover
          )}>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground group-hover:text-white/80 transition-colors">{stat.title}</p>
                {statsLoading ? (
                  <Skeleton className="h-9 w-16 mt-1" />
                ) : (
                  <p className="text-3xl font-bold tracking-tight group-hover:text-white transition-colors">{stat.value}</p>
                )}
              </div>
              <div className={cn(
                "p-2.5 rounded-xl transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110", 
                stat.bg
              )}>
                <stat.icon className={cn("h-5 w-5 transition-colors group-hover:text-white", stat.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="rounded-2xl border bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-80 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                className="pl-9 bg-background/50 border-input w-full transition-shadow focus-visible:ring-1 focus-visible:ring-primary/50" 
                placeholder="Search plans by name or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button variant="outline" size="sm" className="h-9 gap-2 text-muted-foreground hover:text-foreground">
              <Filter className="h-4 w-4" /> Filters
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="py-4 pl-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plan Details</TableHead>
                <TableHead className="py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</TableHead>
                <TableHead className="py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Workspace</TableHead>
                <TableHead className="py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</TableHead>
                <TableHead className="py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</TableHead>
                <TableHead className="py-4 pr-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6"><Skeleton className="h-10 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell className="pr-6"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : plans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                    No plans found.
                  </TableCell>
                </TableRow>
              ) : plans.map((plan) => (
                <TableRow key={plan.recId} className="hover:bg-muted/20 transition-colors border-b group">
                  <TableCell className="py-4 pl-6">
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-sm text-foreground truncate">{plan.name}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {plan.recId.substring(0, 8).toUpperCase()} • Created {format(new Date(plan.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-sm font-medium">{plan.planCategory}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-sm text-muted-foreground">
                      {plan.fkWorkspaceType ? "Custom" : "Standard"}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-foreground">${plan.price}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-medium">{plan.durationType}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
                      plan.isActive 
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30' 
                        : 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30'
                    )}>
                      {plan.isActive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />}
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-lg border-muted/50 p-1">
                        <DropdownMenuItem className="cursor-pointer rounded-md flex items-center gap-2" asChild>
                          <Link href={`/dashboard/plans?id=${plan.recId}&edit=true`}>
                            <Edit className="h-3.5 w-3.5" /> Edit Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-muted/50" />
                        <DropdownMenuItem 
                          className="cursor-pointer rounded-md text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center gap-2"
                          onClick={() => handleDeleteClick(plan)}
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete Plan
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination Info */}
        <div className="p-4 border-t border-border/50 text-sm flex items-center justify-between text-muted-foreground">
          <span>
            {loading ? "Loading plans..." : (
              <>Showing <span className="font-medium text-foreground">{plans.length}</span> plans</>
            )}
          </span>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 shadow-sm" 
              disabled={page === 1 || loading}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 shadow-sm"
              disabled={plans.length < pageSize || loading}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" /> Delete Plan
            </DialogTitle>
            <DialogDescription className="py-3">
              Are you sure you want to delete <span className="font-semibold text-foreground">"{selectedPlan?.name}"</span>? 
              This action cannot be undone and will remove the plan from all associated workspaces.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-xl">Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} className="rounded-xl bg-destructive hover:bg-destructive/90">
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
