import { Search, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-border/40 bg-background/60 px-4 md:px-6 shadow-sm backdrop-blur-md transition-all">
      
      {/* Mobile Menu Trigger */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="lg:hidden -ml-2 text-muted-foreground"
        onClick={onMenuClick}
      >
        <Menu className="size-5" />
        <span className="sr-only">Open menu</span>
      </Button>

      {/* Search / Command Bar */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden lg:flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
            <Input 
                placeholder="Ask AI or search..." 
                className="pl-9 h-9 w-full rounded-full bg-secondary/50 border-transparent focus-visible:bg-background focus-visible:border-ring/30 focus-visible:ring-0 transition-all shadow-none" 
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                 <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
            </div>
        </div>
        
        {/* Mobile Search Icon (optional simplified version) */}
        <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground">
             <Search className="size-5" />
        </Button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
         {/* AI Insight Badge (Non-functional visual) */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 text-xs font-medium text-primary/80 mr-2">
            <SparklesIcon className="size-3" />
            <span className="text-[10px] uppercase tracking-wider font-bold">AI Insight Ready</span>
        </div>

        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="size-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-[1.5px] border-background"></span>
        </Button>
      </div>
    </header>
  );
}

function SparklesIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
        >
            <path
                fillRule="evenodd"
                d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM9 13.5a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V14.25a.75.75 0 01.75-.75zm9-9a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V5.25A.75.75 0 0118 4.5z"
                clipRule="evenodd"
            />
        </svg>
    )
}
