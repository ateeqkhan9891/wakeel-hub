"use client";

import { useMemo, useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import {
  Award,
  BadgeCheck,
  Check,
  ChevronDown,
  ExternalLink,
  FileText,
  GraduationCap,
  Inbox,
  Languages,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

import { toast } from "sonner";

import { decideVerificationRequest } from "@/app/actions/admin-verification-actions";
import { AdminVerificationDetail } from "@/lib/data/admin-verifications";
import { PRACTICE_AREAS } from "@/lib/constants";
import { formatDate, formatPKR, initials } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";

const TABS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
] as const;

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-50 text-gold">
        <Icon className="h-3.5 w-3.5" aria-hidden />
      </span>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-xs font-medium text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

export function VerificationQueue({
  requests,
}: {
  requests: AdminVerificationDetail[];
}) {
  const router = useRouter();
  const reduce = !!useReducedMotion();

  const [openId, setOpenId] = useState<string | null>(null);
  const [tab, setTab] = useState<string>("pending");
  const [query, setQuery] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const counts = useMemo(() => {
    const result: Record<string, number> = {
      all: requests.length,
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    for (const request of requests) {
      result[request.status] = (result[request.status] ?? 0) + 1;
    }

    return result;
  }, [requests]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return requests
      .filter((request) => tab === "all" || request.status === tab)
      .filter((request) => {
        if (!term) return true;

        return [
          request.lawyerName,
          request.email,
          request.barCouncilNumber,
          request.city,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term);
      });
  }, [requests, tab, query]);

  function decide(
    request: AdminVerificationDetail,
    status: "approved" | "rejected",
  ) {
    setPendingId(request.id);

    startTransition(async () => {
      const result = await decideVerificationRequest(
        request.id,
        status,
      );

      setPendingId(null);

      if (!result.ok) {
        toast.error("Could not update verification", {
          description: result.error,
        });
        return;
      }

      toast.success(
        status === "approved"
          ? "Lawyer verified"
          : "Application rejected",
        {
          description:
            status === "approved"
              ? `${request.lawyerName} is now verified and visible in the public directory.`
              : `${request.lawyerName}'s verification request was rejected.`,
        },
      );

      router.refresh();
    });
  }

  if (requests.length === 0) {
    return (
      <Card className="border-dashed border-slate-200 p-8 text-center shadow-none">
        <Inbox className="mx-auto h-8 w-8 text-slate-300" />

        <h2 className="mt-3 font-heading text-sm font-semibold text-slate-900">
          No verification requests
        </h2>

        <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-slate-500">
          New lawyer verification submissions will appear here after
          advocates upload their documents.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2.5 rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm shadow-slate-200/20 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-1 overflow-x-auto">
          {TABS.map((item) => {
            const active = tab === item.value;
            const count = counts[item.value];

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setTab(item.value)}
                className={[
                  "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")}
              >
                {item.label}

                <span
                  className={[
                    "text-[10px]",
                    active
                      ? "text-primary-foreground/70"
                      : "text-slate-400",
                  ].join(" ")}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
            aria-hidden
          />

          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email, Bar #..."
            className="h-8 border-slate-200 bg-slate-50 pl-9 text-xs shadow-none focus-visible:bg-white"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed border-slate-200 p-8 text-center text-xs text-slate-500 shadow-none">
          No {tab === "all" ? "" : tab} requests match your search.
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((request) => {
            const open = openId === request.id;
            const busy = pendingId === request.id && isPending;

            return (
              <Card
                key={request.id}
                className="overflow-hidden border-slate-200 p-0 shadow-sm shadow-slate-200/20"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenId(open ? null : request.id)
                  }
                  aria-expanded={open}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="bg-primary/8 text-xs font-semibold text-primary">
                      {initials(request.lawyerName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {request.lawyerName}
                      </p>

                      {request.isVerified && (
                        <BadgeCheck
                          className="h-3.5 w-3.5 shrink-0 text-emerald-600"
                          aria-label="Verified"
                        />
                      )}
                    </div>

                    <p className="mt-0.5 truncate text-[11px] text-slate-400">
                      {request.professionalTitle ?? "Advocate"}{" "}
                      <span className="text-slate-300">·</span>{" "}
                      {request.city ?? "-"}{" "}
                      <span className="text-slate-300">·</span>{" "}
                      {formatDate(request.submittedAt)}
                    </p>
                  </div>

                  <StatusBadge
                    status={request.status}
                    className="hidden sm:inline-flex"
                  />

                  <ChevronDown
                    className={[
                      "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300",
                      open ? "rotate-180" : "",
                    ].join(" ")}
                    aria-hidden
                  />
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: reduce ? 0 : 0.25,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-4 border-t border-slate-100 px-4 py-4">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          <Info
                            icon={Mail}
                            label="Email"
                            value={request.email || "-"}
                          />

                          <Info
                            icon={Phone}
                            label="Phone"
                            value={request.phone || "-"}
                          />

                          <Info
                            icon={MapPin}
                            label="City"
                            value={request.city || "-"}
                          />

                          <Info
                            icon={ShieldCheck}
                            label="Bar Council no."
                            value={request.barCouncilNumber || "-"}
                          />

                          <Info
                            icon={Award}
                            label="Experience"
                            value={`${request.experienceYears} years`}
                          />

                          <Info
                            icon={FileText}
                            label="Online fee"
                            value={
                              request.onlineFee != null
                                ? formatPKR(request.onlineFee)
                                : "-"
                            }
                          />
                        </div>

                        {request.about && (
                          <div className="border-t border-slate-100 pt-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                              About
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-600">
                              {request.about}
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-3 sm:grid-cols-2">
                          {request.practiceAreas.length > 0 && (
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                                Practice areas
                              </p>

                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {request.practiceAreas.map((slug) => (
                                  <Badge
                                    key={slug}
                                    variant="secondary"
                                    className="rounded-md px-2 py-0.5 text-[10px] font-normal"
                                  >
                                    {PRACTICE_AREAS.find(
                                      (practiceArea) =>
                                        practiceArea.slug === slug,
                                    )?.name ?? slug}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {request.languages.length > 0 && (
                            <div>
                              <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                                <Languages
                                  className="h-3 w-3"
                                  aria-hidden
                                />
                                Languages
                              </p>

                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {request.languages.map((language) => (
                                  <Badge
                                    key={language}
                                    variant="outline"
                                    className="rounded-md px-2 py-0.5 text-[10px] font-normal"
                                  >
                                    {language}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {request.education.length > 0 && (
                          <div className="border-t border-slate-100 pt-3">
                            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                              <GraduationCap
                                className="h-3 w-3"
                                aria-hidden
                              />
                              Education
                            </p>

                            <ul className="mt-1.5 space-y-1">
                              {request.education.map((education) => (
                                <li
                                  key={education}
                                  className="flex items-center gap-2 text-xs text-slate-700"
                                >
                                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                                  {education}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="border-t border-slate-100 pt-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                            Submitted documents
                          </p>

                          {request.documents.length === 0 ? (
                            <p className="mt-1.5 text-xs text-slate-500">
                              No documents were attached.
                            </p>
                          ) : (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {request.documents.map((document) =>
                                document.url ? (
                                  <a
                                    key={
                                      document.type + document.label
                                    }
                                    href={document.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-gold/50 hover:bg-slate-50"
                                  >
                                    <FileText
                                      className="h-3.5 w-3.5 text-gold"
                                      aria-hidden
                                    />

                                    {document.label}

                                    <ExternalLink
                                      className="h-3 w-3 text-slate-400"
                                      aria-hidden
                                    />
                                  </a>
                                ) : (
                                  <span
                                    key={
                                      document.type + document.label
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-200 px-2.5 py-1.5 text-xs text-slate-400"
                                  >
                                    <FileText
                                      className="h-3.5 w-3.5"
                                      aria-hidden
                                    />

                                    {document.label} unavailable
                                  </span>
                                ),
                              )}
                            </div>
                          )}
                        </div>

                        {request.status === "pending" && (
                          <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-3">
                            <Button
                              size="sm"
                              disabled={busy}
                              variant="outline"
                              className="h-8 gap-1.5 border-rose-200 px-3 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                              onClick={() =>
                                decide(request, "rejected")
                              }
                            >
                              {busy ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <X className="h-3.5 w-3.5" />
                              )}
                              Reject
                            </Button>

                            <Button
                              size="sm"
                              disabled={busy}
                              className="h-8 gap-1.5 bg-primary px-3 text-xs text-primary-foreground hover:bg-primary/90"
                              onClick={() =>
                                decide(request, "approved")
                              }
                            >
                              {busy ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Check className="h-3.5 w-3.5" />
                              )}
                              Approve & verify
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