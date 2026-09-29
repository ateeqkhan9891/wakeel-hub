"use client";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";

import {
  Check,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  UserRoundX,
  ExternalLink,
  Eye,
  Users,
  X,
} from "lucide-react";

import { toast } from "sonner";

import { setUserActive } from "@/app/actions/admin-users";

import type { AdminUser } from "@/lib/data/admin";
import { cn, formatDate, initials } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ROLE_LABEL: Record<string, string> = {
  client: "Client",
  lawyer: "Lawyer",
  admin: "Admin",
};

const ROLE_STYLES: Record<string, string> = {
  client: "bg-slate-100 text-slate-600",
  lawyer: "bg-primary/8 text-primary",
  admin: "bg-amber-50 text-amber-700",
};

export function AdminUsersTable({ users }: { users: AdminUser[] }) {

  const router = useRouter();


  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [city, setCity] = useState("all");

  

  const cities = useMemo(
    () =>
      [
        ...new Set(
          users
            .map((user) => user.city)
            .filter(Boolean) as string[],
        ),
      ].sort(),
    [users],
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return users.filter((user) => {
      if (role !== "all" && user.role !== role) return false;

      if (city !== "all" && user.city !== city) return false;

      if (
        status === "verified" &&
        !(user.role === "lawyer" && user.isVerified)
      ) {
        return false;
      }

      if (
        status === "unverified" &&
        !(user.role === "lawyer" && !user.isVerified)
      ) {
        return false;
      }

      if (
        term &&
        ![user.name, user.email, user.city]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term)
      ) {
        return false;
      }

      return true;
    });
  }, [users, query, role, status, city]);

  const hasFilters =
    Boolean(query) ||
    role !== "all" ||
    status !== "all" ||
    city !== "all";

  const clearFilters = () => {
    setQuery("");
    setRole("all");
    setStatus("all");
    setCity("all");
  };

  return (
    <div className="space-y-1">
      <Card className="border-slate-200 p-4 ring-0 sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />

            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, email or city..."
              aria-label="Search users"
              className="h-10 rounded-lg border-slate-200 bg-slate-50/60 pl-10 text-sm placeholder:text-slate-400 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 hidden items-center gap-1.5 text-xs font-medium text-slate-400 lg:flex">
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
              Filters
            </span>

            <FilterSelect
              value={role}
              onChange={setRole}
              placeholder="Role"
              options={[
                { v: "all", l: "All roles" },
                { v: "client", l: "Clients" },
                { v: "lawyer", l: "Lawyers" },
                { v: "admin", l: "Admins" },
              ]}
            />

            <FilterSelect
              value={status}
              onChange={setStatus}
              placeholder="Status"
              options={[
                { v: "all", l: "All statuses" },
                { v: "verified", l: "Verified" },
                { v: "unverified", l: "Unverified" },
              ]}
            />

            <FilterSelect
              value={city}
              onChange={setCity}
              placeholder="City"
              options={[
                { v: "all", l: "All cities" },
                ...cities.map((item) => ({
                  v: item,
                  l: item,
                })),
              ]}
            />

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
                Clear
              </button>
            )}
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden border-slate-200 p-0 ring-0">
        {filtered.length === 0 ? (
          <EmptyState hasFilters={hasFilters} onClear={clearFilters} />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 bg-slate-50/70 hover:bg-slate-50/70">
                  <TableHead className="h-10 pl-5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    User
                  </TableHead>

                  <TableHead className="h-10 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Role
                  </TableHead>

                  <TableHead className="h-10 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Location
                  </TableHead>

                  <TableHead className="h-10 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Status
                  </TableHead>

                  <TableHead className="h-10 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Joined
                  </TableHead>

                  <TableHead className="h-10 w-12 pr-3 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
               {filtered.map((user) => (
  <UserRow
    key={user.id}
    user={user}
    onUpdated={() => router.refresh()}
  />
))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}

function UserRow({
  user,
  onUpdated,
}: {
  user: AdminUser;
  onUpdated: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const roleLabel = ROLE_LABEL[user.role] ?? user.role;

  const roleStyle =
    ROLE_STYLES[user.role] ?? "bg-slate-100 text-slate-600";

  const handleStatusChange = (isActive: boolean) => {
    startTransition(async () => {
      const result = await setUserActive(user.id, isActive);

    if (!result.ok) {
      toast.error(result.error ?? "Unable to update account status.");
      return;
    }

    toast.success(
      isActive
        ? "Account activated successfully."
        : "Account deactivated successfully.",
    );

    onUpdated();
    });
  };

  return (
    <TableRow className="group border-slate-100 transition-colors hover:bg-slate-50/60">
      <TableCell className="py-3.5 pl-5">
        <div className="flex min-w-[240px] items-center gap-3">
          <Avatar className="h-9 w-9 shrink-0 rounded-lg">
            <AvatarFallback className="rounded-lg bg-primary/8 text-xs font-semibold text-primary">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {user.name}
            </p>

            <p className="mt-0.5 truncate text-xs text-slate-400">
              {user.email}
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <span
          className={cn(
            "inline-flex rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]",
            roleStyle,
          )}
        >
          {roleLabel}
        </span>
      </TableCell>

      <TableCell>
        <span className="text-sm text-slate-500">
          {user.city ?? "—"}
        </span>
      </TableCell>

      <TableCell>
        <AccountStatus user={user} />
      </TableCell>

      <TableCell>
        <span className="whitespace-nowrap text-xs text-slate-500">
          {formatDate(user.createdAt)}
        </span>
      </TableCell>

      <TableCell className="pr-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              disabled={isPending}
              aria-label={`Actions for ${user.name}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-50"
            >
              <MoreHorizontal className="h-4 w-4" aria-hidden />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem disabled>
        <Eye className="h-4 w-4" />
        View details
        <span className="ml-auto text-[10px] text-slate-400">Not Allowed</span>
      </DropdownMenuItem>

    {user.isActive ? (
      <DropdownMenuItem
        disabled={isPending}
        onSelect={() => handleStatusChange(false)}
        className="text-rose-600 focus:text-rose-600"
      >
        <UserRoundX className="h-4 w-4" />
        Deactivate account
      </DropdownMenuItem>
    ) : (
      <DropdownMenuItem
        disabled={isPending}
        onSelect={() => handleStatusChange(true)}
        className="text-emerald-600 focus:text-emerald-600"
      >
        <Check className="h-4 w-4" />
        Activate account
      </DropdownMenuItem>
    )}
  </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function AccountStatus({ user }: { user: AdminUser }) {
  if (!user.isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
        Inactive
      </span>
    );
  }

  if (user.role === "lawyer") {
    return (
      <div className="flex flex-col items-start gap-1">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Active
        </span>

        <StatusBadge
          status={user.isVerified ? "approved" : "pending"}
        />
      </div>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Active
    </span>
  );
}

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        <Users className="h-5 w-5" aria-hidden />
      </span>

      <p className="mt-4 text-sm font-semibold text-slate-800">
        No users found
      </p>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
        {hasFilters
          ? "No accounts match the current search and filter combination."
          : "There are no registered accounts to display yet."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 text-xs font-semibold text-primary hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: { v: string; l: string }[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-10 w-auto min-w-[8.5rem] rounded-lg border-slate-200 bg-white text-sm">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.v} value={option.v}>
            {option.l}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}