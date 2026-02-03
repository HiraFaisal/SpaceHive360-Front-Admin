"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock, User, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Mock Resources
const resources = [
    { id: "1", name: "Alpha Conference Room" },
    { id: "2", name: "Beta Hot Desk Area" },
    { id: "3", name: "Gamma Private Office" },
];

export function NewBookingDialog() {
    const [date, setDate] = useState<Date>();
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would submit to API
        setIsOpen(false);
        // Trigger a refresh/toast in parent
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <CalendarIcon className="h-4 w-4" /> New Booking
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Booking</DialogTitle>
                    <DialogDescription>
                        Book a resource for a member.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">

                    {/* Resource Selection */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="resource" className="text-right">Resource</Label>
                        <div className="col-span-3">
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select resource" />
                                </SelectTrigger>
                                <SelectContent>
                                    {resources.map(r => (
                                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* User Name */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="user" className="text-right">Member</Label>
                        <div className="col-span-3 relative">
                            <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input id="user" placeholder="John Doe" className="pl-9" />
                        </div>
                    </div>

                    {/* Date Picker */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Date</Label>
                        <div className="col-span-3">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Time Selection */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Time</Label>
                        <div className="col-span-3 flex gap-2">
                            <div className="relative flex-1">
                                <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input type="time" className="pl-9" />
                            </div>
                            <span className="flex items-center text-sm text-muted-foreground">to</span>
                            <div className="relative flex-1">
                                <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input type="time" className="pl-9" />
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right">Notes</Label>
                        <Input id="notes" placeholder="Optional notes" className="col-span-3" />
                    </div>

                </form>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button type="submit" onClick={handleSubmit}>Create Booking</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
