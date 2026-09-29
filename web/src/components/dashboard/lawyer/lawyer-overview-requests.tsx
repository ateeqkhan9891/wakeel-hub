"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, MapPin, Phone, Video, X } from "lucide-react";
import { toast } from "sonner";

import { respondToBooking } from "@/app/actions/booking-actions";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { MODE_LABEL, type BookingRow } from "@/lib/data/booking-types";
import type { ConsultationModeEnum } from "@/lib/supabase/types";
import { formatDate, formatPKR } from "@/lib/utils";

const MODE_ICON: Record<ConsultationModeEnum, typeof Video> = {
  online: Video,
  phone: Phone,
  in_person: MapPin,
};

export function LawyerOverviewRequests({ requests }: { requests: BookingRow[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function respond(booking: BookingRow, decision: "accept" | "reject") {
    setPendingId(booking.id);
    startTransition(async () => {
      const result = await respondToBooking(booking.id, decision);
      setPendingId(null);

      if (!result.ok) {
        if (result.requireAuth) {
          router.push("/login");
          return;
        }
        toast.error("Could not update request", { description: result.error });
        return;
      }

      toast.success(decision === "accept" ? "Request accepted" : "Request declined", {
        description: `${booking.client_name ?? "Client"} has been notified.`,
      });
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => {
        const ModeIcon = MODE_ICON[request.mode];
        const busy = pendingId === request.id && isPending;

        return (
          <div key={request.id} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm shadow-slate-200/40 transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white sm:h-11 sm:w-11">
                  <ModeIcon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="min-w-0 font-heading text-sm font-semibold text-slate-950">{request.client_name ?? "Client"}</p>
                    <StatusBadge status={request.status} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {[request.practice_area_name, MODE_LABEL[request.mode], request.client_city].filter(Boolean).join(" - ") || "Consultation request"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    {request.scheduled_date && <span>{formatDate(request.scheduled_date)}</span>}
                    {request.scheduled_time && <span>{request.scheduled_time.slice(0, 5)}</span>}
                    <span>{formatPKR(Number(request.fee_amount ?? 0))}</span>
                  </div>
                  {request.issue_summary && <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-slate-600">{request.issue_summary}</p>}
                </div>
              </div>

              <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() => respond(request, "reject")}
                  className="w-full gap-1.5 border-rose-200 text-rose-700 hover:bg-rose-50 sm:w-auto"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                  Decline
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={busy}
                  onClick={() => respond(request, "accept")}
                  className="w-full gap-1.5 bg-emerald-700 text-white hover:bg-emerald-800 sm:w-auto"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Accept
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

