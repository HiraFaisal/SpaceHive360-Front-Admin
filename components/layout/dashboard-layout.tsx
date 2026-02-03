"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/10">
      {/* Desktop Sidebar */}
      <Sidebar isCollapsed={false} onToggleCollapse={() => {}} isMobileOpen={false} onMobileClose={() => {}} />

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      <div className="flex flex-1 flex-col lg:pl-[280px] transition-all duration-300 ease-in-out">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        <main className="flex-1 p-4 md:p-8 lg:p-10 lg:pt-24 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
