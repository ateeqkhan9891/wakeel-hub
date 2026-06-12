"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrainCircuit, Scale } from "lucide-react";

const WakeelAIAssistantPanel = dynamic(
  () => import("@/components/ai/WakeelAIAssistantPanel").then((mod) => mod.WakeelAIAssistantPanel),
  {
    ssr: false,
    loading: () => null,
  }
);

export function WakeelAIFloatingButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        type="button"
        id="wakeel-ai-assistant"
        aria-label="Open Wakeel AI Assistant"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-2xl shadow-emerald-900/25 ring-1 ring-white/10 transition-colors hover:bg-slate-900 sm:right-6 sm:w-auto sm:gap-2.5 sm:px-5"
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="absolute inset-0 -z-10 rounded-full bg-emerald-500/20 blur-xl" aria-hidden />
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-200 sm:h-8 sm:w-8">
          <Scale className="h-4.5 w-4.5" />
          <BrainCircuit className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-slate-950 text-emerald-300" />
        </span>
        <span className="hidden text-sm font-semibold tracking-tight sm:inline">Ask Wakeel AI</span>
      </motion.button>

      <AnimatePresence>{open && <WakeelAIAssistantPanel open={open} onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}
