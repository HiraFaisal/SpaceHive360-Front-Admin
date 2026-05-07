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
        <div className="flex flex-col items-center gap-1 text-center mb-4">
          <h1 className="text-4xl font-bold tracking-tight text-primary">Application Status</h1>
          <p className="text-muted-foreground text-sm text-balance max-w-sm">
            Track your journey with SpaceHive360. Enter your business email below.
          </p>
        </div>

        <form onSubmit={handleCheckStatus} className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="admin@creativehub.com"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 text-base shadow-sm"
            />
          </div>
          <Button type="submit" disabled={loading} size="icon" className="h-12 w-12 shrink-0 shadow-lg shadow-primary/20 transition-all active:scale-95">
            {loading ? <Loader2 className="animate-spin size-5" /> : <Search className="size-5" />}
          </Button>
        </form>

        {error && (
          <div className="p-4 rounded-xl bg-destructive/5 text-destructive text-sm text-center border border-destructive/10 animate-in fade-in slide-in-from-top-1 duration-200">
            {error}
          </div>
        )}

        {statusData && (
          <div className="p-6 rounded-2xl border bg-card/50 backdrop-blur-sm text-card-foreground shadow-xl shadow-primary/5 animate-fade-in-up">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary shadow-inner">
                  <Building2 size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-xl tracking-tight leading-none">{statusData.name}</h3>
                  <p className="text-xs font-semibold text-muted-foreground mt-2 uppercase tracking-widest">Business Account</p>
                </div>
              </div>
              <Badge className={cn("px-4 py-1.5 text-xs font-bold rounded-full shadow-sm", statusColors[statusData.registrationStatus as keyof typeof statusColors] || "")}>
                {statusData.registrationStatus}
              </Badge>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-sm bg-muted/30 p-3 rounded-lg">
                <Calendar className="size-4 text-primary" />
                <span className="text-muted-foreground">Application Date:</span>
                <span className="font-bold ml-auto">{new Date(statusData.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
              </div>

              {statusData.adminComments && (
                <div className="mt-6 p-5 rounded-xl bg-primary/[0.03] border border-primary/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/40" />
                  <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em]">
                    <MessageSquare size={12} />
                    Official Feedback
                  </div>
                  <p className="text-sm italic text-foreground/80 leading-relaxed">&ldquo;{statusData.adminComments}&rdquo;</p>
                </div>
              )}
            </div>

            {statusData.registrationStatus === "Approved" && (
              <Button asChild className="w-full mt-8 h-12 text-base font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Link href="/login">Proceed to Dashboard</Link>
              </Button>
            )}
          </div>
        )}

        <div className="text-center pt-6 mt-2 border-t border-primary/10">
          <Button variant="ghost" asChild className="text-muted-foreground hover:text-primary hover:bg-primary/5 font-medium">
            <Link href="/register">
              <ChevronLeft className="mr-2 size-4" /> Back to Registration
            </Link>
          </Button>
        </div>
      </FieldGroup>
    </div>
  );
}
