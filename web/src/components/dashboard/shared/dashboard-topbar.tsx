"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  SunMoon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DashboardRole = "client" | "lawyer" | "admin";

type DashboardTopbarProps = {
  role: DashboardRole;
  user: {
    name: string;
    email: string;
    avatarSeed: string;
  };
  badges: Record<string, number>;
  onMenuOpen: () => void;
};

export function DashboardTopbar({
  role,
  user,
  badges,
  onMenuOpen,
}: DashboardTopbarProps) {
  const router = useRouter();
  const unreadNotifications = badges.notifications ?? 0;

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    toast.success("Logged out", {
      description: "You've been signed out of your account.",
    });

    router.push("/login");
    router.refresh();
  }

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const roleLabel =
    role === "admin" ? "Administrator" : role === "lawyer" ? "Lawyer" : "Client";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-border dark:bg-card/90 sm:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          onClick={onMenuOpen}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <p className="hidden text-sm text-slate-500 dark:text-muted-foreground sm:block">
          Welcome back,{" "}
          <span className="font-['Dancing_Script'] text-xl font-medium text-slate-950 dark:text-foreground">
            {user.name.split(" ")[0]}
          </span>
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
            <button className="group flex items-center gap-2 rounded-full border border-slate-200/80 bg-white py-1 pl-1 pr-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 data-[state=open]:border-slate-300 data-[state=open]:bg-slate-50 dark:border-border dark:bg-card dark:hover:border-slate-600 dark:hover:bg-secondary/60 dark:focus-visible:ring-ring dark:data-[state=open]:border-slate-600 dark:data-[state=open]:bg-secondary">
              <div className="relative">
                <Avatar className="h-7 w-7 border border-slate-200/60 dark:border-border">
                  <AvatarImage
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                      user.avatarSeed,
                    )}`}
                    alt={user.name}
                  />

                  <AvatarFallback className="bg-slate-100 text-[11px] font-semibold text-slate-700 dark:bg-secondary dark:text-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-[1.5px] border-white bg-emerald-500 dark:border-card" />
              </div>

              <div className="hidden min-w-0 text-left sm:block">
                <p className="max-w-[120px] truncate text-xs font-medium leading-tight text-slate-800 dark:text-foreground">
                  {user.name}
                </p>

                <p className="text-[10px] font-medium uppercase tracking-wide leading-tight text-slate-400 dark:text-muted-foreground">
                  {roleLabel}
                </p>
              </div>

              <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180 dark:text-muted-foreground sm:block" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={6}
            className="w-64 rounded-xl border border-slate-200/80 bg-white p-1 shadow-lg shadow-slate-900/[0.04] dark:border-border dark:bg-card dark:shadow-black/20"
          >
            <div className="flex items-center gap-2.5 rounded-lg bg-slate-50/70 p-2.5 dark:bg-secondary/50">
              <Avatar className="h-9 w-9 border border-slate-200/80 dark:border-border">
                <AvatarImage
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                    user.avatarSeed,
                  )}`}
                  alt={user.name}
                />

                <AvatarFallback className="bg-slate-100 text-xs font-semibold text-slate-700 dark:bg-secondary dark:text-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold leading-snug text-slate-900 dark:text-foreground">
                  {user.name}
                </p>

                <p className="truncate text-[11px] leading-tight text-slate-500 dark:text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>

            <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-border" />

            <div className="space-y-0.5 p-1">
              <div className="flex items-center justify-between rounded-lg px-2.5 py-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 dark:bg-secondary">
                    <SunMoon className="h-3.5 w-3.5 text-slate-500 dark:text-muted-foreground" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-700 dark:text-foreground">
                      Appearance
                    </p>

                    <p className="text-[10px] text-slate-400 dark:text-muted-foreground">
                      Light or dark mode
                    </p>
                  </div>
                </div>

                <ThemeToggle />
              </div>

              <DropdownMenuSeparator className="bg-slate-100 dark:bg-border" />

              <DropdownMenuItem
                asChild
                className="cursor-pointer rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 transition-colors focus:bg-slate-100 focus:text-slate-900 dark:text-muted-foreground dark:focus:bg-secondary dark:focus:text-foreground"
              >
                <Link href="/" className="flex items-center gap-2.5">
                  <ArrowLeft className="h-4 w-4 text-slate-400 dark:text-muted-foreground" />
                  <span>Back to website</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer rounded-lg px-2.5 py-2 text-xs font-medium text-rose-600 transition-colors focus:bg-rose-50 focus:text-rose-700 dark:text-rose-400 dark:focus:bg-rose-500/10 dark:focus:text-rose-300"
              >
                <LogOut className="h-4 w-4 text-rose-500 dark:text-rose-400" />
                <span>Log out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}