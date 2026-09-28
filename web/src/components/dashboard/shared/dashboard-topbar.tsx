"use client";

import Link from "next/link";

import {
  ArrowLeft,
  Bell,
  CalendarCheck,
  ChevronDown,
  LogOut,
  Menu,
  MessageSquare,
  Scale,
  SunMoon,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
    role === "admin"
      ? "Administrator"
      : role === "lawyer"
        ? "Lawyer"
        : "Client";

  const firstName = user.name.split(" ")[0] || "there";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-xl border-slate-200 bg-white shadow-sm lg:hidden"
          onClick={onMenuOpen}
          aria-label="Open dashboard menu"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <div className="hidden min-w-0 sm:block">
          <p className="text-sm font-medium text-slate-500">
            Welcome back,{" "}
            <span className="font-semibold text-slate-950">
              {firstName}
            </span>
          </p>

          <p className="mt-0.5 text-[11px] text-slate-400">
            Here&apos;s your WakeelHub overview.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="relative h-9 w-9 rounded-xl border-slate-200 bg-white shadow-sm hover:bg-slate-50"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4 text-slate-600" />

              {unreadNotifications > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full border-2 border-white bg-amber-500 px-1 text-[9px] font-bold leading-none text-white">
                  {unreadNotifications > 99
                    ? "99+"
                    : unreadNotifications}
                </span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            sideOffset={8}
            className="w-[360px] overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-xl shadow-slate-900/[0.06]"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
              <div>
                <h3 className="text-sm font-semibold text-slate-950">
                  Notifications
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Stay updated with your account activity.
                </p>
              </div>

              {unreadNotifications > 0 && (
                <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
                  {unreadNotifications} unread
                </span>
              )}
            </div>

            {unreadNotifications > 0 ? (
              <div className="divide-y divide-slate-100">
                <div className="flex gap-3 px-4 py-3.5 transition-colors hover:bg-slate-50">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                    <CalendarCheck className="h-4 w-4" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800">
                      New activity
                    </p>
                    <p className="mt-0.5 text-[11px] leading-5 text-slate-500">
                      You have new activity that needs your attention.
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Recently
                    </p>
                  </div>

                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                </div>

                {unreadNotifications > 1 && (
                  <div className="flex gap-3 px-4 py-3.5 transition-colors hover:bg-slate-50">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      {role === "lawyer" ? (
                        <Scale className="h-4 w-4" />
                      ) : (
                        <MessageSquare className="h-4 w-4" />
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800">
                        More notifications
                      </p>
                      <p className="mt-0.5 text-[11px] leading-5 text-slate-500">
                        You have additional unread notifications.
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        Recently
                      </p>
                    </div>

                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                  <Bell className="h-5 w-5" />
                </span>

                <p className="mt-3 text-sm font-semibold text-slate-800">
                  You&apos;re all caught up
                </p>

                <p className="mt-1 max-w-[240px] text-xs leading-5 text-slate-500">
                  You don&apos;t have any new notifications right now.
                </p>
              </div>
            )}

            <div className="border-t border-slate-100 bg-slate-50/50 p-2">
              <Link
                href={`/dashboard/${role}/notifications`}
                className="flex w-full items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                View all notifications
              </Link>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2.5 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 data-[state=open]:border-slate-300 data-[state=open]:bg-slate-50"
              aria-label="Open account menu"
            >
              <div className="relative">
                <Avatar className="h-7 w-7 border border-slate-200">
                  <AvatarImage
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                      user.avatarSeed,
                    )}`}
                    alt={user.name}
                  />

                  <AvatarFallback className="bg-slate-100 text-[10px] font-semibold text-slate-700">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-[1.5px] border-white bg-emerald-500" />
              </div>

              <div className="hidden min-w-0 text-left sm:block">
                <p className="max-w-[130px] truncate text-xs font-semibold leading-tight text-slate-800">
                  {user.name}
                </p>

                <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  {roleLabel}
                </p>
              </div>

              <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180 sm:block" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-64 rounded-2xl border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/[0.06]"
          >
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <Avatar className="h-10 w-10 border border-slate-200">
                <AvatarImage
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                    user.avatarSeed,
                  )}`}
                  alt={user.name}
                />

                <AvatarFallback className="bg-white text-xs font-semibold text-slate-700">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-900">
                  {user.name}
                </p>

                <p className="mt-0.5 truncate text-[11px] text-slate-500">
                  {user.email}
                </p>

                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  {roleLabel}
                </p>
              </div>
            </div>

            <DropdownMenuSeparator className="my-1.5 bg-slate-100" />

            <div className="space-y-0.5">
              <div className="flex items-center justify-between rounded-xl px-2.5 py-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                    <SunMoon className="h-3.5 w-3.5 text-slate-500" />
                  </span>

                  <div>
                    <p className="text-xs font-medium text-slate-700">
                      Appearance
                    </p>

                    <p className="text-[10px] text-slate-400">
                      Light or dark mode
                    </p>
                  </div>
                </div>

                <ThemeToggle />
              </div>

              <DropdownMenuSeparator className="my-1 bg-slate-100" />

              <DropdownMenuItem
                asChild
                className="cursor-pointer rounded-xl px-2.5 py-2.5 text-xs font-medium text-slate-700 focus:bg-slate-100 focus:text-slate-950"
              >
                <Link href="/" className="flex items-center gap-2.5">
                  <ArrowLeft className="h-4 w-4 text-slate-400" />
                  <span>Back to website</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer rounded-xl px-2.5 py-2.5 text-xs font-medium text-rose-600 focus:bg-rose-50 focus:text-rose-700"
              >
                <LogOut className="h-4 w-4 text-rose-500" />
                <span>Log out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}