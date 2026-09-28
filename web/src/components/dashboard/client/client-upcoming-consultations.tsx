import Link from "next/link";

import {
  CalendarCheck,
  ChevronRight,
  MapPin,
  Phone,
  Video,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { StatusBadge } from "@/components/dashboard/shared/status-badge";

import { MODE_LABEL } from "@/lib/data/bookings";

import type { getClientBookings } from "@/lib/data/bookings";
import type { ConsultationModeEnum } from "@/lib/supabase/types";

import { formatDate, initials } from "@/lib/utils";

type Bookings = Awaited<ReturnType<typeof getClientBookings>>;

type ClientUpcomingConsultationsProps = {
  bookings: Bookings;
};

const MODE_ICON: Record<
  ConsultationModeEnum,
  typeof Video
> = {
  online: Video,
  phone: Phone,
  in_person: MapPin,
};

export function ClientUpcomingConsultations({
  bookings,
}: ClientUpcomingConsultationsProps) {
  const upcomingConsultations = bookings
    .filter(
      (b) => b.status === "confirmed" || b.status === "pending",
    )
    .sort((a, b) =>
      (a.scheduled_date ?? "9999").localeCompare(
        b.scheduled_date ?? "9999",
      ),
    );

  return (
    <Card className="relative overflow-hidden border-slate-200 bg-white p-0 shadow-sm ring-0">
      <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-blue-50/70 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-8 h-24 w-24 rounded-full border border-slate-100" />
      <div className="pointer-events-none absolute right-9 top-7 h-8 w-8 rounded-full border border-blue-100/70" />

      <div className="relative flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <CalendarCheck
              className="h-4 w-4"
              strokeWidth={1.8}
              aria-hidden
            />
          </div>

          <div>
            <h2 className="font-heading text-base font-semibold tracking-tight text-slate-950">
              Upcoming consultations
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {upcomingConsultations.length > 0
                ? `${upcomingConsultations.length} scheduled ${
                    upcomingConsultations.length === 1
                      ? "consultation"
                      : "consultations"
                  }`
                : "Your scheduled appointments"}
            </p>
          </div>
        </div>

        {bookings.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-8 gap-1 rounded-lg px-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950"
          >
            <Link href="/dashboard/client/bookings">
              View all
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </div>

      {upcomingConsultations.length === 0 ? (
        <div className="relative mx-4 my-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-9 text-center">
          <div className="pointer-events-none absolute right-5 top-5 h-8 w-8 rounded-full border border-slate-200/70" />

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
            <CalendarCheck
              className="h-5 w-5"
              strokeWidth={1.7}
              aria-hidden
            />
          </div>

          <h3 className="mt-3 text-sm font-semibold text-slate-950">
            No upcoming consultations
          </h3>

          <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
            Book a consultation with a verified advocate to get started.
          </p>

          <Button
            asChild
            size="sm"
            className="mt-4 h-8 rounded-lg bg-slate-950 px-3 text-xs font-semibold text-white hover:bg-slate-800"
          >
            <Link href="/find-lawyers">
              Find a lawyer
            </Link>
          </Button>
        </div>
      ) : (
        <div className="relative space-y-2 p-3">
          {upcomingConsultations.slice(0, 3).map((b) => {
            const ModeIcon = MODE_ICON[b.mode];

            return (
              <div
                key={b.id}
                className="group rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 shrink-0 ring-1 ring-slate-200">
                    <AvatarFallback className="bg-blue-50 text-xs font-semibold text-blue-600">
                      {b.lawyer_name
                        ? initials(b.lawyer_name)
                        : "AD"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-950">
                          {b.lawyer_name ?? "Advocate"}
                        </p>

                        {b.practice_area_name && (
                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {b.practice_area_name}
                          </p>
                        )}
                      </div>

                      <StatusBadge status={b.status} />
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {b.scheduled_date && (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[11px] font-semibold text-blue-700">
                          <CalendarCheck
                            className="h-3.5 w-3.5"
                            strokeWidth={1.8}
                            aria-hidden
                          />
                          {formatDate(b.scheduled_date)}
                          {b.scheduled_time
                            ? `, ${b.scheduled_time.slice(0, 5)}`
                            : ""}
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200">
                        <ModeIcon
                          className="h-3.5 w-3.5 text-slate-400"
                          strokeWidth={1.8}
                          aria-hidden
                        />
                        {MODE_LABEL[b.mode]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex justify-end border-t border-slate-200/70 pt-3">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 rounded-lg px-2.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  >
                    <Link href="/dashboard/client/bookings">
                      View consultation
                      <ChevronRight
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}