"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { checkCompanyStatus } from "@/lib/api/companies";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, MessageSquare, Calendar, ChevronLeft, Building2 } from "lucide-react";
import Link from "next/link";

export function CompanyStatusCheck({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusData, setStatusData] = useState<any>(null);

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setError(null);
    setLoading(true);
    setStatusData(null);

    try {
      const response = await checkCompanyStatus(email);
      if (response.success) {
        setStatusData(response.data);
      } else {
        setError(response.message || "No registration found.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch status.");
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    "Pending": "bg-yellow-500/10 text-yellow-600 border-yellow-200",
    "Approved": "bg-green-500/10 text-green-600 border-green-200",
    "Rejected": "bg-red-500/10 text-red-600 border-red-200"
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-3xl font-bold">Check Application Status</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your business email to track your registration progress.
          </p>
        </div>

        <form onSubmit={handleCheckStatus} className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="admin@creativehub.com"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
            />
          </div>
          <Button type="submit" disabled={loading} size="icon" className="h-11 w-11 shrink-0">
            {loading ? <Loader2 className="animate-spin size-4" /> : <Search className="size-4" />}
          </Button>
        </form>

        {error && (
          <div className="p-4 rounded-lg bg-destructive/5 text-destructive text-sm text-center border border-destructive/10">
            {error}
          </div>
        )}

        {statusData && (
          <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/5 text-primary">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none">{statusData.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Application Summary</p>
                </div>
              </div>
              <Badge className={cn("px-3 py-1 text-xs", statusColors[statusData.registrationStatus as keyof typeof statusColors] || "")}>
                {statusData.registrationStatus}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Applied on:</span>
                <span className="font-medium">{new Date(statusData.createdAt).toLocaleDateString()}</span>
              </div>

              {statusData.adminComments && (
                <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-muted-foreground/10">
                  <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <MessageSquare size={12} />
                    Admin Feedback
                  </div>
                  <p className="text-sm italic">{statusData.adminComments}</p>
                </div>
              )}
            </div>

            {statusData.registrationStatus === "Approved" && (
              <Button asChild className="w-full mt-6">
                <Link href="/login">Proceed to Login</Link>
              </Button>
            )}
          </div>
        )}

        <div className="text-center pt-4 border-t">
          <Button variant="ghost" asChild className="text-muted-foreground">
            <Link href="/register">
              <ChevronLeft className="mr-2 size-4" /> Back to Registration
            </Link>
          </Button>
        </div>
      </FieldGroup>
    </div>
  );
}
