"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import {CalendarCheck} from "lucide-react";

import type { BookingRow } from "@/lib/data/booking-types";
import type { BookingStatusEnum } from "@/lib/supabase/types";

import {
  respondToBooking,
  completeBooking,
} from "@/app/actions/booking-actions";

import { createCaseFromBooking } from "@/app/actions/case-actions";

import { LawyerBookingsToolbar } from "./lawyer-bookings-toolbar";
import { LawyerBookingCard } from "./lawyer-booking-card";
import { LawyerBookingDetails } from "./lawyer-booking-details";

type LawyerBookingsLiveProps = {
  bookings: BookingRow[];
};

export function LawyerBookingsLive({
  bookings,
}: LawyerBookingsLiveProps) {
  const router = useRouter();

  const [tab, setTab] =
    useState<"all" | BookingStatusEnum>("all");

  const [selectedBooking, setSelectedBooking] =
    useState<BookingRow | null>(null);

  const [pendingId, setPendingId] =
    useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const counts = useMemo(() => {
    const result: Record<string, number> = {
      all: bookings.length,
    };

    for (const booking of bookings) {
      result[booking.status] =
        (result[booking.status] ?? 0) + 1;
    }

    return result;
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    if (tab === "all") {
      return bookings;
    }

    return bookings.filter(
      (booking) => booking.status === tab,
    );
  }, [bookings, tab]);

  function runAction(
    id: string,
    action: () => Promise<{
      ok: boolean;
      error?: string;
      requireAuth?: boolean;
    }>,
    successMessage: string,
  ) {
    setPendingId(id);

    startTransition(async () => {
      const result = await action();

      setPendingId(null);

      if (!result.ok) {
        if (result.requireAuth) {
          router.push("/login");
          return;
        }

        toast.error("Action failed", {
          description: result.error,
        });

        return;
      }

      toast.success(successMessage);

      setSelectedBooking(null);

      router.refresh();
    });
  }

  function handleAccept(id: string) {
    runAction(
      id,
      () => respondToBooking(id, "accept"),
      "Booking accepted - client notified",
    );
  }

  function handleReject(id: string) {
    runAction(
      id,
      () => respondToBooking(id, "reject"),
      "Booking declined - client notified",
    );
  }

  function handleComplete(id: string) {
    runAction(
      id,
      () => completeBooking(id),
      "Booking marked as completed",
    );
  }

  function handleCreateCase(id: string) {
    setPendingId(id);

    startTransition(async () => {
      const result = await createCaseFromBooking(id);

      setPendingId(null);

      if (!result.ok) {
        toast.error("Could not create case", {
          description: result.error,
        });

        return;
      }

      toast.success("Case created from consultation", {
        description:
          "Client information and consultation notes were added to the case.",
      });

      if (result.id) {
        router.push(
          `/dashboard/lawyer/cases/${result.id}`,
        );
      }
    });
  }

  return (
    <div className="space-y-5">
      <LawyerBookingsToolbar
        tab={tab}
        counts={counts}
        onTabChange={setTab}
      />

      {filteredBookings.length === 0 ? (
        <div className="flex min-h-92 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                <CalendarCheck className="h-5 w-5 text-slate-400" />
            </div>

            <h3 className="mt-4 font-heading text-base font-semibold text-slate-950">
                No bookings found
            </h3>

            <p className="mt-1.5 max-w-sm text-sm leading-6 text-slate-500">
                There are no bookings in this status yet. New consultation
                requests will appear here when clients book a session.
            </p>

            {tab !== "all" && (
                <button
                type="button"
                onClick={() => setTab("all")}
                className="mt-5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-950"
                >
                View all bookings
                </button>
            )}
            </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((booking) => (
            <LawyerBookingCard
              key={booking.id}
              booking={booking}
              pending={
                pendingId === booking.id && isPending
              }
              onView={() => setSelectedBooking(booking)}
              onAccept={() => handleAccept(booking.id)}
              onReject={() => handleReject(booking.id)}
              onComplete={() =>
                handleComplete(booking.id)
              }
              onCreateCase={() =>
                handleCreateCase(booking.id)
              }
            />
          ))}
        </div>
      )}

      <LawyerBookingDetails
        booking={selectedBooking}
        pending={
          selectedBooking
            ? pendingId === selectedBooking.id &&
              isPending
            : false
        }
        onClose={() => setSelectedBooking(null)}
        onAccept={() =>
          selectedBooking &&
          handleAccept(selectedBooking.id)
        }
        onReject={() =>
          selectedBooking &&
          handleReject(selectedBooking.id)
        }
        onComplete={() =>
          selectedBooking &&
          handleComplete(selectedBooking.id)
        }
        onCreateCase={() =>
          selectedBooking &&
          handleCreateCase(selectedBooking.id)
        }
      />
    </div>
  );
}