import {
  CalendarCheck,
  Clock,
  MapPin,
  Phone,
  Video,
  Wallet,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { StatusBadge } from "@/components/dashboard/shared/status-badge";

import { formatDate, formatPKR, initials } from "@/lib/utils";

import {
  MODE_LABEL,
  type BookingRow,
} from "@/lib/data/booking-types";

import type { ConsultationModeEnum } from "@/lib/supabase/types";

import { LawyerBookingActions } from "./lawyer-booking-actions";

type LawyerBookingDetailsProps = {
  booking: BookingRow | null;
  pending: boolean;
  onClose: () => void;
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

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>

      <dd className="mt-1 truncate text-sm font-medium text-slate-900">
        {children}
      </dd>
    </div>
  );
}

export function LawyerBookingDetails({
  booking,
  pending,
  onClose,
  onAccept,
  onReject,
  onComplete,
  onCreateCase,
}: LawyerBookingDetailsProps) {
  const ModeIcon = booking
    ? MODE_ICON[booking.mode]
    : null;

  return (
    <Sheet
      open={booking !== null}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <SheetContent className="w-full gap-0 sm:max-w-md">
        {booking && (
          <>
            <SheetHeader className="border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Avatar size="lg" className="shrink-0">
                  <AvatarFallback className="bg-emerald-50 text-sm font-semibold text-emerald-700">
                    {booking.client_name
                      ? initials(booking.client_name)
                      : "CL"}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <SheetTitle className="truncate text-base">
                    {booking.client_name ?? "Client"}
                  </SheetTitle>

                  <SheetDescription className="truncate">
                    {[
                      booking.practice_area_name,
                      booking.client_city,
                    ]
                      .filter(Boolean)
                      .join(" · ") ||
                      "Consultation request"}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
              <div className="flex items-center justify-between">
                <StatusBadge status={booking.status} />

                <div className="text-right">
                  <p className="text-base font-semibold text-slate-950">
                    {formatPKR(booking.fee_amount)}
                  </p>

                  <p className="text-xs text-slate-400">
                    Consultation fee
                  </p>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
                <DetailRow label="Date">
                  {booking.scheduled_date
                    ? formatDate(
                        booking.scheduled_date,
                      )
                    : "Not scheduled"}
                </DetailRow>

                <DetailRow label="Time">
                  {booking.scheduled_time
                    ? formatTime(
                        booking.scheduled_time,
                      )
                    : "-"}
                </DetailRow>

                <DetailRow label="Consultation type">
                  <span className="flex items-center gap-1.5">
                    {ModeIcon && (
                      <ModeIcon className="h-3.5 w-3.5 text-slate-400" />
                    )}
                    {MODE_LABEL[booking.mode]}
                  </span>
                </DetailRow>

                <DetailRow label="Phone">
                  {booking.client_phone ?? "-"}
                </DetailRow>

                <DetailRow label="Practice area">
                  {booking.practice_area_name ?? "-"}
                </DetailRow>

                <DetailRow label="Location">
                  {booking.client_city ?? "-"}
                </DetailRow>

                <DetailRow label="Payment status">
                  <StatusBadge
                    status={booking.payment_status}
                    className="px-2 py-0 text-[0.7rem]"
                  />
                </DetailRow>

                <DetailRow label="Requested on">
                  {formatDate(booking.created_at)}
                </DetailRow>
              </dl>

              {booking.issue_summary && (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Matter summary
                  </dt>

                  <p className="mt-1.5 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                    {booking.issue_summary}
                  </p>
                </div>
              )}

              {booking.cancellation_reason && (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Cancellation reason
                  </dt>

                  <p className="mt-1.5 text-sm leading-6 text-slate-600">
                    {booking.cancellation_reason}
                  </p>
                </div>
              )}

              {booking.client_phone && (
                <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                  <Phone className="h-4 w-4 text-slate-400" />

                  <span className="text-sm font-medium text-slate-700">
                    {booking.client_phone}
                  </span>
                </div>
              )}

              {booking.scheduled_date &&
                booking.scheduled_time && (
                  <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                    <CalendarCheck className="h-4 w-4 text-slate-400" />

                    <span className="text-sm font-medium text-slate-700">
                      {formatDate(
                        booking.scheduled_date,
                      )}{" "}
                      at{" "}
                      {formatTime(
                        booking.scheduled_time,
                      )}
                    </span>
                  </div>
                )}

              <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                <Wallet className="h-4 w-4 text-slate-400" />

                <span className="text-sm font-medium text-slate-700">
                  {formatPKR(booking.fee_amount)}
                </span>

                <StatusBadge
                  status={booking.payment_status}
                  className="ml-auto px-2 py-0 text-[0.7rem]"
                />
              </div>

              {booking.scheduled_time && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  Scheduled consultation
                </div>
              )}
            </div>

            <SheetFooter className="flex-row flex-wrap justify-end gap-2 border-t border-slate-100">
              <LawyerBookingActions
                booking={booking}
                pending={pending}
                onView={onClose}
                onAccept={onAccept}
                onReject={onReject}
                onComplete={onComplete}
                onCreateCase={onCreateCase}
              />
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}