"use client";

import type { ReactNode } from "react";

import Link from "next/link";

import {
  ArrowRight,
  CalendarCheck,
  CreditCard,
  Gavel,
  MessageSquare,
  Settings,
  ShieldCheck,
  Clock,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { cn, timeAgo } from "@/lib/utils";

import type { NotificationRow } from "@/lib/data/notifications";
import type { NotificationTypeEnum } from "@/lib/supabase/types";

import { OpenChatButton } from "@/components/dashboard/shared/open-chat-button";

const TYPE_META: Record<
  NotificationTypeEnum,
  {
    icon: LucideIcon;
    iconClass: string;
    label: string;
  }
> = {
  booking: {
    icon: CalendarCheck,
    iconClass: "bg-gold/10 text-gold",
    label: "Booking",
  },
  case: {
    icon: Gavel,
    iconClass: "bg-primary/10 text-primary",
    label: "Case",
  },
  payment: {
    icon: CreditCard,
    iconClass: "bg-emerald-50 text-emerald-600",
    label: "Payment",
  },
  message: {
    icon: MessageSquare,
    iconClass: "bg-blue-50 text-blue-600",
    label: "Message",
  },
  hearing: {
    icon: Clock,
    iconClass: "bg-amber-50 text-amber-600",
    label: "Hearing",
  },
  verification: {
    icon: ShieldCheck,
    iconClass: "bg-primary/10 text-primary",
    label: "Verification",
  },
  system: {
    icon: Settings,
    iconClass: "bg-slate-100 text-slate-500",
    label: "System",
  },
};

export function NotificationCard({
  notification,
}: {
  notification: NotificationRow;
}) {
  const meta =
    TYPE_META[notification.type] ?? TYPE_META.system;

  const Icon = meta.icon;
  const actions = renderActions(notification);

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-xl border-slate-200 bg-white p-0 shadow-sm shadow-slate-200/30 transition-colors hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/30",
        !notification.is_read &&
          "border-primary/25 bg-primary/[0.015]",
      )}
    >
      {!notification.is_read && (
        <span className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
      )}

      <div className="flex gap-3.5 p-4">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            notification.is_read
              ? "bg-slate-100 text-slate-400"
              : meta.iconClass,
          )}
        >
          <Icon className="h-4.5 w-4.5" aria-hidden />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {!notification.is_read && (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                )}

                <p
                  className={cn(
                    "truncate text-sm text-slate-950",
                    notification.is_read
                      ? "font-medium"
                      : "font-semibold",
                  )}
                >
                  {notification.title}
                </p>
              </div>
            </div>

            <span className="shrink-0 text-[11px] text-slate-400">
              {timeAgo(notification.created_at)}
            </span>
          </div>

          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
              {meta.label}
            </span>

            {!notification.is_read && (
              <>
                <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />
                <span className="text-[10px] font-medium text-primary">
                  New
                </span>
              </>
            )}
          </div>

          {notification.body && (
            <p className="mt-1.5 max-w-3xl text-sm leading-5.5 text-slate-600">
              {notification.body}
            </p>
          )}

          {actions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {actions}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function renderActions(
  notification: NotificationRow,
): ReactNode[] {
  const actions: ReactNode[] = [];

  const entityId =
    notification.related_entity_id ?? undefined;

  const isBookingEntity =
    notification.related_entity_type === "booking" &&
    Boolean(entityId);

  switch (notification.type) {
    case "booking":
      actions.push(
        <ActionLink
          key="booking"
          href="/dashboard/lawyer/bookings"
          label="View booking"
        />,
      );

      if (isBookingEntity && entityId) {
        actions.push(
          <OpenChatButton
            key="message"
            bookingId={entityId}
            basePath="/dashboard/lawyer/messages"
            label="Message client"
          />,
        );
      }

      break;

    case "case":
      actions.push(
        <ActionLink
          key="case"
          href={
            entityId
              ? `/dashboard/lawyer/cases/${entityId}`
              : "/dashboard/lawyer/cases"
          }
          label="Open case"
        />,
      );
      break;

    case "payment":
      actions.push(
        <ActionLink
          key="payment"
          href="/dashboard/lawyer/payments"
          label="View payment"
        />,
      );
      break;

    case "hearing":
      actions.push(
        <ActionLink
          key="hearing"
          href="/dashboard/lawyer/hearings"
          label="View hearings"
        />,
      );
      break;

    case "message":
      actions.push(
        <ActionLink
          key="message"
          href="/dashboard/lawyer/messages"
          label="Open messages"
        />,
      );
      break;

    case "verification":
      actions.push(
        <ActionLink
          key="verification"
          href="/dashboard/lawyer/profile"
          label="View profile"
        />,
      );
      break;

    case "system":
      actions.push(
        <ActionLink
          key="system"
          href="/dashboard/lawyer/billing"
          label="Manage subscription"
        />,
      );
      break;
  }

  return actions;
}

function ActionLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Button
      asChild
      size="sm"
      variant="outline"
      className="h-7 gap-1 rounded-md px-2.5 text-xs font-medium"
    >
      <Link href={href}>
        {label}
        <ArrowRight className="h-3 w-3" />
      </Link>
    </Button>
  );
}
