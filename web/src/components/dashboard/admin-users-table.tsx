"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import type { AdminUser } from "@/lib/data/admin";
import { cn, formatDate, initials } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ROLE_LABEL: Record<string, string> = { client: "Client", lawyer: "Lawyer", admin: "Admin" };

export function AdminUsersTable({ users }: { users: AdminUser[] }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [city, setCity] = useState("all");

  const cities = useMemo(() => [...new Set(users.map((u) => u.city).filter(Boolean) as string[])].sort(), [users]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return users.filter((u) => {
      if (role !== "all" && u.role !== role) return false;
      if (city !== "all" && u.city !== city) return false;
      if (status === "verified" && !(u.role === "lawyer" && u.isVerified)) return false;
      if (status === "unverified" && !(u.role === "lawyer" && !u.isVerified)) return false;
      if (term && ![u.name, u.email, u.city].filter(Boolean).join(" ").toLowerCase().includes(term)) return false;
      return true;
    });
  }, [users, query, role, status, city]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, city..." aria-label="Search users" className="h-10 rounded-xl border-slate-200 pl-10 text-sm placeholder:text-slate-400 hover:border-slate-300" />
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterSelect value={role} onChange={setRole} placeholder="Role" options={[{ v: "all", l: "All roles" }, { v: "client", l: "Clients" }, { v: "lawyer", l: "Lawyers" }, { v: "admin", l: "Admins" }]} />
          <FilterSelect value={status} onChange={setStatus} placeholder="Status" options={[{ v: "all", l: "All statuses" }, { v: "verified", l: "Verified" }, { v: "unverified", l: "Unverified" }]} />
          <FilterSelect value={city} onChange={setCity} placeholder="City" options={[{ v: "all", l: "All cities" }, ...cities.map((c) => ({ v: c, l: c }))]} />
        </div>
      </div>

      <Card className="overflow-hidden border-slate-200 p-0 ring-0">
        {filtered.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500">No users match your filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/8 text-xs font-semibold text-primary">{initials(u.name)}</AvatarFallback></Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-950">{u.name}</p>
                          <p className="truncate text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium", u.role === "lawyer" ? "bg-primary/8 text-primary" : u.role === "admin" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600")}>{ROLE_LABEL[u.role] ?? u.role}</span></TableCell>
                    <TableCell className="text-sm text-slate-500">{u.city ?? "-"}</TableCell>
                    <TableCell>{u.role === "lawyer" ? <StatusBadge status={u.isVerified ? "approved" : "pending"} /> : <span className="text-xs text-slate-400">Active</span>}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-slate-500">{formatDate(u.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
      <p className="text-xs text-slate-400">Showing {filtered.length} of {users.length} users.</p>
    </div>
  );
}

function FilterSelect({ value, onChange, placeholder, options }: { value: string; onChange: (v: string) => void; placeholder: string; options: { v: string; l: string }[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-10 w-auto min-w-[8.5rem] rounded-xl border-slate-200 text-sm"><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>{options.map((o) => <SelectItem key={o.v} value={o.v}>{o.l}</SelectItem>)}</SelectContent>
    </Select>
  );
}
