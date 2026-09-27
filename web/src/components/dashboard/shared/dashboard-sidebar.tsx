"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Briefcase,
  CalendarCheck,
  CreditCard,
  FileWarning,
  Gavel,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Receipt,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/shared/logo";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type DashboardRole = "client" | "lawyer" | "admin";

type DashboardSidebarProps = {
  role: DashboardRole;
  badges: Record<string, number>;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
};

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badgeKey?: string;
};

const NAV_ITEMS: Record<DashboardRole, NavItem[]> = {
  client: [
    {
      href: "/dashboard/client",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/client/cases",
      label: "My Cases",
      icon: Briefcase,
    },
    {
      href: "/dashboard/client/bookings",
      label: "Bookings",
      icon: CalendarCheck,
    },
    {
      href: "/dashboard/client/messages",
      label: "Messages",
      icon: MessageSquare,
      badgeKey: "messages",
    },
    {
      href: "/dashboard/client/payments",
      label: "Payments",
      icon: Receipt,
    },
    {
      href: "/dashboard/client/notifications",
      label: "Notifications",
      icon: Bell,
      badgeKey: "notifications",
    },
    {
      href: "/dashboard/client/support",
      label: "Support",
      icon: FileWarning,
    },
  ],

  lawyer: [
    {
      href: "/dashboard/lawyer",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/lawyer/bookings",
      label: "Bookings",
      icon: CalendarCheck,
      badgeKey: "bookings",
    },
    {
      href: "/dashboard/lawyer/cases",
      label: "Cases",
      icon: Briefcase,
    },
    {
      href: "/dashboard/lawyer/messages",
      label: "Messages",
      icon: MessageSquare,
      badgeKey: "messages",
    },
    {
      href: "/dashboard/lawyer/payments",
      label: "Payments",
      icon: Receipt,
    },
    {
      href: "/dashboard/lawyer/notifications",
      label: "Notifications",
      icon: Bell,
      badgeKey: "notifications",
    },
    {
      href: "/dashboard/lawyer/profile",
      label: "Profile & Verification",
      icon: ShieldCheck,
    },
    {
      href: "/dashboard/lawyer/billing",
      label: "Subscription",
      icon: CreditCard,
    },
    {
      href: "/dashboard/lawyer/support",
      label: "Support",
      icon: FileWarning,
    },
    {
      href: "/dashboard/lawyer/settings",
      label: "Settings",
      icon: Settings,
    },
  ],

  admin: [
    {
      href: "/dashboard/admin",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/admin/lawyers",
      label: "Lawyer Verification",
      icon: ShieldCheck,
      badgeKey: "verifications",
    },
    {
      href: "/dashboard/admin/users",
      label: "Users",
      icon: Users,
    },
    {
      href: "/dashboard/admin/cases",
      label: "Cases",
      icon: Gavel,
    },
    {
      href: "/dashboard/admin/payments",
      label: "Payments",
      icon: Receipt,
    },
    {
      href: "/dashboard/admin/subscriptions",
      label: "Subscriptions",
      icon: CreditCard,
    },
    {
      href: "/dashboard/admin/reports",
      label: "Reports & Reviews",
      icon: FileWarning,
      badgeKey: "reports",
    },
  ],
};

const ROLE_LABEL: Record<DashboardRole, string> = {
  client: "Client account",
  lawyer: "Lawyer account",
  admin: "Admin account",
};

const ROLE_ICON: Record<DashboardRole, typeof Users> = {
  client: Users,
  lawyer: Gavel,
  admin: ShieldCheck,
};

function RoleBadge({ role }: { role: DashboardRole }) {
  const Icon = ROLE_ICON[role];

  return (
    <div className="flex items-center gap-2.5 px-1">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 dark:border-border dark:bg-background">
        <Icon className="h-3.5 w-3.5 text-gold" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-slate-800 dark:text-foreground">
          {ROLE_LABEL[role]}
        </p>
        <p className="text-[10px] text-slate-400 dark:text-muted-foreground">
          Workspace
        </p>
      </div>
    </div>
  );
}

function NavLinks({
  role,
  pathname,
  badges,
  onNavigate,
}: {
  role: DashboardRole;
  pathname: string;
  badges: Record<string, number>;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-0.5">
      {NAV_ITEMS[role].map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== `/dashboard/${role}` &&
            pathname.startsWith(item.href));

        const badgeValue = item.badgeKey
          ? badges[item.badgeKey]
          : undefined;

        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-slate-100 font-semibold text-slate-950 dark:bg-secondary dark:text-foreground"
                : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-muted-foreground dark:hover:bg-secondary/60 dark:hover:text-foreground",
            )}
          >
            <span className="flex min-w-0 items-center gap-3">
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  active
                    ? "text-slate-900 dark:text-foreground"
                    : "text-slate-400 dark:text-muted-foreground",
                )}
              />

              <span className="truncate">{item.label}</span>
            </span>

            {!!badgeValue && (
              <Badge
                className={cn(
                  "h-5 min-w-5 rounded-full border-0 px-1.5 text-[10px] font-semibold shadow-none",
                  active
                    ? "bg-slate-950 text-white dark:bg-primary dark:text-primary-foreground"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
                )}
              >
                {badgeValue}
              </Badge>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarContent({
  role,
  badges,
  pathname,
  onNavigate,
  onLogout,
}: {
  role: DashboardRole;
  badges: Record<string, number>;
  pathname: string;
  onNavigate?: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-1">
        <Logo />
      </div>

      <div className="mt-6">
        <RoleBadge role={role} />
      </div>

      <div className="mt-8">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-muted-foreground">
          Menu
        </p>

        <NavLinks
          role={role}
          pathname={pathname}
          badges={badges}
          onNavigate={onNavigate}
        />
      </div>

      <div className="mt-auto border-t border-slate-200 pt-4 dark:border-border">
        <div className="space-y-0.5">
          <Link
            href="/"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950 dark:text-muted-foreground dark:hover:bg-secondary dark:hover:text-foreground"
          >
            <Settings className="h-4 w-4 text-slate-400 dark:text-muted-foreground" />
            Back to website
          </Link>

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-muted-foreground dark:hover:bg-red-500/10 dark:hover:text-red-400"
          >
            <LogOut className="h-4 w-4 text-slate-400 dark:text-muted-foreground" />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export function DashboardSidebar({
  role,
  badges,
  mobileOpen,
  onMobileOpenChange,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    toast.success("Logged out", {
      description: "You've been signed out of your account.",
    });

    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <aside className="sticky top-0 hidden h-svh w-68 shrink-0 border-r border-slate-200 bg-white px-4 py-5 dark:border-border dark:bg-card lg:block">
        <SidebarContent
          role={role}
          badges={badges}
          pathname={pathname}
          onLogout={handleLogout}
        />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent
          side="left"
          className="w-72 border-r border-slate-200 bg-white px-4 dark:border-border dark:bg-card"
        >
          <SheetHeader className="border-b border-slate-200 pb-4 dark:border-border">
            <SheetTitle className="text-left">
              <Logo />
            </SheetTitle>
          </SheetHeader>

          <div className="mt-5 h-[calc(100%-5rem)]">
            <SidebarContent
              role={role}
              badges={badges}
              pathname={pathname}
              onNavigate={() => onMobileOpenChange(false)}
              onLogout={handleLogout}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}