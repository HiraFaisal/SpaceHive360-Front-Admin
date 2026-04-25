"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Share2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const TABS = ["All Posts", "Announcements", "Collaboration", "Introductions"];

const POSTS = [
  {
    id: 1,
    author: {
      name: "Sarah Chen",
      role: "Startup Founder",
      location: "Downtown Hub",
      initials: "SC",
    },
    time: "2 hours ago",
    content: "Just launched our new beta! Looking for feedback from the SpaceHive community on our latest dashboard UI. If anyone has 5 mins for a coffee chat, I'd love to show you what we're building. 🚀",
    tag: "ANNOUNCEMENT",
    tagColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    hasImage: true,
    likes: 24,
    comments: 12,
  },
  {
    id: 2,
    author: {
      name: "Marcus Thorne",
      role: "Fullstack Dev",
      location: "Northside Collective",
      initials: "MT",
    },
    time: "5 hours ago",
    content: "Seeking a designer for a weekend hackathon project. We're building a community-driven sustainability tracker. If you're passionate about ESG and love React, let's talk!",
    tag: "COLLAB REQUEST",
    tagColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    action: "Apply to Collab",
    likes: 8,
    comments: 5,
  },
];

export function CommunityFeed() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab, i) => (
          <Button
            key={tab}
            variant={i === activeTab ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(i)}
            className={cn(
              "rounded-full h-9 px-4 text-sm font-medium transition-all",
              i === activeTab
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                : "bg-background text-muted-foreground hover:text-foreground hover:bg-muted border-border"
            )}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {POSTS.map((post) => (
          <Card
            key={post.id}
            className="border border-border/50 shadow-sm bg-card hover:shadow-md transition-shadow rounded-2xl overflow-hidden"
          >
            <CardHeader className="p-6 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {post.author.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-foreground">{post.author.name}</h4>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 border",
                          post.tagColor
                        )}
                      >
                        {post.tag}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {post.author.role} • {post.author.location} • {post.time}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="px-6 pb-6 space-y-4">
              <p className="text-sm leading-relaxed text-foreground/90">{post.content}</p>

              {post.hasImage && (
                <div className="rounded-xl overflow-hidden border border-border/50 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 aspect-video flex items-center justify-center relative">
                  {/* Placeholder Dashboard Preview */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 to-emerald-600/20" />
                  <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-3 w-20 bg-emerald-500/30 rounded-full" />
                        <div className="h-3 w-12 bg-emerald-500/20 rounded-full" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-muted rounded-full" />
                        <div className="h-2 w-5/6 bg-muted rounded-full" />
                        <div className="h-2 w-4/6 bg-muted rounded-full" />
                        <div className="h-2 w-3/6 bg-muted rounded-full" />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <div className="h-3 w-3 rounded-full bg-emerald-500" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="h-2 w-3/4 bg-muted rounded-full" />
                          <div className="h-2 w-1/2 bg-muted/70 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <div className="flex items-center gap-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto px-0 text-muted-foreground hover:text-blue-600 hover:bg-transparent gap-1.5"
                  >
                    <Heart className="h-4 w-4" />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto px-0 text-muted-foreground hover:text-blue-600 hover:bg-transparent gap-1.5"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto px-0 text-muted-foreground hover:text-blue-600 hover:bg-transparent gap-1.5"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Share</span>
                  </Button>
                </div>
                {post.action && (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto px-0 text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    {post.action}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
