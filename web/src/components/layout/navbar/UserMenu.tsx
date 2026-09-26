"use client";

import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";

import type { User } from "@supabase/supabase-js";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initials } from "@/lib/utils";

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

type UserMenuProps = {
  user: User;
  profileRole?: string | null;
  onSignOut: () => void;
};

export function UserMenu({
  user,
  profileRole,
  onSignOut,
}: UserMenuProps) {
  const displayName =
    (user.user_metadata?.full_name as string | undefined) ||
    user.email ||
    "Account";

  const dashboardHref = getRoleHome(
    user,
    profileRole
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-border bg-background py-1 pl-1 pr-2.5 transition-colors hover:bg-secondary"
        >
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs">
              {initials(displayName)}
            </AvatarFallback>
          </Avatar>

          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56"
      >
        <DropdownMenuLabel>
          <p className="truncate text-sm font-medium text-foreground">
            {displayName}
          </p>

          {user.email && (
            <p className="truncate text-xs font-normal text-muted-foreground">
              {user.email}
            </p>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={dashboardHref}>
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onSignOut}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}