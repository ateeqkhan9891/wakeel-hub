"use client";

import { useState } from "react";
import { Calendar, Check, Clock, MapPin, Phone, Video, X } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { PRACTICE_AREAS } from "@/lib/constants";
import { formatDate, formatPKR } from "@/lib/utils";
import type { Booking } from "@/lib/types";

const MODE_ICON = { "Video": Video, "Phone": Phone, "In-person": MapPin } as const;

export function LawyerBookingsList({ bookings }: { bookings: Booking[] }) {
  const [items, setItems] = useState(bookings);

  function updateStatus(id: string, status: Booking["status"], message: string) {
    setItems((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    toast.success(message);
  }

  return (
    <div className="space-y-4">
      {items.map((b) => {
        const ModeIcon = MODE_ICON[b.mode];
        const areaName = PRACTICE_AREAS.find((p) => p.slug === b.practiceArea)?.name ?? b.practiceArea;
        return (
          <Card key={b.id} className="border-border/80 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
                  <ModeIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{b.clientName}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{areaName}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-gold" /> {formatDate(b.date)}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-gold" /> {b.time}</span>
                    <span className="flex items-center gap-1.5"><ModeIcon className="h-3.5 w-3.5 text-gold" /> {b.mode}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={b.status} />
                <span className="text-sm font-semibold text-foreground">{formatPKR(b.fee)}</span>
              </div>
            </div>

            {b.status === "pending" && (
              <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                <Button
                  size="sm"
                  className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => updateStatus(b.id, "confirmed", `Booking with ${b.clientName} confirmed`)}
                >
                  <Check className="h-3.5 w-3.5" /> Confirm
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-destructive hover:bg-destructive/10"
                  onClick={() => updateStatus(b.id, "cancelled", `Booking with ${b.clientName} declined`)}
                >
                  <X className="h-3.5 w-3.5" /> Decline
                </Button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
