"use client";

import { useState } from "react";
import {
    Layers,
    Search,
    Settings2,
    Plus,
    Eye,
    Edit,
    Trash2,
    MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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

// Mock Data for Types
const workspaceTypes = [
    { id: 1, name: "Private Office", count: 12, price: "$500/mo", features: ["Lockable", "24/7 Access", "Mail Handling"], icon: "🏢" },
    { id: 2, name: "Hot Desk", count: 45, price: "$150/mo", features: ["High-speed Wifi", "Coffee", "Open Area"], icon: "☕" },
    { id: 3, name: "Dedicated Desk", count: 20, price: "$300/mo", features: ["Fixed Seat", "Locker", "Meeting Credits"], icon: "🖥️" },
    { id: 4, name: "Meeting Room", count: 8, price: "$50/hr", features: ["AV Gear", "Whiteboard", "Catering"], icon: "🤝" },
    { id: 5, name: "Event Hall", count: 2, price: "$200/hr", features: ["Sound System", "Stage", "Projector"], icon: "🎉" },
    { id: 6, name: "Podcast Studio", count: 1, price: "$80/hr", features: ["Soundproof", "Mics", "Editing PC"], icon: "🎙️" },
];

export default function WorkspaceTypesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);

    const filteredTypes = workspaceTypes.filter(type =>
        type.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">Workspace Types</h1>
                    <p className="text-muted-foreground">Define different categories of resources available.</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> Add Workspace Type
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add Workspace Type</DialogTitle>
                            <DialogDescription>
                                Define a new category of workspace (e.g., Phone Booth).
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="t-name" className="text-right">
                                    Name
                                </Label>
                                <Input id="t-name" placeholder="e.g. Phone Booth" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="t-price" className="text-right">
                                    Base Price
                                </Label>
                                <Input id="t-price" placeholder="$0.00" className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={() => setIsAddOpen(false)}>Create Type</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center gap-2 bg-card p-4 rounded-lg border shadow-sm">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Search types..."
                    className="border-none shadow-none focus-visible:ring-0 flex-1 bg-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredTypes.map((type) => (
                    <Card key={type.id} className="group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className="text-4xl mb-2">{type.icon}</div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </div>
                            <CardTitle className="text-lg">{type.name}</CardTitle>
                            <CardDescription>{type.count} Units Available</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-3">
                            <div className="text-sm font-semibold mb-2">{type.price}</div>
                            <div className="flex flex-wrap gap-1">
                                {type.features.map((f, i) => (
                                    <span key={i} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">
                                        {f}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2 border-t bg-muted/20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                            <Button variant="ghost" size="sm" className="h-8 text-xs">Edit</Button>
                            <Button variant="ghost" size="sm" className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50">Delete</Button>
                        </CardFooter>
                    </Card>
                ))}
                {filteredTypes.length === 0 && (
                    <div className="col-span-full p-12 text-center text-muted-foreground">
                        No types found.
                    </div>
                )}
            </div>
        </div>
    );
}
