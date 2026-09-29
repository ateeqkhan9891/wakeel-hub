"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { User } from "@supabase/supabase-js";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";

import { AuthActions } from "./navbar/AuthActions";
import { DesktopNav } from "./navbar/DesktopNav";
import { MobileNav } from "./navbar/MobileNav";
import { UserMenu } from "./navbar/UserMenu";

import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

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

export function Navbar() {
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);

  const {
    user,
    role,
    loading,
    signOut,
  } = useCurrentUser();

  const dashboardHref = user
    ? getRoleHome(user, role)
    : "/dashboard/client";

  const handleSignOut = async () => {
    try {
      await signOut();
    } finally {
      setMobileOpen(false);
      router.push("/");
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <DesktopNav />

        <div className="hidden items-center gap-2 md:flex">
          {!loading && user ? (
            <>
              <Button
                asChild
                variant="outline"
                className="gap-2"
              >
                <Link href={dashboardHref}>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>

              <UserMenu
                user={user}
                profileRole={role}
                onSignOut={handleSignOut}
              />
            </>
          ) : !loading ? (
            <AuthActions />
          ) : null}
        </div>

        <MobileNav
          open={mobileOpen}
          onOpenChange={setMobileOpen}
          user={user}
          profileRole={role}
          ready={!loading}
          onSignOut={handleSignOut}
        />
      </div>
    </header>
  );
}

export default Navbar;
