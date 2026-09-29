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

  const switchTab = (nextTab: Tab) => {
    setTab(nextTab);
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-7 text-center">
        {/* <div className="mb-4 inline-flex items-center rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
          Wakeel360 Pakistan
        </div> */}

        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {tab === "login" ? "Welcome back" : "Create your account"}
        </h1>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          {tab === "login"
            ? "Sign in to continue to your Wakeel360 account."
            : "Join Wakeel360 and get started in just a few steps."}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="border-b bg-muted/20 p-1.5">
          <div className="relative grid grid-cols-2 rounded-xl">
            <motion.div
              layoutId="auth-tab-background"
              className="absolute inset-y-0 w-1/2 rounded-lg bg-background shadow-sm"
              animate={{
                x: tab === "login" ? "0%" : "100%",
              }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      type: "spring",
                      stiffness: 400,
                      damping: 35,
                    }
              }
            />

            <button
              type="button"
              onClick={() => switchTab("login")}
              className={`relative z-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                tab === "login"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={() => switchTab("signup")}
              className={`relative z-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                tab === "signup"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign up
            </button>
          </div>
        </div>

        <div className="px-5 pb-6 pt-6 sm:px-7 sm:pb-7 sm:pt-7">
          <AnimatePresence mode="wait" initial={false}>
            {tab === "login" ? (
              <motion.div
                key="login"
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 8,
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={
                  shouldReduceMotion
                    ? undefined
                    : {
                        opacity: 0,
                        y: -8,
                      }
                }
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.2,
                  ease: "easeOut",
                }}
              >
                <LoginPanel
                  isNew={isNew}
                  onSwitch={() => switchTab("signup")}
                />
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 8,
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={
                  shouldReduceMotion
                    ? undefined
                    : {
                        opacity: 0,
                        y: -8,
                      }
                }
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.2,
                  ease: "easeOut",
                }}
              >
                <SignupPanel
                  initialRole={initialRole}
                  onSwitch={() => switchTab("login")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
        By continuing, you agree to our{" "}
        <button
          type="button"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Terms
        </button>{" "}
        and{" "}
        <button
          type="button"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Privacy Policy
        </button>
        .
      </p>
    </div>
  );
}
