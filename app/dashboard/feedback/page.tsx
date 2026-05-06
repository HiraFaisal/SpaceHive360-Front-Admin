"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  MessageSquare, 
  Star, 
  Filter, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Building2, 
  Layers, 
  Calendar,
  Sparkles,
  MoreVertical,
  ThumbsUp,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getFeedbacks, getLocationSummary, summarizeReviews, type Feedback, type LocationSentimentSummary } from "@/lib/api/feedback";
import { getLocations, type Location } from "@/lib/api/locations";
import { getWorkspaces } from "@/lib/api/workspaces";
import { toast } from "sonner";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Loader2, 
  TrendingDown, 
  TrendingUp, 
  BarChart3,
  Lightbulb
} from "lucide-react";

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | "all">("all");
  const [activeTab, setActiveTab] = useState("all");

  // AI Summary States
  const [isAiSheetOpen, setIsAiSheetOpen] = useState(false);
  const [selectedLocId, setSelectedLocId] = useState<string>("");
  const [locSummary, setLocSummary] = useState<LocationSentimentSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const handleFetchSummary = async (locationId: string) => {
    if (!locationId) return;
    setLoadingSummary(true);
    try {
      // 1. Get the base summary and feedbacks from backend
      const summary = await getLocationSummary(locationId);
      
      // 2. Get the actual feedback comments for this location
      const locationFeedbacks = feedbacks.filter(f => f.fkLocation === locationId && f.comments);
      const comments = locationFeedbacks.map(f => f.comments).slice(0, 10);
      
      if (comments.length > 0) {
        // 3. Call AI Summarizer directly from Frontend
        try {
          const aiText = await summarizeReviews(comments);
          summary.aiSummary = aiText;
        } catch (aiErr) {
          console.error("AI Summarization failed:", aiErr);
          // Keep the backend placeholder if AI fails
        }
      }

      setLocSummary(summary);
    } catch (err) {
      console.error("Error fetching AI summary:", err);
      toast.error("Failed to generate AI summary");
    } finally {
      setLoadingSummary(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [fbData, locData] = await Promise.all([
        getFeedbacks(),
        getLocations()
      ]);
      setFeedbacks(fbData || []);
      setLocations(locData || []);
    } catch (err) {
      console.error("Error loading feedback:", err);
      toast.error("Failed to load feedback data");
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(fb => {
      const matchesSearch = 
        fb.comments.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fb.locationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fb.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fb.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRating = selectedRating === "all" || fb.rating === selectedRating;
      
      return matchesSearch && matchesRating;
    });
  }, [feedbacks, searchTerm, selectedRating]);

  // Group by Location/Workspace
  const groupedFeedback = useMemo(() => {
    const groups: Record<string, Record<string, Feedback[]>> = {};
    
    filteredFeedbacks.forEach(fb => {
      const loc = fb.locationName || "Unassigned";
      const plan = fb.category || "General";
      
      if (!groups[loc]) groups[loc] = {};
      if (!groups[loc][plan]) groups[loc][plan] = [];
      
      groups[loc][plan].push(fb);
    });
    
    return groups;
  }, [filteredFeedbacks]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <MotionWrapper delay={0.1}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Member Feedback
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage and analyze feedback from your community members across all locations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="gap-2 border-primary/20 hover:bg-primary/5 transition-all group"
              onClick={() => setIsAiSheetOpen(true)}
            >
              <Sparkles className="size-4 text-primary group-hover:animate-pulse" />
              <span>AI Review Summarizer</span>
            </Button>
          </div>
        </div>
      </MotionWrapper>

      {/* Stats & Filters Bar */}
      <MotionWrapper delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 p-2 opacity-5">
                    <Star className="size-16 -rotate-12" />
                </div>
                <CardContent className="p-6">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Average Rating</span>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">
                                {feedbacks.length > 0 
                                  ? (feedbacks.reduce((acc, fb) => acc + (fb.rating || 0), 0) / feedbacks.length).toFixed(1)
                                  : "0.0"}
                            </span>
                            <div className="flex">
                                {[1,2,3,4,5].map(i => (
                                    <Star key={i} className={cn("size-3", i <= Math.round(feedbacks.reduce((acc, fb) => acc + (fb.rating || 0), 0) / feedbacks.length) ? "fill-primary text-primary" : "text-muted-foreground/30")} />
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Reviews</span>
                        <span className="text-2xl font-bold">{feedbacks.length}</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="md:col-span-2 bg-card border-none shadow-none flex items-center p-0">
                <div className="flex items-center gap-2 bg-card p-3 rounded-xl border border-primary/10 shadow-sm w-full">
                    <Search className="h-4 w-4 text-muted-foreground ml-2" />
                    <Input 
                        placeholder="Search feedback, members, or locations..." 
                        className="border-none shadow-none focus-visible:ring-0 flex-1 bg-transparent text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 gap-2 px-3 text-xs">
                                <Filter className="size-3" />
                                {selectedRating === "all" ? "Rating" : `${selectedRating} Stars`}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem onClick={() => setSelectedRating("all")}>All Ratings</DropdownMenuItem>
                            {[5, 4, 3, 2, 1].map(r => (
                                <DropdownMenuItem key={r} onClick={() => setSelectedRating(r)} className="gap-2">
                                    <div className="flex gap-0.5">
                                        {Array.from({length: r}).map((_, i) => <Star key={i} className="size-3 fill-primary text-primary" />)}
                                    </div>
                                    <span>{r} Stars</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </Card>
        </div>
      </MotionWrapper>

      {/* AI Analysis Sheet */}
      <Sheet open={isAiSheetOpen} onOpenChange={setIsAiSheetOpen}>
        <SheetContent className="w-full sm:max-w-md lg:max-w-lg overflow-y-auto overflow-x-hidden p-0 border-l border-border/50">
          <div className="h-full flex flex-col pt-6 pb-2 px-6">
            <SheetHeader className="pb-6 border-b mb-6 text-left relative">
              <div className="flex justify-between items-start pr-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Sparkles className="size-5 text-primary" />
                    </div>
                    <SheetTitle className="text-2xl font-semibold tracking-tight">AI Feedback Analysis</SheetTitle>
                  </div>
                  <SheetDescription>
                    Get intelligent insights and summaries from member reviews.
                  </SheetDescription>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Select Location</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between rounded-xl border-primary/10 bg-background/50 h-11">
                      <div className="flex items-center gap-2">
                        <Building2 className="size-4 text-muted-foreground" />
                        <span className="truncate">{selectedLocId ? locations.find(l => l.recId === selectedLocId)?.name : "Choose a location..."}</span>
                      </div>
                      <ChevronDown className="size-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[340px] rounded-xl">
                    {locations.map(loc => (
                      <DropdownMenuItem 
                        key={loc.recId} 
                        onClick={() => {
                          setSelectedLocId(loc.recId);
                          handleFetchSummary(loc.recId);
                        }}
                      >
                        {loc.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </SheetHeader>

            <div className="flex-1 pb-8 overflow-y-auto pr-1">
              <div className="mt-2 space-y-8">
                {loadingSummary ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="relative">
                      <div className="size-12 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
                      <Sparkles className="size-4 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">Analyzing feedback patterns...</p>
                  </div>
                ) : locSummary ? (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Summary Card */}
                    <Card className="bg-primary/5 border-primary/10 rounded-2xl overflow-hidden shadow-none">
                      <CardHeader className="pb-3 border-b border-primary/5">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                          <Lightbulb className="size-4 text-primary" />
                          AI Executive Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm text-foreground/80 leading-relaxed italic">
                          "{locSummary?.aiSummary}"
                        </p>
                      </CardContent>
                    </Card>

                    {/* Sentiment Breakdown */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1 flex items-center gap-2">
                        <BarChart3 className="size-3.5" />
                        Sentiment Distribution
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-5 text-center space-y-2">
                          <CheckCircle2 className="size-6 text-green-500 mx-auto" />
                          <div className="text-3xl font-bold text-green-600">{(locSummary?.positivePercentage ?? 0).toFixed(0)}%</div>
                          <div className="text-[10px] font-bold text-green-600/70 uppercase tracking-widest">Positive</div>
                        </div>
                        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-5 text-center space-y-2">
                          <AlertCircle className="size-6 text-red-500 mx-auto" />
                          <div className="text-3xl font-bold text-red-600">{(locSummary?.negativePercentage ?? 0).toFixed(0)}%</div>
                          <div className="text-[10px] font-bold text-red-600/70 uppercase tracking-widest">Negative</div>
                        </div>
                      </div>
                    </div>

                    {/* Performance Indicator */}
                    <Card className="bg-card border border-primary/10 rounded-2xl p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Overall Satisfaction</p>
                          <p className="text-3xl font-bold">{(locSummary?.positivePercentage ?? 0).toFixed(0)}%</p>
                        </div>
                        <div className={cn(
                          "size-14 rounded-2xl flex items-center justify-center shadow-inner",
                          (locSummary?.positivePercentage ?? 0) >= 70 ? "bg-green-500/10 text-green-500" :
                          (locSummary?.positivePercentage ?? 0) >= 40 ? "bg-blue-500/10 text-blue-500" : "bg-red-500/10 text-red-500"
                        )}>
                          {(locSummary?.positivePercentage ?? 0) >= 70 ? <TrendingUp className="size-7" /> : <TrendingDown className="size-7" />}
                        </div>
                      </div>
                      <div className="w-full bg-primary/5 h-3 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-1000",
                            (locSummary?.positivePercentage ?? 0) >= 70 ? "bg-green-500" :
                            (locSummary?.positivePercentage ?? 0) >= 40 ? "bg-blue-500" : "bg-red-500"
                          )}
                          style={{ width: `${locSummary?.positivePercentage}%` }}
                        />
                      </div>
                      <p className="mt-4 text-[11px] text-muted-foreground text-center font-medium">
                        Based on {locSummary?.totalReviews} member reviews for this location.
                      </p>
                    </Card>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center px-6 space-y-6">
                    <div className="size-20 rounded-full bg-muted/20 flex items-center justify-center">
                      <Sparkles className="size-10 text-muted-foreground/20" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-foreground">No Location Selected</p>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-[240px] mx-auto">
                        Select a location above to generate an AI-powered summary and sentiment analysis of member feedback.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="space-y-6">
        {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[1,2,3].map(i => <Skeleton key={i} className="h-[300px] w-full rounded-2xl" />)}
            </div>
        ) : filteredFeedbacks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-card/30 backdrop-blur-sm rounded-3xl border border-dashed border-primary/10 text-center px-6">
                <div className="size-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                    <MessageSquare className="size-10 text-primary/30" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">No Feedback Found</h3>
                <p className="text-muted-foreground mt-2 text-sm max-w-sm mx-auto leading-relaxed">
                    We couldn't find any feedback matching your current filters. Try adjusting your search or rating criteria.
                </p>
                <Button 
                    variant="outline" 
                    onClick={() => {setSearchTerm(""); setSelectedRating("all");}} 
                    className="mt-8 rounded-xl px-8"
                >
                    Clear All Filters
                </Button>
            </div>
        ) : (
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <div className="flex items-center justify-between mb-6">
                    <TabsList className="bg-card/50 p-1 border border-primary/5 rounded-xl">
                        <TabsTrigger value="all" className="rounded-lg px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                            All Feedback
                        </TabsTrigger>
                        <TabsTrigger value="grouped" className="rounded-lg px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                            By Location
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="all" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFeedbacks.map((fb, idx) => (
                            <FeedbackCard key={fb.recId} feedback={fb} delay={idx * 0.05} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="grouped" className="mt-0 space-y-12">
                    {Object.entries(groupedFeedback).map(([location, plans], locIdx) => (
                        <div key={location} className="space-y-6">
                            <div className="flex items-center gap-3 border-l-4 border-primary pl-4 py-1">
                                <Building2 className="size-6 text-primary" />
                                <h2 className="text-2xl font-bold tracking-tight">{location}</h2>
                                <div className="flex items-center gap-2 ml-2">
                                    <Badge variant="secondary" className="bg-primary/5 text-primary border-none rounded-full px-3">
                                        {Object.values(plans).flat().length} Reviews
                                    </Badge>
                                    {Object.values(plans).flat().length > 0 && (
                                        <Badge variant="outline" className={cn(
                                            "rounded-full px-3 border-none font-bold",
                                            (Object.values(plans).flat().filter(fb => fb.sentiment?.toLowerCase() === 'positive').length / Object.values(plans).flat().length) >= 0.7 
                                                ? "bg-green-500/10 text-green-500" 
                                                : "bg-red-500/10 text-red-500"
                                        )}>
                                            {((Object.values(plans).flat().filter(fb => fb.sentiment?.toLowerCase() === 'positive').length / Object.values(plans).flat().length) * 100).toFixed(0)}% Satisfaction
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-8">
                                {Object.entries(plans).map(([plan, entries]) => (
                                    <div key={plan} className="space-y-4">
                                        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground/60 uppercase tracking-widest pl-2">
                                            <Layers className="size-4" />
                                            <span>{plan}</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {entries.map((fb, idx) => (
                                                <FeedbackCard key={fb.recId} feedback={fb} delay={idx * 0.05} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </TabsContent>
            </Tabs>
        )}
      </div>
    </div>
  );
}

function FeedbackCard({ feedback, delay }: { feedback: Feedback; delay: number }) {
  return (
    <MotionWrapper delay={delay}>
      <Card className="group h-full flex flex-col bg-card border-primary/5 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 rounded-2xl overflow-hidden">
        <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/10">
                        {feedback.memberName?.substring(0, 2).toUpperCase() || "ME"}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold truncate max-w-[140px]">{feedback.memberName || "Anonymous Member"}</span>
                        <span className="text-[10px] text-muted-foreground">{format(new Date(feedback.createdAt), "MMM dd, yyyy")}</span>
                    </div>
                </div>
                <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                        <Star key={i} className={cn("size-3", i <= (feedback.rating || 0) ? "fill-primary text-primary" : "text-muted-foreground/20")} />
                    ))}
                </div>
            </div>
        </CardHeader>
        
        <CardContent className="flex-1 pb-6">
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/5 border-none text-[10px] py-0 px-2 rounded-lg text-primary font-bold">
                        {feedback.category || "Hot Desk"}
                    </Badge>
                    {feedback.sentiment && (
                        <Badge 
                            variant="outline" 
                            className={cn(
                                "text-[10px] py-0 px-2 rounded-lg font-bold border-none",
                                feedback.sentiment.toLowerCase() === 'positive' ? "bg-green-500/10 text-green-500" :
                                feedback.sentiment.toLowerCase() === 'negative' ? "bg-red-500/10 text-red-500" :
                                "bg-blue-500/10 text-blue-500"
                            )}
                        >
                            {feedback.sentiment}
                            {feedback.sentimentScore && ` (${(feedback.sentimentScore * 100).toFixed(0)}%)`}
                        </Badge>
                    )}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed italic line-clamp-4">
                    "{feedback.comments}"
                </p>
            </div>
        </CardContent>

        <CardFooter className="pt-0 pb-6 px-6">
            <div className="w-full flex items-center justify-between border-t border-primary/5 pt-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="size-3" />
                    <span className="text-[10px] font-medium">{feedback.locationName}</span>
                </div>
                <div className="flex items-center gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="text-muted-foreground hover:text-foreground">
                                <MoreVertical className="size-3.5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem className="text-xs">Flag for Review</DropdownMenuItem>
                            <DropdownMenuItem className="text-xs">Mark as Private</DropdownMenuItem>
                            <DropdownMenuItem className="text-xs text-destructive">Archive</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </CardFooter>
      </Card>
    </MotionWrapper>
  );
}
