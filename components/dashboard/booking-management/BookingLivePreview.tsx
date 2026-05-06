"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  MapPin, 
  Users,
  ShieldCheck,
  CreditCard
} from "lucide-react";
import { BookingData } from "@/app/dashboard/booking-management/page";

interface BookingLivePreviewProps {
  data: BookingData;
  workspaces: any[];
}

export function BookingLivePreview({ data, workspaces }: BookingLivePreviewProps) {
  const selectedWorkspace = workspaces.find(w => w.recId === data.fkWorkspace);

  return (
    <div className="sticky top-6">
      <Card className="border-border/10 bg-card overflow-hidden shadow-xl ring-1 ring-primary/5">
        <div className="h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-background flex items-center justify-center border-b border-border/5">
          <div className="text-center">
            <Badge variant="outline" className="mb-2 bg-background/50 backdrop-blur-sm border-primary/20 text-primary">
              Live Preview
            </Badge>
            <h3 className="text-xl font-bold tracking-tight text-foreground/90">
              {data.name || "Untitled Plan"}
            </h3>
          </div>
        </div>
        
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/20 p-3 rounded-xl border border-border/5">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold opacity-70">Workspace</p>
                <p className="text-foreground font-medium">{selectedWorkspace?.name || "No workspace selected"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/20 p-3 rounded-xl border border-border/5">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold opacity-70">Hours</p>
                  <p className="text-foreground font-medium">{data.startTime} - {data.endTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/20 p-3 rounded-xl border border-border/5">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold opacity-70">Price</p>
                  <p className="text-foreground font-medium">${data.price} / {data.priceType}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Availability</h4>
            <div className="flex flex-wrap gap-1.5">
              {data.availableDays.map(day => (
                <Badge key={day} variant="secondary" className="bg-primary/5 text-primary border-none py-1">
                  {day.substring(0, 3)}
                </Badge>
              ))}
              {data.availableDays.length === 0 && (
                <span className="text-xs italic text-muted-foreground">No days selected</span>
              )}
            </div>
          </div>

          {(data.features || []).length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Included Features</h4>
              <div className="flex flex-wrap gap-2">
                {data.features?.map((feature, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-foreground/80 bg-muted/40 px-2.5 py-1.5 rounded-lg border border-border/5">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(data.images || []).length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Photos</h4>
              <div className="grid grid-cols-3 gap-2">
                {data.images?.map((img, i) => {
                  const getImageUrl = (image: any) => {
                    if (image instanceof File) return URL.createObjectURL(image);
                    if (typeof image === "string") {
                      if (image.startsWith("http")) return image;
                      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "";
                      return `${baseUrl}${image}`;
                    }
                    return "";
                  };
                  return (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden border border-border/10">
                      <img 
                        src={getImageUrl(img)} 
                        alt="preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Plan Rules</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className={`h-4 w-4 ${data.allowCancellation ? 'text-emerald-500' : 'text-muted-foreground/30'}`} />
                <span className={data.allowCancellation ? 'text-foreground' : 'text-muted-foreground'}>Cancellations Allowed</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className={`h-4 w-4 ${data.requiresApproval ? 'text-amber-500' : 'text-muted-foreground/30'}`} />
                <span className={data.requiresApproval ? 'text-foreground' : 'text-muted-foreground'}>Manual Approval Required</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className={`h-4 w-4 ${data.isVisible ? 'text-blue-500' : 'text-muted-foreground/30'}`} />
                <span className={data.isVisible ? 'text-foreground' : 'text-muted-foreground'}>{data.isVisible ? 'Visible to Users' : 'Hidden from Users'}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/5">
            <div className="bg-primary text-white text-center py-3 rounded-xl font-bold shadow-lg shadow-primary/20">
              Book for ${data.price}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
