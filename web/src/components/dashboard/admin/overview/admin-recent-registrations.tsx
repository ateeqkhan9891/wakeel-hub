import { ArrowUpRight, UserPlus } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { AdminSection } from "@/components/dashboard/admin/admin-ui";
import type { AdminUser } from "@/lib/data/admin";
import { formatDate, initials } from "@/lib/utils";

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

type AdminRecentRegistrationsProps = {
  users: AdminUser[];
};

export function AdminRecentRegistrations({
  users,
}: AdminRecentRegistrationsProps) {
  return (
    <AdminSection
      title="New registrations"
      icon={UserPlus}
      action={
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="h-8 gap-1.5 px-2 text-xs font-medium text-primary hover:bg-primary/5 hover:text-primary"
        >
          <Link href="/dashboard/admin/users">
            View all
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </Button>
      }
    >
      {users.length === 0 ? (
        <EmptyRegistrations />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="hidden grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 border-b border-slate-200 bg-slate-50/70 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 sm:grid">
            <span>User</span>
            <span>Role</span>
            <span>Status</span>
          </div>

          <div className="divide-y divide-slate-100">
            {users.slice(0, 6).map((user) => (
              <RegistrationRow key={user.id} user={user} />
            ))}
          </div>
        </div>
      )}
    </AdminSection>
  );
}

function RegistrationRow({ user }: { user: AdminUser }) {
  const roleLabel = ROLE_LABEL[user.role] ?? user.role;
  const roleStyle =
    ROLE_STYLES[user.role] ?? "bg-slate-100 text-slate-600";

  return (
    <div className="group grid grid-cols-1 gap-3 px-4 py-3.5 transition-colors hover:bg-slate-50/70 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="h-9 w-9 shrink-0 rounded-lg">
          <AvatarFallback className="rounded-lg bg-primary/8 text-xs font-semibold text-primary">
            {initials(user.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">
            {user.name}
          </p>

          <p className="mt-0.5 truncate text-[11px] text-slate-400">
            {user.city ?? "Location unavailable"} · Joined{" "}
            {formatDate(user.createdAt)}
          </p>
        </div>
      </div>

      <span
        className={`w-fit rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${roleStyle}`}
      >
        {roleLabel}
      </span>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400 sm:hidden">
          Status
        </span>

        {user.role === "lawyer" ? (
          <StatusBadge
            status={user.isVerified ? "approved" : "pending"}
          />
        ) : (
          <span className="text-xs font-medium text-emerald-600">
            Active
          </span>
        )}
      </div>
    </div>
  );
}

function EmptyRegistrations() {
  return (
    <div className="flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
        <UserPlus className="h-4 w-4" aria-hidden />
      </span>

      <p className="mt-3 text-sm font-semibold text-slate-700">
        No registrations yet
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        New clients and lawyers will appear here as they join the platform.
      </p>
    </div>
  );
}