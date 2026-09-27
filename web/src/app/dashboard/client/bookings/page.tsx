import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, Clock, Video, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { OpenChatButton } from "@/components/dashboard/shared/open-chat-button";
import { PayBookingButton } from "@/components/dashboard/shared/pay-booking-button";
import { getClientBookings, MODE_LABEL } from "@/lib/data/bookings";
import type { ConsultationModeEnum } from "@/lib/supabase/types";
import { formatDate, formatPKR } from "@/lib/utils";

export const metadata: Metadata = { title: "My Bookings" };

const MODE_ICON: Record<ConsultationModeEnum, typeof Video> = {
  online: Video,
  phone: Phone,
  in_person: MapPin,
};

export default async function ClientBookingsPage() {
  const bookings = await getClientBookings();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">My Bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">All your consultation requests in one place - confirmed, pending, completed, and declined.</p>
        </div>
        <Button asChild className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/find-lawyers"><CalendarCheck className="h-4 w-4" /> Book a new consultation</Link>
        </Button>
      </div>

      {bookings.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 border-dashed border-border/80 px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/8 text-primary">
            <CalendarCheck className="h-6 w-6" />
          </span>
          <div>
            <p className="font-heading text-base font-semibold text-foreground">No bookings yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Find a verified advocate and request your first consultation.</p>
          </div>
          <Button asChild className="mt-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/find-lawyers">Find a lawyer</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const ModeIcon = MODE_ICON[b.mode];
            return (
              <Card key={b.id} className="border-border/80 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
                      <ModeIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{b.lawyer_name ?? "Advocate"}</p>
                      {b.practice_area_name && <p className="mt-0.5 text-xs text-muted-foreground">{b.practice_area_name}</p>}
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        {b.scheduled_date && (
                          <span className="flex items-center gap-1.5"><CalendarCheck className="h-3.5 w-3.5 text-gold" /> {formatDate(b.scheduled_date)}</span>
                        )}
                        {b.scheduled_time && (
                          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-gold" /> {b.scheduled_time.slice(0, 5)}</span>
                        )}
                        <span className="flex items-center gap-1.5"><ModeIcon className="h-3.5 w-3.5 text-gold" /> {MODE_LABEL[b.mode]}</span>
                      </div>
                      {b.status === "rejected" && b.cancellation_reason && (
                        <p className="mt-2 text-xs text-rose-600">Reason: {b.cancellation_reason}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={b.status} />
                    <span className="text-sm font-semibold text-foreground">{formatPKR(b.fee_amount)}</span>
                    {b.payment_status === "paid" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" /> Paid</span>
                    ) : (
                      <span className="text-xs text-amber-600">Payment pending</span>
                    )}
                  </div>
                </div>
                {(b.payment_status !== "paid" && b.status !== "rejected" && b.status !== "cancelled" && b.fee_amount > 0) && (
                  <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-border/70 pt-4">
                    <PayBookingButton bookingId={b.id} amount={b.fee_amount} lawyerName={b.lawyer_name ?? "your advocate"} />
                  </div>
                )}
                {(b.status === "confirmed" || b.status === "completed" || b.status === "pending") && (
                  <div className={`flex justify-end ${b.payment_status !== "paid" && b.fee_amount > 0 ? "mt-2" : "mt-4 border-t border-border/70 pt-4"}`}>
                    <OpenChatButton bookingId={b.id} basePath="/dashboard/client/messages" label="Message advocate" />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
