"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Share2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { communityApi } from "@/lib/api/community";

const TABS = ["All Posts", "Announcements", "Collab Request", "Introductions"];

export function CommunityFeed() {
  const [activeTab, setActiveTab] = useState(0);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [commentsData, setCommentsData] = useState<Record<string, any[]>>({});
  const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>({});

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") || "";

  const fetchPosts = async (tag?: string) => {
    setLoading(true);
    try {
      const res = await communityApi.getPosts(tag);
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const tag = activeTab === 0 ? undefined : TABS[activeTab];
    fetchPosts(tag);
  }, [activeTab]);

  const toggleComments = async (postId: string) => {
    const isExpanded = expandedComments.includes(postId);
    if (isExpanded) {
      setExpandedComments(prev => prev.filter(id => id !== postId));
    } else {
      setExpandedComments(prev => [...prev, postId]);
      if (!commentsData[postId]) {
        setLoadingComments(prev => ({ ...prev, [postId]: true }));
        try {
          const res = await communityApi.getComments(postId);
          setCommentsData(prev => ({ ...prev, [postId]: res.data }));
        } catch (err) {
          console.error("Failed to fetch comments:", err);
        } finally {
          setLoadingComments(prev => ({ ...prev, [postId]: false }));
        }
      }
    }
  };

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
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No posts found in this category.</div>
        ) : (
          posts.map((post) => (
            <Card
              key={post.recId}
              className="border border-border/50 shadow-sm bg-card hover:shadow-md transition-shadow rounded-2xl overflow-hidden"
            >
              <CardHeader className="p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {post.authorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-foreground">{post.authorName}</h4>
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
                        {post.authorRole} • {post.authorLocation} • {new Date(post.createdAt).toLocaleDateString()}
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

                {post.hasImage && post.imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-border/50 bg-muted aspect-video flex items-center justify-center relative">
                    <img 
                      src={post.imageUrl.startsWith("http") ? post.imageUrl : `${API_BASE_URL}${post.imageUrl}`} 
                      alt="Post content" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}

                {/* Actions (Admin Read-Only) */}
                <div className="flex flex-col gap-4 pt-2 border-t border-border/40">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm font-medium">{post.likesCount} Likes</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleComments(post.recId)}
                      className="h-auto px-0 text-muted-foreground hover:text-primary hover:bg-transparent gap-1.5"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-sm font-medium">{post.commentsCount} Comments</span>
                    </Button>
                  </div>

                  {/* Comments Section */}
                  {expandedComments.includes(post.recId) && (
                    <div className="bg-muted/30 rounded-xl p-4 space-y-4">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Discussion</h5>
                      {loadingComments[post.recId] ? (
                        <div className="text-xs text-center py-2">Loading discussion...</div>
                      ) : (commentsData[post.recId]?.length || 0) === 0 ? (
                        <div className="text-xs text-center py-2 text-muted-foreground">No comments yet.</div>
                      ) : (
                        <div className="space-y-4">
                          {commentsData[post.recId].map((comment: any) => (
                            <div key={comment.recId} className="flex gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-[10px] bg-primary/5">{comment.memberInitials}</AvatarFallback>
                              </Avatar>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold">{comment.memberName}</span>
                                  <span className="text-[10px] text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-xs text-foreground/80 leading-relaxed">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
