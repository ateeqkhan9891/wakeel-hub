import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type FeatureTileProps = {
  icon: LucideIcon;
  title: string;
  text: string;
  className?: string;
  interactive?: boolean;
};

export function FeatureTile({
  icon: Icon,
  title,
  text,
  className,
  interactive = true,
}: FeatureTileProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={
        interactive
          ? {
              y: -4,
            }
          : undefined
      }
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 transition-shadow duration-300",
        interactive && "hover:shadow-[0_18px_45px_-28px_rgba(15,23,42,0.35)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>

        {interactive && (
          <ArrowUpRight
            className="h-4 w-4 text-zinc-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber-600"
            strokeWidth={1.8}
          />
        )}
      </div>

      <div className="mt-7">
        <h3 className="text-base font-semibold tracking-[-0.01em] text-zinc-950">
          {title}
        </h3>

        <p className="mt-2.5 text-sm leading-6 text-zinc-600">
          {text}
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-amber-500 transition-transform duration-300 group-hover:scale-x-100" />
    </motion.article>
  );
}
