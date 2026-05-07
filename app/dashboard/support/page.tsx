"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  ChevronDown, 
  BookOpen, 
  CreditCard, 
  Building2, 
  Users, 
  BarChart3, 
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Plus,
  Edit2,
  Trash2,
  Settings2,
  X,
  Save,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  fetchAllFaqs, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  createFaq, 
  updateFaq, 
  deleteFaq,
  FaqCategoryDto,
  FaqDto
} from "@/lib/api/support";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";

const ICON_MAP: Record<string, any> = {
  BookOpen,
  CreditCard,
  Building2,
  Users,
  BarChart3,
  ShieldCheck,
  HelpCircle
};

export default function SupportPage() {
  const [data, setData] = useState<FaqCategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isManageMode, setIsManageMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Management States
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isFaqDialogOpen, setIsFaqDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FaqCategoryDto | null>(null);
  const [editingFaq, setEditingFaq] = useState<FaqDto | null>(null);
  const [targetCategoryId, setTargetCategoryId] = useState<string>("");

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchAllFaqs();
      setData(res);
      if (res.length > 0 && !activeCategory) {
        setActiveCategory(res[0].name);
      }
    } catch (err) {
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleItem = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredData = useMemo(() => {
    // In Manage Mode, show everything so we can add FAQs to empty categories
    if (isManageMode) {
      if (!searchQuery) return data;
      const query = searchQuery.toLowerCase();
      return data.map(cat => ({
        ...cat,
        faqs: cat.faqs.filter(
          f => f.question.toLowerCase().includes(query) || 
               f.answer.toLowerCase().includes(query)
        )
      }));
    }

    // In User Mode, hide empty categories and filter by search if present
    const query = searchQuery.toLowerCase();
    return data.map(cat => ({
      ...cat,
      faqs: cat.faqs.filter(
        f => f.question.toLowerCase().includes(query) || 
             f.answer.toLowerCase().includes(query)
      )
    })).filter(cat => cat.faqs.length > 0);
  }, [data, searchQuery, isManageMode]);

  const handleCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      icon: formData.get("icon") as string || "HelpCircle",
      displayOrder: parseInt(formData.get("displayOrder") as string) || 0
    };

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.recId, payload);
        toast.success("Category updated");
      } else {
        await createCategory(payload);
        toast.success("Category created");
      }
      setIsCategoryDialogOpen(false);
      loadData();
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleFaqSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      fkCategory: targetCategoryId,
      question: formData.get("question") as string,
      answer: formData.get("answer") as string,
      steps: formData.get("steps") as string
    };

    try {
      if (editingFaq) {
        await updateFaq(editingFaq.recId, payload);
        toast.success("FAQ updated");
      } else {
        await createFaq(payload);
        toast.success("FAQ created");
      }
      setIsFaqDialogOpen(false);
      loadData();
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await deleteFaq(id);
      toast.success("FAQ deleted");
      loadData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete category and all its FAQs?")) return;
    try {
      await deleteCategory(id);
      toast.success("Category deleted");
      loadData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">Loading support resources...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-[32px] bg-primary p-10 text-primary-foreground shadow-xl shadow-primary/10">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                <HelpCircle className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase opacity-70">Provider Support</span>
            </div>
            
            <Button 
              variant="secondary" 
              size="sm" 
              className="rounded-xl bg-white/10 hover:bg-white/20 border-none text-white text-xs font-bold"
              onClick={() => setIsManageMode(!isManageMode)}
            >
              <Settings2 className="h-3.5 w-3.5 mr-2" />
              {isManageMode ? "Exit Management" : "Super Admin Mode"}
            </Button>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              {isManageMode ? "FAQ Management" : "How can we help you?"}
            </h1>
            <p className="text-sm opacity-80 max-w-xl font-medium">
              {isManageMode 
                ? "Manage your platform's help articles and categories to guide your providers effectively."
                : "Search our knowledge base or browse categories to find answers to common questions."}
            </p>
          </div>

          {!isManageMode && (
            <div className="relative max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/60" />
              <input 
                type="text" 
                placeholder="Search questions or answers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white text-gray-900 placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-white/20 transition-all text-sm"
              />
            </div>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="sticky top-24 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Categories</h3>
              {isManageMode && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-lg text-primary hover:bg-primary/10"
                  onClick={() => {
                    setEditingCategory(null);
                    setIsCategoryDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-1">
              {(isManageMode ? data : filteredData).map((cat) => {
                const Icon = ICON_MAP[cat.icon] || HelpCircle;
                return (
                  <div key={cat.recId} className="group relative">
                    <button 
                      onClick={() => {
                        setActiveCategory(cat.name);
                        document.getElementById(cat.recId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all text-left",
                        activeCategory === cat.name 
                          ? "bg-primary/5 text-primary font-semibold" 
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        <span className="text-xs">{cat.name}</span>
                      </div>
                      {isManageMode && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Edit2 
                            className="h-3 w-3 hover:text-primary cursor-pointer" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCategory(cat);
                              setIsCategoryDialogOpen(true);
                            }}
                          />
                          <Trash2 
                            className="h-3 w-3 hover:text-destructive cursor-pointer" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(cat.recId);
                            }}
                          />
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
            
            <div className="p-5 rounded-2xl bg-muted/30 border border-border/40">
              <h4 className="text-xs font-bold mb-1.5">Need help?</h4>
              <p className="text-[10px] text-muted-foreground mb-3 leading-relaxed">
                Contact our support for complex technical issues.
              </p>
              <button className="text-[10px] font-bold text-primary flex items-center gap-1 hover:gap-1.5 transition-all">
                Submit Request <ArrowRight className="h-2.5 w-2.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-10">
          {filteredData.map((category) => (
            <section key={category.recId} id={category.recId} className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-6 w-1 rounded-full bg-primary/40" />
                  <h2 className="text-lg font-semibold tracking-tight text-foreground/90">{category.name}</h2>
                </div>
                {isManageMode && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 rounded-xl text-xs gap-1.5 border-dashed"
                    onClick={() => {
                      setTargetCategoryId(category.recId);
                      setEditingFaq(null);
                      setIsFaqDialogOpen(true);
                    }}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Question
                  </Button>
                )}
              </div>

              <div className="space-y-2.5">
                {category.faqs.map((item) => (
                  <div 
                    key={item.recId}
                    className={cn(
                      "group rounded-2xl border border-border/40 bg-card/50 transition-all duration-200",
                      expandedItems.includes(item.recId) && "border-primary/20 bg-card shadow-sm"
                    )}
                  >
                    <div className="flex items-center">
                      <button 
                        onClick={() => toggleItem(item.recId)}
                        className="flex-1 flex items-start justify-between gap-4 p-5 text-left"
                      >
                        <span className={cn(
                          "text-sm font-medium transition-colors leading-relaxed",
                          expandedItems.includes(item.recId) ? "text-primary" : "text-foreground/80 group-hover:text-foreground"
                        )}>
                          {item.question}
                        </span>
                        <ChevronDown className={cn(
                          "h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform duration-300",
                          expandedItems.includes(item.recId) && "rotate-180 text-primary"
                        )} />
                      </button>
                      
                      {isManageMode && (
                        <div className="flex items-center gap-1 pr-5">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg"
                            onClick={() => {
                              setTargetCategoryId(category.recId);
                              setEditingFaq(item);
                              setIsFaqDialogOpen(true);
                            }}
                          >
                            <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg hover:text-destructive"
                            onClick={() => handleDeleteFaq(item.recId)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <AnimatePresence>
                      {expandedItems.includes(item.recId) && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 space-y-4">
                            <div className="h-px bg-border/30" />
                            <p className="text-[13px] text-muted-foreground/90 leading-relaxed font-normal">
                              {item.answer}
                            </p>
                            {item.steps && (
                              <div className="space-y-2.5 pt-1">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-primary/80">Implementation Guide</p>
                                <div className="space-y-1.5">
                                  {item.steps.split('\n').map((step, idx) => (
                                    <div key={idx} className="flex items-start gap-3 text-[13px] text-foreground/80 font-normal">
                                      <div className="flex items-center justify-center h-4 w-4 rounded-full bg-primary/5 text-primary text-[9px] font-bold shrink-0 mt-0.5">
                                        {idx + 1}
                                      </div>
                                      {step}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {filteredData.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-muted/50">
                <Search className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <div>
                <h3 className="text-base font-semibold">No matches found</h3>
                <p className="text-xs text-muted-foreground">Try rephrasing your search or checking another category.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Management Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[24px]">
          <form onSubmit={handleCategorySubmit}>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                {editingCategory ? "Edit Category" : "New FAQ Category"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase px-1">Name</label>
                <Input name="name" defaultValue={editingCategory?.name} placeholder="e.g. Booking Help" className="rounded-xl h-11" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase px-1">Icon Name</label>
                <Input name="icon" defaultValue={editingCategory?.icon} placeholder="e.g. BookOpen, CreditCard..." className="rounded-xl h-11" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase px-1">Order</label>
                <Input name="displayOrder" type="number" defaultValue={editingCategory?.displayOrder} className="rounded-xl h-11" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full rounded-xl h-11 font-bold">
                <Save className="h-4 w-4 mr-2" />
                {editingCategory ? "Update Category" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* FAQ Management Dialog */}
      <Dialog open={isFaqDialogOpen} onOpenChange={setIsFaqDialogOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-[24px]">
          <form onSubmit={handleFaqSubmit}>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                {editingFaq ? "Edit Question" : "New FAQ Question"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase px-1">Question</label>
                <Input name="question" defaultValue={editingFaq?.question} placeholder="What is the question?" className="rounded-xl h-11" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase px-1">Answer</label>
                <Textarea name="answer" defaultValue={editingFaq?.answer} placeholder="Provide a detailed answer..." className="rounded-xl min-h-[120px] resize-none" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase px-1">Steps (Optional, Newline separated)</label>
                <Textarea name="steps" defaultValue={editingFaq?.steps} placeholder="Step 1\nStep 2..." className="rounded-xl min-h-[100px] resize-none text-[13px]" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full rounded-xl h-11 font-bold">
                <Save className="h-4 w-4 mr-2" />
                {editingFaq ? "Update FAQ" : "Publish FAQ"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
