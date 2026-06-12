"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, ChevronDown, LayoutDashboard, LogOut, Scale, ShieldCheck, UserRound } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { cn, initials } from "@/lib/utils";

const navLinks = [
  { href: "/find-lawyers", label: "Find Lawyers" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const ROLE_HOME: Record<string, string> = {
  client: "/dashboard/client",
  lawyer: "/dashboard/lawyer",
  admin: "/dashboard/admin",
};

const getStartedOptions = [
  {
    href: "/register/client",
    eyebrow: "For Clients",
    title: "For Clients",
    description: "Find, compare, and hire verified advocates across Pakistan.",
    icon: UserRound,
  },
  {
    href: "/register/lawyer",
    eyebrow: "For Lawyers",
    title: "For Lawyers",
    description: "Grow your legal practice and connect with new clients.",
    icon: Scale,
  },
] as const;

function roleHome(user: User | null, profileRole?: string | null) {
  const role = profileRole ?? (user?.user_metadata?.role as string | undefined) ?? "client";
  return ROLE_HOME[role] ?? "/dashboard/client";
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profileRole, setProfileRole] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    async function loadRole(currentUser: User | null) {
      if (!currentUser) {
        setProfileRole(null);
        return;
      }
      try {
        const { data } = await supabase.from("profiles").select("role").eq("id", currentUser.id).maybeSingle();
        const profile = data as { role?: string } | null;
        setProfileRole(profile?.role ?? null);
      } catch {
        setProfileRole(null);
      }
    }

    supabase.auth
      .getSession()
      .then(({ data }) => {
        const currentUser = data.session?.user ?? null;
        setUser(currentUser);
        setReady(true);
        void loadRole(currentUser);
      })
      .catch(() => {
        setUser(null);
        setProfileRole(null);
        setReady(true);
      })
      .finally(() => setReady(true));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setReady(true);
      window.setTimeout(() => {
        void loadRole(currentUser);
      }, 0);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  const displayName = (user?.user_metadata?.full_name as string | undefined) || user?.email || "Account";

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                pathname === link.href && "bg-secondary text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {/* Until auth state resolves, render nothing to avoid a flash of the wrong buttons. */}
          {(!ready || !user) && (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <DropdownMenu open={startOpen} onOpenChange={setStartOpen}>
                <DropdownMenuTrigger asChild>
                  <Button className="gap-1.5 rounded-full bg-[#0F2347] px-5 text-white shadow-[0_12px_24px_rgba(15,35,71,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0A1A36] hover:shadow-[0_16px_32px_rgba(15,35,71,0.22)] focus-visible:ring-2 focus-visible:ring-[#D4AF37]/40">
                    Get Started
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", startOpen && "rotate-180")} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={12}
                  className="w-[320px] overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2 text-slate-950 shadow-[0_24px_60px_rgba(15,35,71,0.16)] ring-1 ring-[#0F2347]/5 duration-200 data-open:zoom-in-95 data-closed:zoom-out-95"
                >
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-1"
                  >
                    {getStartedOptions.map((option, index) => (
                      <div key={option.href}>
                        {index > 0 && <DropdownMenuSeparator className="mx-3 my-1 bg-slate-200/80" />}
                        <DropdownMenuItem asChild className="cursor-pointer rounded-xl p-0 focus:bg-transparent">
                          <Link
                            href={option.href}
                            className="group block rounded-xl p-3 outline-none transition-colors duration-200 hover:bg-[rgba(15,35,71,0.06)] focus-visible:bg-[rgba(15,35,71,0.06)]"
                          >
                            <motion.div
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.99 }}
                              transition={{ duration: 0.16, ease: "easeOut" }}
                              className="flex gap-3"
                            >
                              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[rgba(212,175,55,0.10)] text-[#0F2347] shadow-sm shadow-[#D4AF37]/10 transition-colors duration-200 group-hover:border-[#D4AF37]/40 group-hover:bg-[rgba(212,175,55,0.16)] group-hover:text-[#D4AF37]">
                                <option.icon className="h-5 w-5" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#D4AF37]">
                                  {option.eyebrow}
                                </span>
                                <span className="mt-1 block text-sm font-semibold text-[#0F2347]">{option.title}</span>
                                <span className="mt-1 block text-sm leading-5 text-slate-600">{option.description}</span>
                              </span>
                            </motion.div>
                          </Link>
                        </DropdownMenuItem>
                      </div>
                    ))}

                    <div className="mt-2 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-600">
                      <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
                      Trusted legal marketplace for Pakistan
                    </div>
                  </motion.div>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {ready && user && (
            <>
              <Button asChild variant="outline" className="gap-2">
                <Link href={roleHome(user, profileRole)}>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-border bg-background py-1 pl-1 pr-2.5 transition-colors hover:bg-secondary">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-xs">{initials(displayName)}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
                    {user.email && <p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={roleHome(user, profileRole)}>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[340px]">
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
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                    pathname === link.href && "bg-secondary text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-3 h-px bg-border" />

              {(!ready || !user) && (
                <>
                  <Button variant="outline" asChild onClick={() => setOpen(false)}>
                    <Link href="/login">Log in</Link>
                  </Button>
                  <div className="mt-2 space-y-2">
                    {getStartedOptions.map((option) => (
                      <Link
                        key={option.href}
                        href={option.href}
                        onClick={() => setOpen(false)}
                        className="group flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm shadow-slate-950/[0.03] transition-all hover:-translate-y-0.5 hover:border-[#D4AF37]/40 hover:bg-[rgba(15,35,71,0.04)]"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(212,175,55,0.12)] text-[#0F2347] transition-colors group-hover:text-[#D4AF37]">
                          <option.icon className="h-5 w-5" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-[#0F2347]">{option.title}</span>
                          <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{option.description}</span>
                        </span>
                      </Link>
                    ))}
                    <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-medium text-muted-foreground">
                      <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
                      Trusted legal marketplace for Pakistan
                    </div>
                  </div>
                </>
              )}

              {ready && user && (
                <>
                  <Button asChild className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setOpen(false)}>
                    <Link href={roleHome(user, profileRole)}>
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
