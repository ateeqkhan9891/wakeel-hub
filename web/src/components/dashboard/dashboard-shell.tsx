"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell, Briefcase, CalendarCheck, CreditCard, FileWarning, Gavel, LayoutDashboard, LogOut,
  Menu, MessageSquare, Receipt, Settings, ShieldCheck, Users,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DashboardRole = "client" | "lawyer" | "admin";

const NAV_ITEMS: Record<DashboardRole, { href: string; label: string; icon: typeof LayoutDashboard; badgeKey?: string }[]> = {
  client: [
    { href: "/dashboard/client", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/client/cases", label: "My Cases", icon: Briefcase },
    { href: "/dashboard/client/bookings", label: "Bookings", icon: CalendarCheck },
    { href: "/dashboard/client/messages", label: "Messages", icon: MessageSquare, badgeKey: "messages" },
    { href: "/dashboard/client/payments", label: "Payments", icon: Receipt },
    { href: "/dashboard/client/notifications", label: "Notifications", icon: Bell, badgeKey: "notifications" },
    { href: "/dashboard/client/support", label: "Support", icon: FileWarning },
  ],
  lawyer: [
    { href: "/dashboard/lawyer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/lawyer/bookings", label: "Bookings", icon: CalendarCheck, badgeKey: "bookings" },
    { href: "/dashboard/lawyer/cases", label: "Cases", icon: Briefcase },
    { href: "/dashboard/lawyer/messages", label: "Messages", icon: MessageSquare, badgeKey: "messages" },
    { href: "/dashboard/lawyer/payments", label: "Payments", icon: Receipt },
    { href: "/dashboard/lawyer/notifications", label: "Notifications", icon: Bell, badgeKey: "notifications" },
    { href: "/dashboard/lawyer/profile", label: "Profile & Verification", icon: ShieldCheck },
    { href: "/dashboard/lawyer/billing", label: "Subscription", icon: CreditCard },
    { href: "/dashboard/lawyer/support", label: "Support", icon: FileWarning },
    { href: "/dashboard/lawyer/settings", label: "Settings", icon: Settings },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/lawyers", label: "Lawyer Verification", icon: ShieldCheck, badgeKey: "verifications" },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/cases", label: "Cases", icon: Gavel },
    { href: "/dashboard/admin/payments", label: "Payments", icon: Receipt },
    { href: "/dashboard/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
    { href: "/dashboard/admin/reports", label: "Reports & Reviews", icon: FileWarning, badgeKey: "reports" },
  ],
};

interface DashboardShellProps {
  role: DashboardRole;
  user: { name: string; email: string; avatarSeed: string };
  badges?: Record<string, number>;
  children: React.ReactNode;
}

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
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-border bg-slate-50 dark:bg-background px-2.5 py-1 text-[11px] font-semibold tracking-wide text-slate-600 dark:text-muted-foreground">
      <Icon className="h-3.5 w-3.5 text-gold" />
      {ROLE_LABEL[role]}
    </span>
  );
}

interface NavLinksProps {
  role: DashboardRole;
  pathname: string;
  badges: Record<string, number>;
  onNavigate?: () => void;
}

function NavLinks({ role, pathname, badges, onNavigate }: NavLinksProps) {
  const navItems = NAV_ITEMS[role];

  return (
    <nav className="flex flex-1 flex-col gap-1">
      {navItems.map((item) => {
        const active = pathname === item.href || (item.href !== `/dashboard/${role}` && pathname.startsWith(item.href));
        const badgeValue = item.badgeKey ? badges[item.badgeKey] : undefined;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-600 dark:text-muted-foreground hover:bg-slate-100 dark:hover:bg-secondary hover:text-slate-950 dark:text-foreground dark:hover:text-foreground"
            )}
          >
            <span className="flex items-center gap-3">
              <item.icon className="h-4 w-4" />
              {item.label}
            </span>
            {!!badgeValue && (
              <Badge className={cn("h-5 min-w-5 justify-center rounded-full px-1.5 text-[11px] shadow-none", active ? "bg-white/15 text-white" : "bg-amber-50 text-amber-700")}>
                {badgeValue}
              </Badge>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardShell({ role, user, badges = {}, children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const unreadNotifications = badges.notifications ?? 0;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Logged out", { description: "You've been signed out of your account." });
    router.push("/login");
    router.refresh();
  }

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex min-h-svh bg-slate-50 dark:bg-background">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-svh w-68 shrink-0 flex-col border-r border-slate-200 dark:border-border bg-white dark:bg-card px-4 py-5 lg:flex">
        <Logo className="px-1.5" />
        <div className="mt-4 px-1.5">
          <RoleBadge role={role} />
        </div>
        <div className="mt-6">
          <NavLinks role={role} pathname={pathname} badges={badges} />
        </div>
        <div className="mt-auto space-y-1 border-t border-slate-200 dark:border-border pt-4">
          <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-secondary hover:text-slate-950 dark:text-foreground dark:hover:text-foreground">
            <Settings className="h-4 w-4" />
            Back to website
          </Link>
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-secondary hover:text-slate-950 dark:text-foreground dark:hover:text-foreground">
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 dark:border-border bg-white/90 dark:bg-card/90 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 px-4">
                <SheetHeader>
                  <SheetTitle><Logo /></SheetTitle>
                </SheetHeader>
                <div className="mt-3"><RoleBadge role={role} /></div>
                <div className="mt-4">
                  <NavLinks role={role} pathname={pathname} badges={badges} />
                </div>
              </SheetContent>
            </Sheet>
            <p className="hidden text-sm text-slate-500 dark:text-muted-foreground sm:block">
              Welcome back, <span className="font-medium text-slate-950 dark:text-foreground">{user.name.split(" ")[0]}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href={`/dashboard/${role}/notifications`}>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4.5 w-4.5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-semibold text-white">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-border bg-white dark:bg-card py-1 pl-1 pr-3 transition-colors hover:bg-slate-50 dark:bg-background">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.avatarSeed)}`} alt={user.name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium text-slate-950 dark:text-foreground sm:inline">{user.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/">Back to website</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
