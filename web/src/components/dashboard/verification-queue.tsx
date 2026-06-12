"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Check, FileText, Inbox, Loader2, X, Mail, Phone, MapPin, BadgeCheck, Award,
  GraduationCap, Languages, ExternalLink, ShieldCheck, ChevronDown, Search,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { decideVerificationRequest } from "@/app/actions/admin-verification-actions";
import { PRACTICE_AREAS } from "@/lib/constants";
import { formatDate, formatPKR, initials } from "@/lib/utils";
import type { AdminVerificationDetail } from "@/lib/data/admin-verifications";

const TABS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
] as const;

function Info({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function VerificationQueue({ requests }: { requests: AdminVerificationDetail[] }) {
  const router = useRouter();
  const reduce = !!useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(null);
  const [tab, setTab] = useState<string>("pending");
  const [query, setQuery] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: requests.length, pending: 0, approved: 0, rejected: 0 };
    for (const r of requests) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [requests]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return requests
      .filter((r) => tab === "all" || r.status === tab)
      .filter((r) =>
        !term ? true : [r.lawyerName, r.email, r.barCouncilNumber, r.city].filter(Boolean).join(" ").toLowerCase().includes(term)
      );
  }, [requests, tab, query]);

  function decide(req: AdminVerificationDetail, status: "approved" | "rejected") {
    setPendingId(req.id);
    startTransition(async () => {
      const result = await decideVerificationRequest(req.id, status);
      setPendingId(null);
      if (!result.ok) {
        toast.error("Could not update verification", { description: result.error });
        return;
      }
      toast.success(status === "approved" ? "Lawyer verified" : "Application rejected", {
        description:
          status === "approved"
            ? `${req.lawyerName} is now verified and visible in the public directory.`
            : `${req.lawyerName}'s verification request was rejected.`,
      });
      router.refresh();
    });
  }

  if (requests.length === 0) {
    return (
      <Card className="border-dashed border-border/80 p-10 text-center">
        <Inbox className="mx-auto h-9 w-9 text-muted-foreground/60" />
        <h2 className="mt-3 font-heading text-base font-semibold text-foreground">No verification requests</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          New lawyer verification submissions will appear here after advocates upload their documents.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <Button
              key={t.value}
              size="sm"
              variant={tab === t.value ? "default" : "outline"}
              className={tab === t.value ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
              onClick={() => setTab(t.value)}
            >
              {t.label}
              {counts[t.value] ? <span className="ml-1.5 text-xs opacity-70">{counts[t.value]}</span> : null}
            </Button>
          ))}
        </div>
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, email, Bar #..." className="h-9 pl-9" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed border-border/80 p-8 text-center text-sm text-muted-foreground">
          No {tab === "all" ? "" : tab} requests match your search.
        </Card>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((req) => {
            const open = openId === req.id;
            const busy = pendingId === req.id && isPending;
            return (
              <Card key={req.id} className="overflow-hidden border-border/80 p-0">
                {/* compact row */}
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : req.id)}
                  aria-expanded={open}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/40"
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="text-xs">{initials(req.lawyerName)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">{req.lawyerName}</p>
                      {req.isVerified && <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-600" />}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {req.professionalTitle ?? "Advocate"} - {req.city ?? "-"} - {formatDate(req.submittedAt)}
                    </p>
                  </div>
                  <StatusBadge status={req.status} className="hidden sm:inline-flex" />
                  <ChevronDown className={`h-4.5 w-4.5 shrink-0 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                </button>

                {/* expandable details */}
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-5 border-t border-border/70 px-4 py-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          <Info icon={Mail} label="Email" value={req.email || "-"} />
                          <Info icon={Phone} label="Phone" value={req.phone || "-"} />
                          <Info icon={MapPin} label="City" value={req.city || "-"} />
                          <Info icon={ShieldCheck} label="Bar Council no." value={req.barCouncilNumber || "-"} />
                          <Info icon={Award} label="Experience" value={`${req.experienceYears} years`} />
                          <Info icon={FileText} label="Online fee" value={req.onlineFee != null ? formatPKR(req.onlineFee) : "-"} />
                        </div>

                        {req.about && (
                          <div>
                            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">About</p>
                            <p className="mt-1 text-sm leading-6 text-foreground">{req.about}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {req.practiceAreas.length > 0 && (
                            <div>
                              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Practice areas</p>
                              <div className="mt-1.5 flex flex-wrap gap-1.5">
                                {req.practiceAreas.map((slug) => (
                                  <Badge key={slug} variant="secondary" className="rounded-full font-normal">
                                    {PRACTICE_AREAS.find((p) => p.slug === slug)?.name ?? slug}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {req.languages.length > 0 && (
                            <div>
                              <p className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground"><Languages className="h-3 w-3" /> Languages</p>
                              <div className="mt-1.5 flex flex-wrap gap-1.5">
                                {req.languages.map((l) => (
                                  <Badge key={l} variant="outline" className="rounded-full font-normal">{l}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {req.education.length > 0 && (
                          <div>
                            <p className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground"><GraduationCap className="h-3 w-3" /> Education</p>
                            <ul className="mt-1.5 space-y-1">
                              {req.education.map((e) => (
                                <li key={e} className="flex items-center gap-2 text-sm text-foreground">
                                  <span className="h-1.5 w-1.5 rounded-full bg-gold" /> {e}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Submitted documents</p>
                          {req.documents.length === 0 ? (
                            <p className="mt-1.5 text-sm text-muted-foreground">No documents were attached.</p>
                          ) : (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {req.documents.map((doc) =>
                                doc.url ? (
                                  <a
                                    key={doc.type + doc.label}
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-gold/50 hover:bg-secondary"
                                  >
                                    <FileText className="h-4 w-4 text-gold" /> {doc.label}
                                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                                  </a>
                                ) : (
                                  <span key={doc.type + doc.label} className="inline-flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
                                    <FileText className="h-4 w-4" /> {doc.label} (unavailable)
                                  </span>
                                )
                              )}
                            </div>
                          )}
                        </div>

                        {req.status === "pending" && (
                          <div className="flex flex-wrap justify-end gap-2 border-t border-border/70 pt-4">
                            <Button size="sm" disabled={busy} variant="outline" className="gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => decide(req, "rejected")}>
                              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />} Reject
                            </Button>
                            <Button size="sm" disabled={busy} className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => decide(req, "approved")}>
                              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Approve &amp; verify
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
