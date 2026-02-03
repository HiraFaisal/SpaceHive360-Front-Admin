"use client";

import { useState } from "react";
import {
  DollarSign,
  CreditCard,
  AlertCircle,
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Send,
  CheckCircle2,
  Clock
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { CreateInvoiceDialog } from "@/components/payments/create-invoice-dialog";
import { NtpSettings } from "@/components/payments/ntp-settings";
import { cn } from "@/lib/utils";

// Mock Invoice Data
const mockInvoices = [
  { id: "INV-2024-001", user: "Alice Smith", date: "Oct 24, 2024", amount: "$550.00", status: "Paid", items: "Private Office (Pro-rata)" },
  { id: "INV-2024-002", user: "Bob Jones", date: "Oct 25, 2024", amount: "$150.00", status: "Pending", items: "Hot Desk Monthly" },
  { id: "INV-2024-003", user: "Charlie Brown", date: "Oct 26, 2024", amount: "$50.00", status: "Overdue", items: "Meeting Room (2hr)" },
  { id: "INV-2024-004", user: "Diana Prince", date: "Oct 27, 2024", amount: "$1200.00", status: "Pending", items: "Event Hall Deposit" },
  { id: "INV-2024-005", user: "Evan Wright", date: "Oct 20, 2024", amount: "$300.00", status: "Paid", items: "Dedicated Desk" },
];

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState("invoices");

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Payments & Billing</h1>
          <p className="text-muted-foreground">Manage invoices, billing settings, and automated notices.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Export Report</Button>
          <CreateInvoiceDialog />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,350.00</div>
            <p className="text-xs text-muted-foreground">12 invoices pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">$50.00</div>
            <p className="text-xs text-muted-foreground">1 invoice requires attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="ntp">NTP Management</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* INVOICES TAB */}
        <TabsContent value="invoices" className="space-y-4">
          <div className="flex items-center gap-2 bg-card p-1 rounded-md border text-muted-foreground px-3 w-full sm:w-auto">
            <Search className="h-4 w-4" />
            <input className="bg-transparent border-none focus:outline-none text-sm w-full sm:w-64" placeholder="Search invoices..." />
            <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[50px]"><Checkbox /></TableHead>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInvoices.map((inv) => (
                  <TableRow key={inv.id} className="group">
                    <TableCell><Checkbox /></TableCell>
                    <TableCell className="font-medium">{inv.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{inv.user}</span>
                        <span className="text-xs text-muted-foreground">{inv.items}</span>
                      </div>
                    </TableCell>
                    <TableCell>{inv.amount}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                        inv.status === 'Paid' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                          inv.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' :
                            'bg-red-50 text-red-700 ring-red-600/20'
                      )}>
                        {inv.status === 'Paid' && <CheckCircle2 className="h-3 w-3" />}
                        {inv.status === 'Pending' && <Clock className="h-3 w-3" />}
                        {inv.status === 'Overdue' && <AlertCircle className="h-3 w-3" />}
                        {inv.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{inv.date}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem><Download className="h-4 w-4 mr-2" /> Download PDF</DropdownMenuItem>
                          <DropdownMenuItem><Send className="h-4 w-4 mr-2" /> Resend NTP</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Void Invoice</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* NTP MANAGEMENT TAB */}
        <TabsContent value="ntp" className="space-y-4">
          <div className="flex flex-col gap-2 mb-4">
            <h2 className="text-lg font-semibold">Automated Notices</h2>
            <p className="text-sm text-muted-foreground">Configure when and how "Notice to Pay" reminders are sent to members.</p>
          </div>
          <NtpSettings />
        </TabsContent>

        {/* SETTINGS TAB */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax & Currency Settings</CardTitle>
              <CardDescription>Manage global billing preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>Default Currency: USD ($)</p>
              <p>Tax Rate: 10% (VAT)</p>
              <p>Use Sequential Invoice Numbering: Yes</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div >
  );
}
