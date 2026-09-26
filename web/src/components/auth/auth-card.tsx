"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { LoginPanel } from "./LoginPanel";
import { SignupPanel } from "./SignupPanel";

type Tab = "login" | "signup";
type Role = "client" | "lawyer";

interface AuthCardProps {
  initialTab?: Tab;
  initialRole?: Role;
  isNew?: boolean;
}

export function AuthCard({
  initialTab = "login",
  initialRole,
  isNew = false,
}: AuthCardProps) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {tab === "login" ? "Welcome back" : "Create your account"}
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {tab === "login"
            ? "Sign in to continue to WakeelHub Pakistan."
            : "Get started with WakeelHub Pakistan."}
        </p>
      </div>

      <div className="border-b">
        <div className="grid grid-cols-2">
          <button
            type="button"
            onClick={() => setTab("login")}
            className={`relative h-11 text-sm font-medium transition-colors ${
              tab === "login"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign in

            {tab === "login" && (
              <motion.div
                layoutId="auth-tab"
                className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground"
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.2 }
                }
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => setTab("signup")}
            className={`relative h-11 text-sm font-medium transition-colors ${
              tab === "signup"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign up

            {tab === "signup" && (
              <motion.div
                layoutId="auth-tab"
                className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground"
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.2 }
                }
              />
            )}
          </button>
        </div>
      </div>

      <div className="pt-8">
        <AnimatePresence mode="wait" initial={false}>
          {tab === "login" ? (
            <motion.div
              key="login"
              initial={
                shouldReduceMotion
                  ? false
                  : { opacity: 0, y: 6 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                shouldReduceMotion
                  ? undefined
                  : { opacity: 0, y: -6 }
              }
              transition={{ duration: 0.18 }}
            >
              <LoginPanel
                isNew={isNew}
                onSwitch={() => setTab("signup")}
              />
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={
                shouldReduceMotion
                  ? false
                  : { opacity: 0, y: 6 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                shouldReduceMotion
                  ? undefined
                  : { opacity: 0, y: -6 }
              }
              transition={{ duration: 0.18 }}
            >
              <SignupPanel
                initialRole={initialRole}
                onSwitch={() => setTab("login")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        By continuing, you agree to our terms and privacy policy.
      </p>
    </div>
  );
}