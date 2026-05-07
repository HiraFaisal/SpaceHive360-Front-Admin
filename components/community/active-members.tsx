"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { communityApi } from "@/lib/api/community";

export function ActiveMembers() {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    communityApi.getActiveMembers().then(res => setMembers(res.data));
  }, []);
  return (
    <Card className="border border-border/50 shadow-sm bg-card rounded-2xl">
      <CardHeader className="pb-4 pt-5 px-6">
        <CardTitle className="text-base font-bold tracking-tight">Active Members</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="flex items-center -space-x-3">
          {members.map((member, i) => (
            <div key={i} className="relative">
              <Avatar className="inline-block h-11 w-11 ring-2 ring-background border border-border/50 transition-transform hover:scale-110 hover:z-10 cursor-pointer">
                <AvatarFallback className="bg-muted text-xs font-semibold">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              {member.online && (
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background" />
              )}
            </div>
          ))}
          <button className="flex h-11 w-11 items-center justify-center rounded-full ring-2 ring-background bg-muted hover:bg-muted/80 border-2 border-dashed border-border hover:border-primary/50 transition-all cursor-pointer group">
            <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
