"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  CreditCard,
  BarChart3,
  Users,
  HelpCircle,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  User,
  GalleryVerticalEnd,
  FileText,
  Plus,
  List,
  ArrowLeft,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/workspaces", label: "Workspaces", icon: Briefcase },
  { href: "/dashboard/community", label: "Community", icon: Users },
  { href: "/dashboard/bookings", label: "Bookings", icon: Calendar },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { 
    href: "/dashboard/booking-management", 
    label: "Booking Mgmt", 
    icon: GalleryVerticalEnd,
    hasSubmenu: true,
    submenuId: "booking"
  },
  { 
    href: "/dashboard/plans", 
    label: "Plans", 
    icon: FileText,
    hasSubmenu: true,
    submenuId: "plans" 
  },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { 
    href: "/dashboard/settings", 
    label: "Settings", 
    icon: Settings,
    hasSubmenu: true,
    submenuId: "settings"
  },
] as const;

const supportNavItems = [
  { href: "/dashboard/support", label: "Support", icon: HelpCircle },
] as const;

interface SidebarContentProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onMobileClose?: () => void;
  className?: string;
  showToggle?: boolean;
}

export function SidebarContent({
  isCollapsed = false,
  onToggleCollapse,
  onMobileClose,
  className,
  showToggle = false,
}: SidebarContentProps) {
  const pathname = usePathname();
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Logo & collapse toggle */}
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border/60 px-4">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-2 overflow-hidden transition-opacity duration-200",
            isCollapsed && "lg:justify-center lg:px-0"
          )}
          onClick={onMobileClose}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GalleryVerticalEnd className="size-4" />
          </div>
          {!isCollapsed && (
            <span className="truncate text-sm font-semibold text-sidebar-foreground">
              SpaceHive360
            </span>
          )}
        </Link>
        {showToggle && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hidden lg:flex"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft
                className={cn("size-4 transition-transform duration-200", isCollapsed && "rotate-180")}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 lg:hidden"
              onClick={onMobileClose}
              aria-label="Close menu"
            >
              <ChevronLeft className="size-4 rotate-180" />
            </Button>
          </div>
        )}
      </div>


      {/* Navigation - grouped */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 relative">
        {/* Main Menu */}
        <div className={cn(
          "space-y-6 transition-all duration-300",
          activeSubmenu && "-translate-x-full opacity-0 pointer-events-none"
        )}>
          <ul className="space-y-0.5">
            {mainNavItems.map((item) => {
              const { href, label, icon: Icon } = item;
              const hasSubmenu = "hasSubmenu" in item && item.hasSubmenu;
              const submenuId = "submenuId" in item ? item.submenuId : null;
              
              const isActive =
                pathname === href ||
                (href !== "/dashboard" && pathname.startsWith(href));
              
              const content = (
                <div className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer",
                  isActive
                    ? "bg-secondary text-foreground shadow-sm"
                    : "text-muted-foreground hover:-translate-y-px hover:bg-secondary/50 hover:text-foreground hover:shadow-sm",
                  isCollapsed && "lg:justify-center lg:px-2"
                )}>
                  {isActive && (
                    <span className="absolute left-2 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />
                  )}
                  <Icon className={cn("size-5 shrink-0 transition-colors duration-200", isActive && "text-primary")} />
                  {!isCollapsed && <span className="truncate">{label}</span>}
                  {!isCollapsed && hasSubmenu && (
                    <ChevronLeft className="ml-auto size-4 -rotate-180 text-muted-foreground/50 group-hover:text-foreground" />
                  )}
                </div>
              );

              return (
                <li key={href}>
                  {hasSubmenu && !isCollapsed ? (
                    <button 
                      onClick={() => setActiveSubmenu(submenuId)}
                      className="w-full text-left"
                    >
                      {content}
                    </button>
                  ) : (
                    <Link href={href} onClick={onMobileClose}>
                      {content}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="border-t border-sidebar-border/50 pt-4">
            <p className={cn("mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70", isCollapsed && "lg:hidden")}>
              Support
            </p>
            <ul className="space-y-0.5">
              {supportNavItems.map(({ href, label, icon: Icon }) => {
                const isActive =
                  pathname === href || pathname.startsWith(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onMobileClose}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-secondary text-foreground shadow-sm"
                          : "text-muted-foreground hover:-translate-y-px hover:bg-secondary/50 hover:text-foreground hover:shadow-sm",
                        isCollapsed && "lg:justify-center lg:px-2"
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-2 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />
                      )}
                      <Icon className={cn("size-5 shrink-0 transition-colors duration-200", isActive && "text-primary")} />
                      {!isCollapsed && <span className="truncate">{label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Secondary Submenu Panel */}
        {activeSubmenu === "plans" && (
          <div className="absolute inset-0 px-3 py-4 space-y-6 animate-in slide-in-from-right duration-300">
            <div className="space-y-4">
              <button 
                onClick={() => setActiveSubmenu(null)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors group"
              >
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                <span>Back</span>
              </button>
              
              <div className="px-3">
                <h3 className="text-lg font-bold tracking-tight">Plans</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">Management</p>
              </div>

              <ul className="space-y-0.5">
                <li>
                  <Link
                    href="/dashboard/plans"
                    onClick={onMobileClose}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      pathname === "/dashboard/plans"
                        ? "bg-secondary text-foreground shadow-sm"
                        : "text-muted-foreground hover:-translate-y-px hover:bg-secondary/50 hover:text-foreground hover:shadow-sm"
                    )}
                  >
                    {pathname === "/dashboard/plans" && (
                      <span className="absolute left-2 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />
                    )}
                    <Plus className={cn("size-5 shrink-0 transition-colors duration-200", pathname === "/dashboard/plans" && "text-primary")} />
                    <span className="truncate">Create Plan</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/plans/all-plans"
                    onClick={onMobileClose}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      pathname === "/dashboard/plans/all-plans"
                        ? "bg-secondary text-foreground shadow-sm"
                        : "text-muted-foreground hover:-translate-y-px hover:bg-secondary/50 hover:text-foreground hover:shadow-sm"
                    )}
                  >
                    {pathname === "/dashboard/plans/all-plans" && (
                      <span className="absolute left-2 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />
                    )}
                    <List className={cn("size-5 shrink-0 transition-colors duration-200", pathname === "/dashboard/plans/all-plans" && "text-primary")} />
                    <span className="truncate">All Plans</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="px-3 pt-4 border-t border-sidebar-border/50">
              <div className="rounded-xl bg-primary/5 p-4 border border-primary/10">
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Pro Tip</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Use "All Plans" to quickly duplicate or update existing pricing structures.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Submenu Panel - Booking Management */}
        {activeSubmenu === "booking" && (
          <div className="absolute inset-0 px-3 py-4 space-y-6 animate-in slide-in-from-right duration-300">
            <div className="space-y-4">
              <button 
                onClick={() => setActiveSubmenu(null)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors group"
              >
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                <span>Back</span>
              </button>
              
              <div className="px-3">
                <h3 className="text-lg font-bold tracking-tight">Booking Mgmt</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">On-Demand</p>
              </div>

              <ul className="space-y-0.5">
                <li>
                  <Link
                    href="/dashboard/booking-management"
                    onClick={onMobileClose}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      pathname === "/dashboard/booking-management"
                        ? "bg-secondary text-foreground shadow-sm"
                        : "text-muted-foreground hover:-translate-y-px hover:bg-secondary/50 hover:text-foreground hover:shadow-sm"
                    )}
                  >
                    {pathname === "/dashboard/booking-management" && (
                      <span className="absolute left-2 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />
                    )}
                    <Plus className={cn("size-5 shrink-0 transition-colors duration-200", pathname === "/dashboard/booking-management" && "text-primary")} />
                    <span className="truncate">Create Booking Plan</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/booking-management/all"
                    onClick={onMobileClose}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      pathname === "/dashboard/booking-management/all"
                        ? "bg-secondary text-foreground shadow-sm"
                        : "text-muted-foreground hover:-translate-y-px hover:bg-secondary/50 hover:text-foreground hover:shadow-sm"
                    )}
                  >
                    {pathname === "/dashboard/booking-management/all" && (
                      <span className="absolute left-2 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />
                    )}
                    <List className={cn("size-5 shrink-0 transition-colors duration-200", pathname === "/dashboard/booking-management/all" && "text-primary")} />
                    <span className="truncate">All Booking Plans</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="px-3 pt-4 border-t border-sidebar-border/50">
              <div className="rounded-xl bg-primary/5 p-4 border border-primary/10">
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Smart Tip</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Booking plans are best for meeting rooms and hourly hot-desks.
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Secondary Submenu Panel - Settings */}
        {activeSubmenu === "settings" && (
          <div className="absolute inset-0 px-3 py-4 space-y-6 animate-in slide-in-from-right duration-300">
            <div className="space-y-4">
              <button 
                onClick={() => setActiveSubmenu(null)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors group"
              >
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                <span>Back</span>
              </button>
              
              <div className="px-3">
                <h3 className="text-lg font-bold tracking-tight">Settings</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">Configuration</p>
              </div>

              <ul className="space-y-0.5">
                <li>
                  <Link
                    href="/dashboard/settings/locations"
                    onClick={onMobileClose}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      pathname.startsWith("/dashboard/settings/locations")
                        ? "bg-secondary text-foreground shadow-sm"
                        : "text-muted-foreground hover:-translate-y-px hover:bg-secondary/50 hover:text-foreground hover:shadow-sm"
                    )}
                  >
                    {pathname.startsWith("/dashboard/settings/locations") && (
                      <span className="absolute left-2 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />
                    )}
                    <Building2 className={cn("size-5 shrink-0 transition-colors duration-200", pathname.startsWith("/dashboard/settings/locations") && "text-primary")} />
                    <span className="truncate">Locations</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="px-3 pt-4 border-t border-sidebar-border/50">
              <div className="rounded-xl bg-primary/5 p-4 border border-primary/10">
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Notice</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Locations are used to group workspaces and plans.
                </p>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* User section */}
      <div
        className={cn(
          "border-t border-sidebar-border/60 p-3",
          isCollapsed && "lg:px-2"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5",
            isCollapsed && "lg:justify-center lg:px-2"
          )}
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted/80 ring-1 ring-border/50">
            <User className="size-4 text-muted-foreground" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                Space Provider
              </p>
              <p className="truncate text-xs text-muted-foreground">
                provider@spacehive360.com
              </p>
            </div>
          )}
        </div>
        <Button
  variant="ghost"
  onClick={() => {
    localStorage.removeItem("token"); // ✅ clear auth
    window.location.href = "/login";  // force redirect
  }}
  className={cn(
    "mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary/50 hover:text-foreground",
    isCollapsed && "lg:justify-center lg:px-2"
  )}
>
  <LogOut className="size-5 shrink-0" />
  {!isCollapsed && <span>Log out</span>}
</Button>
      </div>
    </div>
  );
}

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/25 backdrop-blur-md transition-opacity duration-300 lg:hidden",
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      {/* Sidebar - floating surface on desktop */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col transition-all duration-300 ease-in-out",
          "lg:left-3 lg:top-3 lg:h-[calc(100vh-1.5rem)] lg:rounded-r-2xl",
          "bg-sidebar lg:border lg:border-sidebar-border/80 lg:border-l-0",
          "lg:bg-sidebar/95 lg:shadow-xl lg:shadow-black/5 lg:backdrop-blur-xl",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "lg:w-[72px]" : "lg:w-[260px]"
        )}
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
          onMobileClose={onMobileClose}
          showToggle={true}
        />
      </aside>
    </>
  );
}
