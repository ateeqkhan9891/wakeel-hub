"use client";

import { motion, useReducedMotion } from "framer-motion";

export function CaseProgress({ value, status }: { value: number; status: string }) {
  const reduce = useReducedMotion();
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Case progress</span>
        <span className="font-heading text-sm font-semibold text-primary">{pct}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-gold"
          initial={reduce ? false : { width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Current stage: <span className="font-medium text-foreground">{status}</span></p>
    </div>
  );
}
