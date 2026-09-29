"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

import { FLOW_STEPS } from "./about.constants";
import { DashboardPane } from "./DashboardPane";
import { FlowBridge } from "./FlowBridge";

type LiveFlowSimulatorProps = {
  compact?: boolean;
};

export function LiveFlowSimulator({
  compact = false,
}: LiveFlowSimulatorProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused] = useState(false);

  const step = FLOW_STEPS[activeStep];

  const progress = useMemo(
    () => ((activeStep + 1) / FLOW_STEPS.length) * 100,
    [activeStep],
  );

  useEffect(() => {
    if (paused) return;

    const interval = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % FLOW_STEPS.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, [paused]);

  const previousStep = () => {
    setPaused(true);
    setActiveStep(
      (current) => (current - 1 + FLOW_STEPS.length) % FLOW_STEPS.length,
    );
  };

  const nextStep = () => {
    setPaused(true);
    setActiveStep((current) => (current + 1) % FLOW_STEPS.length);
  };

  return (
    <section
      className="rounded-[28px] border border-zinc-200 bg-white shadow-[0_30px_80px_-45px_rgba(15,23,42,0.35)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="border-b border-zinc-100 px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                Live workflow
              </span>
            </div>

            <div className="mt-2 flex items-center gap-3">
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-zinc-950">
                {step.title}
              </h3>

              <span className="hidden rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-semibold text-zinc-500 sm:inline-flex">
                {step.status}
              </span>
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              {step.description}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={previousStep}
              aria-label="Previous workflow step"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={nextStep}
              aria-label="Next workflow step"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-[10px] font-medium text-zinc-400">
            <span>
              Step {activeStep + 1} of {FLOW_STEPS.length}
            </span>

            <span>{Math.round(progress)}%</span>
          </div>

          <div className="mt-2 h-1 overflow-hidden rounded-full bg-zinc-100">
            <motion.div
              className="h-full rounded-full bg-amber-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      <div className="px-5 py-6 sm:px-7 sm:py-8">
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-1">
          {FLOW_STEPS.map((flowStep, index) => {
            const Icon = flowStep.icon;
            const isActive = index === activeStep;
            const isComplete = index < activeStep;

            return (
              <button
                key={flowStep.label}
                type="button"
                onClick={() => {
                  setPaused(true);
                  setActiveStep(index);
                }}
                className="group flex shrink-0 items-center gap-2"
                aria-label={`Go to ${flowStep.label} step`}
              >
                <span
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-lg border transition-all",
                    isActive
                      ? "border-slate-950 bg-slate-950 text-white"
                      : isComplete
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-zinc-200 bg-white text-zinc-400 group-hover:border-zinc-300 group-hover:text-zinc-600",
                  ].join(" ")}
                >
                  {isComplete ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={2} />
                  ) : (
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                  )}
                </span>

                <span
                  className={[
                    "hidden text-[11px] font-semibold sm:block",
                    isActive
                      ? "text-zinc-950"
                      : isComplete
                        ? "text-zinc-500"
                        : "text-zinc-400",
                  ].join(" ")}
                >
                  {flowStep.label}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div
              className={[
                "grid items-center gap-4",
                compact
                  ? "md:grid-cols-[1fr_auto_1fr]"
                  : "lg:grid-cols-[1fr_auto_1fr]",
              ].join(" ")}
            >
              <DashboardPane
                mode="client"
                title={step.clientTitle}
                rows={step.clientRows}
                active
              />

              <FlowBridge active />

              <DashboardPane
                mode="lawyer"
                title={step.lawyerTitle}
                rows={step.lawyerRows}
                active
              />
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex flex-col gap-3 border-t border-zinc-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-700">
              <step.icon className="h-3.5 w-3.5" strokeWidth={1.8} />
            </span>

            <span className="text-xs font-medium text-zinc-600">
              {step.label}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setPaused((current) => !current)}
            className="text-left text-xs font-semibold text-zinc-500 transition-colors hover:text-zinc-950 sm:text-right"
          >
            {paused ? "Resume walkthrough" : "Pause walkthrough"}
          </button>
        </div>
      </div>
    </section>
  );
}
