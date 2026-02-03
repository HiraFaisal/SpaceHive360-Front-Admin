"use client";

import { X } from "lucide-react";
import { SidebarContent } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!isMounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Sheet */}
      <div 
        className={`fixed inset-y-0 left-0 z-[60] w-full max-w-[280px] border-r bg-background shadow-2xl transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute right-4 top-4 z-[60]">
             <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <X className="size-4" />
                <span className="sr-only">Close sidebar</span>
             </Button>
        </div>
        <div className="h-full bg-sidebar/95 backdrop-blur-3xl">
            <SidebarContent />
        </div>
      </div>
    </>
  );
}
