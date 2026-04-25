"use client";

import { useState } from "react";
import {
    Building2,
    Search,
    MapPin,
    Users,
    Filter,
    Plus,
    Eye,
    Edit,
    Trash2
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
import { NewWorkspaceSheet } from "@/components/workspaces/new-workspace-sheet";

import { useEffect } from "react";
import { getWorkspaces } from "@/lib/api/workspaces";
import { getWorkspaceTypes } from "@/lib/api/workspaceTypes";
import { getLocations } from "@/lib/api/locations";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function WorkspaceListPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [workspaces, setWorkspaces] = useState<any[]>([]);
    const [types, setTypes] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    const refreshData = () => {
        fetchData();
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
                <NewWorkspaceSheet onSuccess={refreshData} />
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
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500/70 hover:text-red-600 hover:bg-red-50">
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
        </div>
    );
}
