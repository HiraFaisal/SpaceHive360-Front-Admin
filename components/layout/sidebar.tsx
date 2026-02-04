"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Sparkles,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/workspaces", label: "Workspaces", icon: Briefcase },
  { href: "/dashboard/plans", label: "Plans", icon: FileText },
  { href: "/dashboard/bookings", label: "Bookings", icon: Calendar },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/community", label: "Community", icon: Users },
] as const;

const supportNavItems = [
  { href: "/dashboard/support", label: "Support", icon: HelpCircle },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
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

      {/* AI status indicator */}
      {!isCollapsed && (
        <div className="mx-3 mt-3 flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-2.5 ring-1 ring-primary/10 transition-all duration-200">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="size-3.5 text-primary" />
          </div>
          <p className="truncate text-xs font-medium text-foreground/90">
            AI Optimizing Space Utilization
          </p>
        </div>
      )}
      {isCollapsed && (
        <div className="mx-2 mt-3 flex justify-center">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/5 ring-1 ring-primary/10" title="AI Optimizing Space Utilization">
            <Sparkles className="size-4 text-primary" />
          </div>
        </div>
      )}

      {/* Navigation - grouped */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
        <div className="space-y-6">
          <ul className="space-y-0.5">
            {mainNavItems.map(({ href, label, icon: Icon }) => {
              const isActive =
                pathname === href ||
                (href !== "/dashboard" && pathname.startsWith(href));
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
        <Link
          href="/login"
          onClick={onMobileClose}
          className={cn(
            "mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary/50 hover:text-foreground",
            isCollapsed && "lg:justify-center lg:px-2"
          )}
        >
          <LogOut className="size-5 shrink-0" />
          {!isCollapsed && <span>Log out</span>}
        </Link>
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
