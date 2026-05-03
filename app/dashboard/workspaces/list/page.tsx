"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
    Building2,
    Search,
    MapPin,
    Users,
    Filter,
    Plus,
    Eye,
    Edit,
    Trash2,
    AlertTriangle
} from "lucide-react";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { WorkspaceSheet } from "@/components/workspaces/workspace-sheet";
import { deleteWorkspace, getWorkspaces } from "@/lib/api/workspaces";
import { getWorkspaceTypes } from "@/lib/api/workspaceTypes";
import { getLocations } from "@/lib/api/locations";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function WorkspaceListPage() {
    const searchParams = useSearchParams();
    const locationId = searchParams.get("locationId");
    const [searchTerm, setSearchTerm] = useState("");
    
    const [workspaces, setWorkspaces] = useState<any[]>([]);
    const [types, setTypes] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Sheet states
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [sheetMode, setSheetMode] = useState<"create" | "view" | "edit">("create");
    const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);

    // Delete dialog states
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [workspaceToDelete, setWorkspaceToDelete] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [wsData, typesData, locData] = await Promise.all([
                getWorkspaces(),
                getWorkspaceTypes(),
                getLocations()
            ]);
            setWorkspaces(wsData);
            setTypes(typesData);
            setLocations(locData);
        } catch (error) {
            console.error("Error fetching workspaces:", error);
            toast.error("Failed to load workspaces. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (locationId && locations.length > 0) {
            const location = locations.find(l => l.recId === locationId);
            if (location) {
                setSearchTerm(location.name);
            }
        }
    }, [locationId, locations]);

    const refreshData = () => {
        fetchData();
        setIsSheetOpen(false);
        setSelectedWorkspace(null);
    };

    const handleAction = (mode: "view" | "edit" | "create", workspace?: any) => {
        setSheetMode(mode);
        setSelectedWorkspace(workspace || null);
        setIsSheetOpen(true);
    };

    const confirmDelete = (workspace: any) => {
        setWorkspaceToDelete(workspace);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!workspaceToDelete) return;
        
        try {
            setIsDeleting(true);
            await deleteWorkspace(workspaceToDelete.recId);
            toast.success("Workspace deleted successfully");
            setIsDeleteDialogOpen(false);
            setWorkspaceToDelete(null);
            fetchData();
        } catch (error) {
            toast.error("Failed to delete workspace");
        } finally {
            setIsDeleting(false);
        }
    };

    const getTypeName = (typeId: string) => {
        return types.find(t => t.recId === typeId)?.name || "Unknown Type";
    };

    const getLocationName = (locationId: string) => {
        return locations.find(l => l.recId === locationId)?.name || "Unknown Location";
    };

    const filteredWorkspaces = workspaces.filter(ws =>
        ws.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getTypeName(ws.fkWorkspaceType).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getLocationName(ws.fkLocation).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">All Workspaces</h1>
                    <p className="text-muted-foreground text-sm">Manage individual workspace units and availability.</p>
                </div>
                <Button 
                    onClick={() => handleAction("create")}
                    className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                    <Plus className="h-4 w-4" /> Add Workspace
                </Button>
            </div>

            <div className="flex items-center gap-2 bg-card p-4 rounded-lg border shadow-sm">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Search by name, type, or location..."
                    className="border-none shadow-none focus-visible:ring-0 flex-1 bg-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="ghost" size="icon">
                    <Filter className="h-5 w-5 text-muted-foreground" />
                </Button>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="w-[300px]">Workspace Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Capacity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : filteredWorkspaces.length > 0 ? (
                            filteredWorkspaces.map((ws) => (
                                <TableRow key={ws.recId} className="group">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                <Building2 className="h-5 w-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span>{ws.name}</span>
                                                <span className="text-xs text-muted-foreground sm:hidden">{getTypeName(ws.fkWorkspaceType)}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10">
                                            {getTypeName(ws.fkWorkspaceType)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-muted-foreground gap-1">
                                            <MapPin className="h-3.5 w-3.5" /> {getLocationName(ws.fkLocation)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-muted-foreground gap-1">
                                            <Users className="h-3.5 w-3.5" /> {ws.capacity || 0}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${ws.isActive ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/20'
                                            }`}>
                                            {ws.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                onClick={() => handleAction("view", ws)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                onClick={() => handleAction("edit", ws)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-red-500/70 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => confirmDelete(ws)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No workspaces found matching your search.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* View/Edit Sheet */}
            <WorkspaceSheet 
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                mode={sheetMode}
                initialData={selectedWorkspace}
                onSuccess={refreshData}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px] overflow-hidden p-0 border-none shadow-2xl">
                    <div className="bg-destructive/10 p-6 flex flex-col items-center gap-4 text-center">
                        <div className="h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center animate-pulse">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                        </div>
                        <div className="space-y-1">
                            <DialogTitle className="text-2xl font-bold text-foreground">Delete Workspace</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                This action cannot be undone. Are you sure?
                            </DialogDescription>
                        </div>
                    </div>
                    
                    <div className="p-6 pt-0 space-y-4">
                        <div className="rounded-lg bg-muted/50 p-4 border border-border/50">
                            <p className="text-sm text-muted-foreground">You are about to delete:</p>
                            <p className="text-lg font-semibold text-foreground mt-1">{workspaceToDelete?.name}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <Building2 className="h-3.5 w-3.5" />
                                <span>{getTypeName(workspaceToDelete?.fkWorkspaceType)}</span>
                                <span>•</span>
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{getLocationName(workspaceToDelete?.fkLocation)}</span>
                            </div>
                        </div>
                        
                        <DialogFooter className="flex-col sm:flex-row gap-3 pt-2">
                            <Button
                                variant="ghost"
                                onClick={() => setIsDeleteDialogOpen(false)}
                                className="flex-1 h-11"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 h-11 shadow-lg shadow-destructive/20 transition-all hover:scale-[1.02]"
                            >
                                {isDeleting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                                        Deleting...
                                    </div>
                                ) : "Yes, Delete Workspace"}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
