"use client";

import { useEffect, useState } from "react";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

type DashboardRole = "client" | "lawyer" | "admin";

type DashboardInsightProps = {
  role: DashboardRole;
};

const INSIGHTS: Record<DashboardRole, string[]> = {
  client: [
    "Stay calm. Read the fine print. Then make your move.",
    "Every case has a story. Make sure yours has the right ending.",
    "The details matter. The small ones especially.",
    "Plot twist: being prepared actually works.",
    "Keep your documents close. Future you will thank you.",
    "No panic. No drama. Just one smart move at a time.",
    "Your case isn't a Netflix series. Don't wait for the next episode.",
    "Good lawyers ask questions. Smart clients bring the answers.",
    "The courtroom isn't the place to discover you forgot something.",
    "Main character energy is great. Having your documents ready is better.",
    "Stay sharp. Know your case. Know your next move.",
    "Sometimes the smartest move is simply asking the right question.",
  ],

  lawyer: [
    "Know the facts. Know the law. Then make your move.",
    "A well-prepared lawyer makes difficult cases look easier.",
    "Your client sees a lawyer. The details see everything.",
    "Never underestimate the power of being prepared.",
    "The case may be complicated. Your next move doesn't have to be.",
    "Good arguments are built on great preparation.",
    "Keep your cases organized. Chaos belongs in the courtroom, not your dashboard.",
    "Your client doesn't need magic. They need someone who knows what they're doing.",
    "Read the details twice. The other side probably did.",
    "Every case has a turning point. Be ready when it arrives.",
    "Sharp strategy. Clear communication. No unnecessary drama.",
    "You handle the case. We'll handle the dashboard.",
  ],

  admin: [
    "Review pending activity regularly to keep the platform running smoothly.",
    "Monitor user activity and platform updates from your dashboard.",
    "Keep an eye on pending actions that require administrative attention.",
    "Consistent oversight helps maintain a reliable legal marketplace.",
    "Review recent activity to stay informed about the platform.",
  ],
};

export function DashboardInsight({ role }: DashboardInsightProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = window.setTimeout(() => {
      setVisible(true);
    }, 12000);

    const rotateTimer = window.setInterval(() => {
      setVisible(false);

      window.setTimeout(() => {
        setIndex((current) => (current + 1) % INSIGHTS[role].length);
        setVisible(true);
      }, 400);
    }, 45000);

    return () => {
      window.clearTimeout(showTimer);
      window.clearInterval(rotateTimer);
    };
  }, [role]);

  function handleClose() {
    setVisible(false);
  }

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 top-[4.75rem] z-40 flex justify-center px-4 transition-all duration-500 ease-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-6 opacity-0"
      }`}
    >
      <div className="pointer-events-auto relative w-full max-w-lg overflow-hidden rounded-2xl p-px">
        <div className="absolute inset-[-200%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,var(--primary)_70deg,var(--accent)_140deg,transparent_210deg)]" />

        <div className="relative flex items-center gap-3 rounded-[15px] bg-card/95 px-4 py-3 backdrop-blur-xl">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/15">
            <span className="text-sm">✦</span>
          </div>

          <p className="min-w-0 flex-1 text-sm leading-5 text-foreground">
            {INSIGHTS[role][index]}
          </p>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-7 w-7 shrink-0 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Dismiss insight"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}