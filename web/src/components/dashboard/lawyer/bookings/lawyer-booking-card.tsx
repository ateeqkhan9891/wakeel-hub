import {
  CalendarCheck,
  Clock,
  MapPin,
  Phone,
  Video,
  Wallet,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { StatusBadge } from "@/components/dashboard/shared/status-badge";

import { formatDate, formatPKR, initials } from "@/lib/utils";

import {
  MODE_LABEL,
  type BookingRow,
} from "@/lib/data/booking-types";

import type { ConsultationModeEnum } from "@/lib/supabase/types";

import { LawyerBookingActions } from "./lawyer-booking-actions";

type LawyerBookingCardProps = {
  booking: BookingRow;
  pending: boolean;
  onView: () => void;
  onAccept: () => void;
  onReject: () => void;
  onComplete: () => void;
  onCreateCase: () => void;
};

const MODE_ICON: Record<ConsultationModeEnum, LucideIcon> = {
  online: Video,
  phone: Phone,
  in_person: MapPin,
};

function formatTime(value: string) {
  const [hourValue, minute] = value.split(":");
  const hour = Number(hourValue);

  if (Number.isNaN(hour)) {
    return value.slice(0, 5);
  }

  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  return `${hour12}:${minute ?? "00"} ${period}`;
}

function Meta({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2.5 text-sm text-slate-600">
      <Icon className="h-4 w-4 shrink-0 text-slate-400" />
      <span className="truncate">{children}</span>
    </div>
  );
}

export function LawyerBookingCard({
  booking,
  pending,
  onView,
  onAccept,
  onReject,
  onComplete,
  onCreateCase,
}: LawyerBookingCardProps) {
  const ModeIcon = MODE_ICON[booking.mode];

  const showPayment =
    booking.payment_status &&
    booking.payment_status !== "pending";

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm shadow-slate-200/40 transition-shadow hover:shadow-md">
      <div className="p-4 sm:p-5">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_auto]">
          <div className="flex min-w-0 items-start gap-3.5">
            <Avatar size="lg" className="shrink-0">
              <AvatarFallback className="bg-emerald-50 text-sm font-semibold text-emerald-700">
                {booking.client_name
                  ? initials(booking.client_name)
                  : "CL"}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 pt-0.5">
              <div className="flex min-w-0 items-center gap-2">
                <p className="truncate text-[0.95rem] font-semibold text-slate-950">
                  {booking.client_name ?? "Client"}
                </p>

                <StatusBadge
                  status={booking.status}
                  className="hidden shrink-0 sm:inline-flex"
                />
              </div>

              <p className="mt-1 truncate text-sm text-slate-500">
                {[
                  booking.practice_area_name,
                  booking.client_city,
                ]
                  .filter(Boolean)
                  .join(" · ") || "Consultation request"}
              </p>

              {booking.issue_summary && (
                <p className="mt-2.5 line-clamp-2 max-w-xl text-sm leading-6 text-slate-600">
                  {booking.issue_summary}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-4 sm:grid-cols-2 sm:pt-0 lg:border-l lg:border-t-0 lg:pl-5">
            {booking.scheduled_date && (
              <Meta icon={CalendarCheck}>
                {formatDate(booking.scheduled_date)}
              </Meta>
            )}

            {booking.scheduled_time && (
              <Meta icon={Clock}>
                {formatTime(booking.scheduled_time)}
              </Meta>
            )}

            <Meta icon={ModeIcon}>
              {MODE_LABEL[booking.mode]}
            </Meta>

            {booking.client_phone && (
              <Meta icon={Phone}>
                {booking.client_phone}
              </Meta>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:pt-0 lg:min-w-32 lg:flex-col lg:items-end lg:justify-start lg:border-t-0">
            <div className="sm:hidden">
              <StatusBadge status={booking.status} />
            </div>

            <div className="text-left lg:text-right">
              <p className="text-base font-semibold text-slate-950">
                {formatPKR(booking.fee_amount)}
              </p>

              {showPayment ? (
                <div className="mt-1 flex items-center gap-1.5 lg:justify-end">
                  <Wallet className="h-3.5 w-3.5 text-slate-400" />

                  <StatusBadge
                    status={booking.payment_status}
                    className="px-2 py-0 text-[0.7rem]"
                  />
                </div>
              ) : (
                <p className="mt-0.5 text-xs text-slate-400">
                  Consultation fee
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/40 px-4 py-3 sm:px-5">
        <LawyerBookingActions
          booking={booking}
          pending={pending}
          onView={onView}
          onAccept={onAccept}
          onReject={onReject}
          onComplete={onComplete}
          onCreateCase={onCreateCase}
        />
      </div>
    </Card>
  );
}
