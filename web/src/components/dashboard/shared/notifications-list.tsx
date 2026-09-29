"use client";

import { useState } from "react";
import { Bell, CalendarCheck, CreditCard, Gavel, MessageSquare, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatDateTime } from "@/lib/utils";
import type { AppNotification, NotificationType } from "@/lib/types";

const TYPE_ICON: Record<NotificationType, typeof Bell> = {
  booking: CalendarCheck,
  case: Gavel,
  payment: CreditCard,
  message: MessageSquare,
  system: Settings,
};

export function NotificationsList({ notifications }: { notifications: AppNotification[] }) {
  const [items, setItems] = useState(notifications);
  const unreadCount = items.filter((n) => !n.read).length;

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "You're all caught up"}</p>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>Mark all as read</Button>
        )}
      </div>

      <div className="space-y-2.5">
        {items.map((n) => {
          const Icon = TYPE_ICON[n.type];
          return (
            <Card
              key={n.id}
              className={cn(
                "flex items-start gap-3.5 border-border/80 p-4 transition-colors",
                !n.read && "border-primary/30 bg-primary/[0.03]"
              )}
            >
              <span className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                n.read ? "bg-secondary text-muted-foreground" : "bg-primary/10 text-primary"
              )}>
                <Icon className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{n.title}</p>
                  <span className="text-xs text-muted-foreground">{formatDateTime(n.date)}</span>
                </div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{n.description}</p>
              </div>
              {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold" />}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

