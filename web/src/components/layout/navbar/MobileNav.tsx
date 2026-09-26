"use client";

import Link from "next/link";
import { Menu, LogOut, Scale, ShieldCheck, LayoutDashboard, UserRound } from "lucide-react";

import type { User } from "@supabase/supabase-js";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/find-lawyers", label: "Find Lawyers" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const getStartedOptions = [
  {
    href: "/register/client",
    title: "For Clients",
    description:
      "Find, compare, and hire verified advocates across Pakistan.",
    icon: UserRound,
  },
  {
    href: "/register/lawyer",
    title: "For Lawyers",
    description:
      "Grow your legal practice and connect with new clients.",
    icon: Scale,
  },
];

const ROLE_HOME: Record<string, string> = {
  client: "/dashboard/client",
  lawyer: "/dashboard/lawyer",
  admin: "/dashboard/admin",
};

function getRoleHome(
  user: User,
  profileRole?: string | null
) {
  const role =
    profileRole ??
    (user.user_metadata?.role as string | undefined) ??
    "client";

  return ROLE_HOME[role] ?? "/dashboard/client";
}

type MobileNavProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  profileRole?: string | null;
  ready: boolean;
  onSignOut: () => void;
};

export function MobileNav({
  open,
  onOpenChange,
  user,
  profileRole,
  ready,
  onSignOut,
}: MobileNavProps) {
  const dashboardHref = user
    ? getRoleHome(user, profileRole)
    : "/dashboard/client";

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[300px] sm:w-[340px]"
      >
        <SheetHeader>
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 flex flex-col gap-1 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => onOpenChange(false)}
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}

          <div className="my-3 h-px bg-border" />

          {(!ready || !user) && (
            <>
              <Button
                variant="outline"
                asChild
                onClick={() => onOpenChange(false)}
              >
                <Link href="/login">Log in</Link>
              </Button>

              <div className="mt-2 space-y-2">
                {getStartedOptions.map((option) => {
                  const Icon = option.icon;

                  return (
                    <Link
                      key={option.href}
                      href={option.href}
                      onClick={() => onOpenChange(false)}
                      className="group flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm shadow-slate-950/[0.03] transition-all hover:-translate-y-0.5 hover:border-[#D4AF37]/40 hover:bg-[rgba(15,35,71,0.04)]"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(212,175,55,0.12)] text-[#0F2347] transition-colors group-hover:text-[#D4AF37]">
                        <Icon className="h-5 w-5" />
                      </span>

                      <span>
                        <span className="block text-sm font-semibold text-[#0F2347]">
                          {option.title}
                        </span>

                        <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                          {option.description}
                        </span>
                      </span>
                    </Link>
                  );
                })}

                <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-medium text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
                  Trusted legal marketplace for Pakistan
                </div>
              </div>
            </>
          )}

          {ready && user && (
            <>
              <Button
                asChild
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => onOpenChange(false)}
              >
                <Link href={dashboardHref}>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>

              <Button
                variant="outline"
                className="gap-2"
                onClick={onSignOut}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}