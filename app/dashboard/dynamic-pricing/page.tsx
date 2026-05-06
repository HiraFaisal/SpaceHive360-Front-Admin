"use client";

import { useState, useEffect } from "react";
import { 
    BrainCircuit, 
    TrendingUp, 
    TrendingDown, 
    CheckCircle2, 
    XCircle, 
    Info, 
    RefreshCcw,
    Sparkles,
    ShieldCheck,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAggregatedPlans, analyzePricing } from "@/lib/api/pricing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription 
} from "@/components/ui/dialog";

interface Plan {
    recId: string;
    name: string;
    price: number;
    description: string;
    type: string;
}

interface AIAnalysis {
    suggested_price: number;
    confidence_score: number;
    reasoning: string;
    demand_score: number;
    loading: boolean;
    error?: string;
}

export default function DynamicPricingPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [analyses, setAnalyses] = useState<Record<string, AIAnalysis>>({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAnalysis, setSelectedAnalysis] = useState<{plan: Plan, analysis: AIAnalysis} | null>(null);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const res = await getAggregatedPlans();
            if (res.success) {
                setPlans(res.data);
                // Trigger analysis for each plan
                res.data.forEach((plan: Plan) => {
                    performAnalysis(plan);
                });
            }
        } catch (error) {
            toast.error("Failed to load plans from database");
        } finally {
            setLoading(false);
        }
    };

    const performAnalysis = async (plan: Plan) => {
        setAnalyses(prev => ({
            ...prev,
            [plan.recId]: { suggested_price: 0, confidence_score: 0, reasoning: "", demand_score: 0, loading: true }
        }));

        try {
            const result = await analyzePricing(plan.recId, plan.price);
            setAnalyses(prev => ({
                ...prev,
                [plan.recId]: { ...result, loading: false }
            }));
        } catch (error) {
            setAnalyses(prev => ({
                ...prev,
                [plan.recId]: { suggested_price: 0, confidence_score: 0, reasoning: "", demand_score: 0, loading: false, error: "AI Service Offline" }
            }));
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const filteredPlans = plans.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-[#fcfcfd]">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100 px-2 py-0.5 rounded-md font-bold text-[10px] tracking-wider uppercase">
                            Beta AI
                        </Badge>
                        <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1c]">Dynamic Pricing</h1>
                    </div>
                    <p className="text-muted-foreground text-sm max-w-2xl">
                        Intelligent revenue optimization powered by SpaceHive 360 AI. 
                        We analyze market trends, demand patterns, and historical data to suggest the best pricing.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={fetchPlans}
                        className="h-10 gap-2 rounded-xl border-[#e4e4e7] hover:bg-white"
                    >
                        <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh Data
                    </Button>
                </div>
            </div>

            {/* Market Pulse Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-2xl border-[#e4e4e7] shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">AI Confidence</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">84.2%</div>
                        <p className="text-[10px] text-muted-foreground mt-1">Global accuracy score</p>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-[#e4e4e7] shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Market Demand</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">High</div>
                        <p className="text-[10px] text-emerald-600 mt-1">↑ 12% vs last month</p>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-[#e4e4e7] shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Opportunity</CardTitle>
                        <Sparkles className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rs. 1.2k</div>
                        <p className="text-[10px] text-muted-foreground mt-1">Potential monthly gain</p>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-[#e4e4e7] shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Managed Plans</CardTitle>
                        <BarChart3 className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{plans.length}</div>
                        <p className="text-[10px] text-muted-foreground mt-1">Active optimizations</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filter and Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search plans by name or type..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 rounded-xl border-[#e4e4e7] bg-white h-11"
                    />
                </div>
                <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-[#e4e4e7] bg-white">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>

            {/* Plans Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                    {filteredPlans.map((plan) => {
                        const analysis = analyses[plan.recId];
                        const isHigher = analysis?.suggested_price > plan.price;
                        const isLower = analysis?.suggested_price < plan.price;

                        return (
                            <motion.div
                                key={plan.recId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="group rounded-2xl border-[#e4e4e7] hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-xl bg-white overflow-hidden relative">
                                    {/* Decorative glow */}
                                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full group-hover:bg-blue-500/10 transition-colors" />
                                    
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div className="p-2.5 bg-blue-50 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                                <BrainCircuit className="h-5 w-5" />
                                            </div>
                                            <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-tighter rounded-full border-[#e4e4e7]">
                                                {plan.type}
                                            </Badge>
                                        </div>
                                        <div className="mt-4">
                                            <CardTitle className="text-lg font-bold group-hover:text-blue-600 transition-colors">
                                                {plan.name}
                                            </CardTitle>
                                            <CardDescription className="line-clamp-2 mt-1 text-xs">
                                                {plan.description || "Intelligent pricing strategy for this workspace plan."}
                                            </CardDescription>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <div className="flex items-baseline gap-2">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Current</span>
                                                <span className="text-xl font-bold text-muted-foreground line-through opacity-50">Rs. {plan.price}</span>
                                            </div>
                                            <div className="flex flex-col ml-auto text-right">
                                                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">AI Target</span>
                                                <div className="flex items-center gap-1">
                                                    {analysis?.loading ? (
                                                        <div className="h-7 w-20 bg-muted animate-pulse rounded-md" />
                                                    ) : (
                                                        <>
                                                            <span className="text-2xl font-bold text-blue-600">
                                                                Rs. {analysis?.suggested_price || '---'}
                                                            </span>
                                                            {isHigher && <ArrowUpRight className="h-4 w-4 text-emerald-500" />}
                                                            {isLower && <ArrowDownRight className="h-4 w-4 text-blue-400" />}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-center text-[10px]">
                                                <span className="font-bold text-muted-foreground uppercase tracking-widest">AI Confidence</span>
                                                <span className="font-bold text-blue-600">{Math.round((analysis?.confidence_score || 0) * 100)}%</span>
                                            </div>
                                            <Progress value={(analysis?.confidence_score || 0) * 100} className="h-1 bg-blue-50" />
                                        </div>

                                        <div 
                                            className="bg-slate-50 p-3 rounded-xl border border-dashed border-[#e4e4e7] cursor-pointer hover:bg-white hover:border-blue-200 transition-all group/reason"
                                            onClick={() => analysis && setSelectedAnalysis({plan, analysis})}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <Info className="h-3 w-3 text-blue-500" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Reasoning</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                                {analysis?.loading ? "AI is processing market variables..." : analysis?.reasoning || "Analyzing historical trends..."}
                                            </p>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="pt-0 gap-2">
                                        <Button className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 h-10 text-xs font-bold shadow-md shadow-blue-200" disabled={analysis?.loading}>
                                            <CheckCircle2 className="mr-2 h-3.5 w-3.5" /> Apply
                                        </Button>
                                        <Button variant="outline" className="flex-1 rounded-xl h-10 text-xs font-bold border-[#e4e4e7] hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors" disabled={analysis?.loading}>
                                            <XCircle className="mr-2 h-3.5 w-3.5" /> Ignore
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Analysis Details Dialog */}
            <Dialog open={!!selectedAnalysis} onOpenChange={(open) => !open && setSelectedAnalysis(null)}>
                <DialogContent className="sm:max-w-xl rounded-3xl p-8 border-none shadow-2xl">
                    {selectedAnalysis && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-3 bg-blue-50 rounded-2xl">
                                        <Sparkles className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-2xl font-bold tracking-tight">{selectedAnalysis.plan.name}</DialogTitle>
                                        <DialogDescription className="text-blue-600 font-semibold">AI Pricing Strategy Report</DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>
                            
                            <div className="space-y-6 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-[#e4e4e7]">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Suggested Price</span>
                                        <span className="text-3xl font-bold text-blue-600">Rs. {selectedAnalysis.analysis.suggested_price}</span>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-[#e4e4e7]">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Confidence</span>
                                        <span className="text-3xl font-bold text-blue-600">{Math.round(selectedAnalysis.analysis.confidence_score * 100)}%</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold text-[#1a1a1c] flex items-center gap-2">
                                        <BrainCircuit className="h-4 w-4 text-blue-500" />
                                        Neural Analysis Reasoning
                                    </h4>
                                    <p className="text-sm text-slate-600 leading-relaxed bg-blue-50/30 p-4 rounded-2xl border border-blue-100/50">
                                        {selectedAnalysis.analysis.reasoning}
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <div className="p-3 text-center">
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase block">Demand Score</span>
                                        <span className="text-lg font-bold">{(selectedAnalysis.analysis.demand_score || 0).toFixed(1)}/1.0</span>
                                    </div>
                                    <div className="p-3 text-center border-x border-[#e4e4e7]">
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase block">Market Trend</span>
                                        <span className="text-lg font-bold text-emerald-500">Positive</span>
                                    </div>
                                    <div className="p-3 text-center">
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase block">Risk Level</span>
                                        <span className="text-lg font-bold text-blue-400">Low</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button className="flex-1 rounded-2xl h-12 font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                                    Apply Optimization
                                </Button>
                                <Button variant="outline" className="rounded-2xl h-12 px-6 border-[#e4e4e7]" onClick={() => setSelectedAnalysis(null)}>
                                    Dismiss
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
