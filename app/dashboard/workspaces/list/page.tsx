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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Mock Data
const workspaces = [
    { id: 1, name: "Alpha Conference Room", type: "Conference Room", location: "Building A, Floor 2", capacity: 20, status: "Active" },
    { id: 2, name: "Beta Hot Desk Area", type: "Hot Desk", location: "Building A, Floor 1", capacity: 50, status: "Active" },
    { id: 3, name: "Gamma Private Office", type: "Private Office", location: "Building B, Suite 101", capacity: 4, status: "Occupied" },
    { id: 4, name: "Delta Meeting Pod", type: "Meeting Booth", location: "Building A, Lobby", capacity: 2, status: "Maintenance" },
    { id: 5, name: "Epsilon Event Hall", type: "Event Space", location: "Building C, Ground", capacity: 200, status: "Active" },
];

export default function WorkspaceListPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);

    const filteredWorkspaces = workspaces.filter(ws =>
        ws.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ws.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ws.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">All Workspaces</h1>
                    <p className="text-muted-foreground">Manage individual workspace units and availability.</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> Add Workspace
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Workspace</DialogTitle>
                            <DialogDescription>
                                Create a new workspace unit. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input id="name" placeholder="e.g. Ocean View Room" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="type" className="text-right">
                                    Type
                                </Label>
                                <Input id="type" placeholder="e.g. Conference" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="capacity" className="text-right">
                                    Capacity
                                </Label>
                                <Input id="capacity" type="number" className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={() => setIsAddOpen(false)}>Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
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
                        {filteredWorkspaces.map((ws) => (
                            <TableRow key={ws.id} className="group">
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                            <Building2 className="h-5 w-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span>{ws.name}</span>
                                            <span className="text-xs text-muted-foreground sm:hidden">{ws.type}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10">
                                        {ws.type}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center text-muted-foreground gap-1">
                                        <MapPin className="h-3.5 w-3.5" /> {ws.location}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center text-muted-foreground gap-1">
                                        <Users className="h-3.5 w-3.5" /> {ws.capacity}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${ws.status === 'Active' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                            ws.status === 'Occupied' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                                                'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                                        }`}>
                                        {ws.status}
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
                        ))}
                    </TableBody>
                </Table>
                {filteredWorkspaces.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground">
                        No workspaces found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}
