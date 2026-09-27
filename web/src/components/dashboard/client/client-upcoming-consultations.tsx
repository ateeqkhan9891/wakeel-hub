
import Link from "next/link";
import { CalendarCheck, MapPin, Phone, Video } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";

import { MODE_LABEL } from "@/lib/data/bookings";
import type { getClientBookings } from "@/lib/data/bookings";
import type { ConsultationModeEnum } from "@/lib/supabase/types";
import { formatDate, initials } from "@/lib/utils";

type Bookings = Awaited<ReturnType<typeof getClientBookings>>;

type ClientUpcomingConsultationsProps = {
  bookings: Bookings;
};

const MODE_ICON: Record<ConsultationModeEnum, typeof Video> = {
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
    <Card className="border-slate-200 p-5 ring-0">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-heading text-sm font-semibold text-slate-950">
          <CalendarCheck className="h-4 w-4 text-gold" />
          Upcoming consultations
        </h2>

        {bookings.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-8 text-primary hover:text-primary"
          >
            <Link href="/dashboard/client/bookings">View all</Link>
          </Button>
        )}
      </div>

      {upcomingConsultations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-10 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
            <CalendarCheck className="h-5 w-5" aria-hidden />
          </span>

          <h3 className="mt-3 text-sm font-semibold text-slate-950">
            No upcoming consultations
          </h3>

          <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
            Book a consultation with a verified advocate to get started.
          </p>

          <Button asChild size="sm" variant="outline" className="mt-4">
            <Link href="/find-lawyers">Find a lawyer</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingConsultations.slice(0, 3).map((b) => {
            const ModeIcon = MODE_ICON[b.mode];

            return (
              <div
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-primary/8 text-xs font-semibold text-primary">
                      {b.lawyer_name ? initials(b.lawyer_name) : "AD"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">
                      {b.lawyer_name ?? "Advocate"}
                    </p>

                    <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
                      {b.practice_area_name && (
                        <span>{b.practice_area_name}</span>
                      )}

                      <span className="flex items-center gap-1">
                        <ModeIcon className="h-3 w-3" />
                        {MODE_LABEL[b.mode]}
                      </span>

                      {b.scheduled_date && (
                        <span className="flex items-center gap-1">
                          <CalendarCheck className="h-3 w-3" />
                          {formatDate(b.scheduled_date)}
                          {b.scheduled_time
                            ? `, ${b.scheduled_time.slice(0, 5)}`
                            : ""}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={b.status} />

                  <Button asChild size="sm" variant="outline">
                    <Link href="/dashboard/client/bookings">View</Link>
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