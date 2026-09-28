"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Scale,
  Sparkles,
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
    title: "You came this far. Might as well see it through.",
    description:
      "Three steps. That’s all. No interrogation, no courtroom drama, no one asking you to confess anything.",
    icon: Sparkles,
  },
  {
    number: 2,
    eyebrow: "Pay attention",
    title: "The smallest detail can change the whole story.",
    description:
      "Give us the details that matter. Around here, information has a way of becoming leverage.",
    icon: Scale,
  },
  {
  number: 3,
  eyebrow: "Your move",
  title: "Easy there, Mr. White. We’re almost done.",
  description:
    "Your setup is complete. Now go make some legal moves. Preferably the kind that don’t involve the DEA.",
  icon: BriefcaseBusiness,
},
] as const;

export function OnboardingFlow() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const current = stages[stage - 1];
  const Icon = current.icon;
  const isLastStage = stage === 3;

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
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Getting started</span>
            <span>
              {stage} of {stages.length}
            </span>
          </div>

          <div className="h-1 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={false}
              animate={{
                width: `${(stage / stages.length) * 100}%`,
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-8 shadow-sm sm:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="mx-auto max-w-xl text-center"
            >
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-7 w-7" />
              </div>

              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                {current.eyebrow}
              </p>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {current.title}
              </h1>

              <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-muted-foreground">
                {current.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between">
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
              {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>

          <div className="mt-7 flex justify-center gap-2">
            {stages.map((item) => (
              <div
                key={item.number}
                className={[
                  "h-1.5 rounded-full transition-all",
                  item.number === stage
                    ? "w-7 bg-primary"
                    : item.number < stage
                      ? "w-2 bg-primary/50"
                      : "w-2 bg-muted",
                ].join(" ")}
              />
            ))}
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          You can finish this in about a minute. We promise no paperwork
          mountain.
        </p>
      </div>
    </main>
  );
}