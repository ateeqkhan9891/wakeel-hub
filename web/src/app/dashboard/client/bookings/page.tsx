import type { Metadata } from "next";

import Image from "next/image";
import Link from "next/link";

import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Video,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { OpenChatButton } from "@/components/dashboard/shared/open-chat-button";
import { PayBookingButton } from "@/components/dashboard/shared/pay-booking-button";

import { getClientBookings, MODE_LABEL } from "@/lib/data/bookings";

import type { ConsultationModeEnum } from "@/lib/supabase/types";

import { formatDate, formatPKR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My Bookings",
};

const MODE_ICON: Record<
  ConsultationModeEnum,
  typeof Video
> = {
  online: Video,
  phone: Phone,
  in_person: MapPin,
};

export default async function ClientBookingsPage() {
  const bookings = await getClientBookings();

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-blue-50/80 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-24 w-24 rounded-full border border-slate-100" />
        <div className="pointer-events-none absolute right-10 top-8 h-10 w-10 rounded-full border border-blue-100/70" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-600">
              Consultations
            </p>

            <h1 className="mt-1 font-heading text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
              My bookings
            </h1>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
              Manage your consultation requests, appointments, payments,
              and conversations with advocates.
            </p>
          </div>

          <Button
            asChild
            className="h-9 shrink-0 gap-2 rounded-lg bg-slate-950 px-3.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            <Link href="/find-lawyers">
              <CalendarCheck className="h-3.5 w-3.5" />
              Book a consultation
            </Link>
          </Button>
        </div>
      </div>

      {bookings.length === 0 ? (
        <Card className="relative flex min-h-64 flex-col items-center justify-center overflow-hidden rounded-xl border-dashed border-slate-200 bg-slate-50/60 px-6 py-12 text-center shadow-none">
          <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-blue-50 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-8 h-24 w-24 rounded-full border border-slate-200/70" />

          <Image
            src="/client/no-booking.png"
            alt=""
            width={120}
            height={120}
            className="relative h-24 w-24 object-contain"
            aria-hidden
          />

          <div className="relative">
            <p className="font-heading text-sm font-semibold text-slate-950">
              No bookings yet
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
              Find a verified advocate and request your first consultation.
            </p>
          </div>

          <Button
            asChild
            size="sm"
            className="relative mt-4 h-8 gap-2 rounded-lg bg-slate-950 px-3 text-xs font-semibold text-white hover:bg-slate-800"
          >
            <Link href="/find-lawyers">
              Find a lawyer
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => {
            const ModeIcon = MODE_ICON[b.mode];

            const canPay =
              b.payment_status !== "paid" &&
              b.status !== "rejected" &&
              b.status !== "cancelled" &&
              b.fee_amount > 0;

            const canMessage =
              b.status === "confirmed" ||
              b.status === "completed" ||
              b.status === "pending";

            return (
              <Card
                key={b.id}
                className="relative overflow-hidden rounded-xl border-slate-200 bg-white p-0 shadow-sm ring-0 transition-all duration-200 hover:border-slate-300 hover:shadow-md"
              >
                <div className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-blue-50/70 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-10 -left-8 h-20 w-20 rounded-full border border-slate-100" />

                <div className="relative p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <ModeIcon
                          className="h-4 w-4"
                          strokeWidth={1.8}
                          aria-hidden
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-950">
                          {b.lawyer_name ?? "Advocate"}
                        </p>

                        {b.practice_area_name && (
                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {b.practice_area_name}
                          </p>
                        )}

                        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                          {b.scheduled_date && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                              <CalendarCheck
                                className="h-3.5 w-3.5 text-blue-500"
                                strokeWidth={1.8}
                                aria-hidden
                              />
                              {formatDate(b.scheduled_date)}
                            </span>
                          )}

                          {b.scheduled_time && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                              <Clock
                                className="h-3.5 w-3.5 text-blue-500"
                                strokeWidth={1.8}
                                aria-hidden
                              />
                              {b.scheduled_time.slice(0, 5)}
                            </span>
                          )}

                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                            <ModeIcon
                              className="h-3.5 w-3.5 text-blue-500"
                              strokeWidth={1.8}
                              aria-hidden
                            />
                            {MODE_LABEL[b.mode]}
                          </span>
                        </div>

                        {b.status === "rejected" &&
                          b.cancellation_reason && (
                            <div className="mt-2.5 rounded-lg border border-rose-100 bg-rose-50/60 px-2.5 py-2">
                              <p className="text-[11px] leading-4 text-rose-600">
                                {b.cancellation_reason}
                              </p>
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
                      <StatusBadge status={b.status} />

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold tracking-tight text-slate-950">
                          {formatPKR(b.fee_amount)}
                        </span>

                        {b.payment_status === "paid" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                            <CheckCircle2
                              className="h-3.5 w-3.5"
                              strokeWidth={1.8}
                              aria-hidden
                            />
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-600">
                            Payment pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {(canPay || canMessage) && (
                    <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-3">
                      {canPay && (
                        <PayBookingButton
                          bookingId={b.id}
                          amount={b.fee_amount}
                          lawyerName={b.lawyer_name ?? "your advocate"}
                        />
                      )}

                      {canMessage && (
                        <OpenChatButton
                          bookingId={b.id}
                          basePath="/dashboard/client/messages"
                          label="Message advocate"
                        />
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}