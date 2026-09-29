"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { completeOnboarding } from "@/app/actions/onboarding-actions";
import { Button } from "@/components/ui/button";

type Stage = 1 | 2 | 3;

const stages = [
  {
    number: 1,
    eyebrow: "First things first",
    title: "Welcome to WakeelHub.",
    description:
      "“I do believe in killing the messenger. Why? Because it sends a message.” — The Vampire Diaries",
    image: "/onboarding/onboarding-1.png",
  },
  {
    number: 2,
    eyebrow: "Build your profile",
    title: "The details matter.",
    description:
      "“Yeah, science!” — Breaking Bad",
    image: "/onboarding/onboarding-2.png",
  },
  {
    number: 3,
    eyebrow: "You're ready",
    title: "Your legal workspace awaits.",
    description:
      "“I need a miracle.” — Prison Break",
    image: "/onboarding/no-booking.png",
  },
] as const;

export function OnboardingFlow() {
  const router = useRouter();

  const [stage, setStage] = useState<Stage>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const current = stages[stage - 1];
  const isLastStage = stage === stages.length;

  async function handleContinue() {
    if (!isLastStage) {
      setStage((currentStage) => (currentStage + 1) as Stage);
      return;
    }

    setIsSubmitting(true);

    const result = await completeOnboarding();

    if (!result.success) {
      toast.error(result.message);
      setIsSubmitting(false);
      return;
    }

    toast.success("You're all set.");
    router.push(result.redirectTo);
  }

  function handleBack() {
    if (stage === 1 || isSubmitting) return;

    setStage((currentStage) => (currentStage - 1) as Stage);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 sm:px-6">
      <div className="w-full max-w-3xl">
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Getting started
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Set up your WakeelHub account
              </p>
            </div>

            <span className="rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
              Step {stage} of {stages.length}
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={false}
              animate={{
                width: `${(stage / stages.length) * 100}%`,
              }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
          <div className="relative min-h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={stage}
                initial={{
                  opacity: 0,
                  x: 24,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -24,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="flex min-h-[600px] flex-col"
              >
                <div className="flex flex-1 flex-col items-center px-6 pb-8 pt-10 text-center sm:px-12 sm:pt-12">
                  <div className="mb-8 flex h-56 w-full max-w-sm items-center justify-center sm:h-64">
                    <Image
                      src={current.image}
                      alt=""
                      width={500}
                      height={500}
                      priority
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="max-w-xl">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      {current.eyebrow}
                    </p>

                    <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                      {current.title}
                    </h1>

                    <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
                      {current.description}
                    </p>
                  </div>
                </div>

                <div className="border-t bg-muted/20 px-6 py-5 sm:px-10">
                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleBack}
                      disabled={stage === 1 || isSubmitting}
                      className="rounded-xl"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>

                    <Button
                      type="button"
                      onClick={handleContinue}
                      disabled={isSubmitting}
                      size="lg"
                      className="min-w-36 rounded-xl"
                    >
                      {isSubmitting
                        ? "Setting things up..."
                        : isLastStage
                          ? "Enter WakeelHub"
                          : "Continue"}

                      {!isSubmitting && (
                        isLastStage ? (
                          <Check className="ml-2 h-4 w-4" />
                        ) : (
                          <ArrowRight className="ml-2 h-4 w-4" />
                        )
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {stages.map((item) => (
            <button
              key={item.number}
              type="button"
              onClick={() => {
                if (!isSubmitting) {
                  setStage(item.number as Stage);
                }
              }}
              disabled={isSubmitting}
              aria-label={`Go to step ${item.number}`}
              className="group flex items-center gap-2 p-1"
            >
              <span
                className={[
                  "block h-1.5 rounded-full transition-all duration-300",
                  item.number === stage
                    ? "w-8 bg-primary"
                    : item.number < stage
                      ? "w-2 bg-primary/50"
                      : "w-2 bg-muted",
                ].join(" ")}
              />
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          You can complete your setup in about a minute.
        </p>
      </div>
    </main>
  );
}