import type { LucideIcon } from "lucide-react";

export type ActivityTone =
  | "blue"
  | "primary"
  | "emerald"
  | "rose"
  | "amber";

export type AttentionTone = "amber" | "rose" | "slate";

export type ActivityItem = {
  id: string;
  icon: LucideIcon;
  tone: ActivityTone;
  text: string;
  when: string;
};

export type AttentionItem = {
  icon: LucideIcon;
  label: string;
  count: number;
  href: string;
  tone: AttentionTone;
};