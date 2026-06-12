"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "wakeelhub_cookie_consent";

export function CookieConsent() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Defer to a frame so this never runs during SSR/hydration and the banner
    // only appears once we know no choice has been stored yet.
    const id = requestAnimationFrame(() => {
      try {
        if (!localStorage.getItem(STORAGE_KEY)) setShow(true);
      } catch {
        /* storage unavailable - stay hidden */
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  function decide(choice: "all" | "essential") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, at: new Date().toISOString() }));
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-label="Cookie consent"
          aria-live="polite"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-md sm:inset-x-auto sm:left-4 sm:bottom-4"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border bg-popover/95 p-5 shadow-2xl shadow-black/10 backdrop-blur-md">
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold/10 blur-2xl" aria-hidden />
            <button
              onClick={() => decide("essential")}
              aria-label="Dismiss"
              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                <Cookie className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="font-heading text-sm font-semibold text-foreground">We value your privacy</p>
                <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
                  WakeelHub uses cookies to keep you signed in, remember your preferences, and improve the platform. See our{" "}
                  <Link href="/privacy" className="font-medium text-primary underline-offset-2 hover:underline">Privacy Policy</Link>.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button onClick={() => decide("all")} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                Accept all
              </Button>
              <Button onClick={() => decide("essential")} variant="outline" className="flex-1">
                Essential only
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
