"use client";

import { useState } from "react";
import { Plus, Trash2, Calculator } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";

export function CreateInvoiceDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [items, setItems] = useState([{ description: "", quantity: 1, price: 0 }]); // Using simple state for items

    const addItem = () => {
        setItems([...items, { description: "", quantity: 1, price: 0 }]);
    };

    const removeItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        // @ts-ignore
        newItems[index][field] = value;
        setItems(newItems);
    };

    const calculateTotal = () => {
        return items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsOpen(false);
        // Mock API call
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Create Invoice
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Generate New Invoice</DialogTitle>
                    <DialogDescription>
                        Create an invoice for a member.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="member">Member</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select member" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Alice Smith</SelectItem>
                                    <SelectItem value="2">Bob Jones</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Select defaultValue="USD">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USD">USD ($)</SelectItem>
                                    <SelectItem value="EUR">EUR (€)</SelectItem>
                                    <SelectItem value="GBP">GBP (£)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Line Items</Label>
                            <Button type="button" variant="ghost" size="sm" onClick={addItem} className="h-8 text-xs">
                                <Plus className="h-3 w-3 mr-1" /> Add Item
                            </Button>
                        </div>
                        {items.map((item, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 items-end">
                                <div className="col-span-6 grid gap-1">
                                    <Label className="text-xs text-muted-foreground">Description</Label>
                                    <Input
                                        placeholder="Item description"
                                        value={item.description}
                                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                                    />
                                </div>
                                <div className="col-span-2 grid gap-1">
                                    <Label className="text-xs text-muted-foreground">Qty</Label>
                                    <Input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="col-span-3 grid gap-1">
                                    <Label className="text-xs text-muted-foreground">Price</Label>
                                    <Input
                                        type="number"
                                        value={item.price}
                                        onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
                                    />
                                </div>
                                <div className="col-span-1 pb-1">
                                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:bg-destructive/10" onClick={() => removeItem(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div className="grid gap-2">
                            <Label>Notes</Label>
                            <Textarea placeholder="Add a note to this invoice..." />
                        </div>
                        <div className="flex flex-col gap-2 justify-end items-end text-sm">
                            <div className="flex justify-between w-full">
                                <span className="text-muted-foreground">Subtotal:</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between w-full">
                                <span className="text-muted-foreground">Tax (10%):</span>
                                <span>${(calculateTotal() * 0.1).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between w-full font-bold text-lg pt-2 border-t">
                                <span>Total:</span>
                                <span>${(calculateTotal() * 1.1).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                </form>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button type="submit" onClick={handleSubmit}>Generate Invoice</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
