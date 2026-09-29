"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Lightweight route transition - a quick fade + small lift on the content
 * area only. Layouts/shells stay mounted, so navigation feels stable and fast.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

