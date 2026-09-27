
import Link from "next/link";
import { CalendarCheck, FileText } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { OpenChatButton } from "@/components/dashboard/shared/open-chat-button";

import Image from "next/image";

import { MODE_LABEL } from "@/lib/data/bookings";
import type { getClientBookings } from "@/lib/data/bookings";
import type { ConsultationModeEnum } from "@/lib/supabase/types";
import { formatDate, formatPKR, initials } from "@/lib/utils";

type Bookings = Awaited<ReturnType<typeof getClientBookings>>;

type ClientRecentBookingsProps = {
  bookings: Bookings;
};

const MODE_ICON: Record<ConsultationModeEnum, typeof CalendarCheck> = {
  online: CalendarCheck,
  phone: CalendarCheck,
  in_person: CalendarCheck,
};

export function ClientRecentBookings({
  bookings,
}: ClientRecentBookingsProps) {
  const recentBookings = bookings.slice(0, 4);

  return (
    <Card className="border-slate-200 p-5 ring-0">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-heading text-sm font-semibold text-slate-950">
          <CalendarCheck className="h-4 w-4 text-gold" />
          Recent bookings
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

      {recentBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-10 text-center">
          <Image
              src="/client/no-booking.png"
              alt=""
              width={120}
              height={120}
              className="h-24 w-24 object-contain"
              aria-hidden
            />

          <h3 className="mt-3 text-sm font-semibold text-slate-950">
            No bookings yet
          </h3>

          <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
            Browse verified advocates and book your first consultation.
          </p>

          <Button asChild size="sm" variant="outline" className="mt-4">
            <Link href="/find-lawyers">Find a lawyer</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {recentBookings.map((b) => {
            const ModeIcon = MODE_ICON[b.mode];

            return (
              <div
                key={b.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="bg-primary/8 text-xs font-semibold text-primary">
                        {b.lawyer_name
                          ? initials(b.lawyer_name)
                          : "AD"}
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
                          <span>
                            {formatDate(b.scheduled_date)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <StatusBadge status={b.status} />

                    <span className="text-sm font-semibold text-slate-900">
                      {formatPKR(b.fee_amount)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-3">
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="gap-1.5 text-slate-600 hover:text-slate-950"
                  >
                    <Link href="/dashboard/client/bookings">
                      <FileText className="h-4 w-4" />
                      View details
                    </Link>
                  </Button>

                  <OpenChatButton
                    bookingId={b.id}
                    basePath="/dashboard/client/messages"
                    label="Message lawyer"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}