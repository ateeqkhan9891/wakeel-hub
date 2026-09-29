import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { FeatureTile } from "./FeatureTile";

type AudiencePanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  actions: readonly {
    icon: LucideIcon;
    title: string;
    text: string;
  }[];
  href: string;
  cta: string;
};

export function AudiencePanel({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions,
  href,
  cta,
}: AudiencePanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-[26px] border border-zinc-200 bg-white p-5 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.35)] sm:p-7"
    >
      <div className="flex flex-col gap-6 border-b border-zinc-100 pb-7 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-600">
            {eyebrow}
          </span>

          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-zinc-950">
            {title}
          </h3>

          <p className="mt-3 text-sm leading-6 text-zinc-600">
            {description}
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>
      </div>

      <div className="grid gap-4 pt-7 sm:grid-cols-2">
        {actions.map((action) => (
          <FeatureTile
            key={action.title}
            icon={action.icon}
            title={action.title}
            text={action.text}
            interactive={false}
          />
        ))}
      </div>

      <div className="mt-7 flex justify-end border-t border-zinc-100 pt-5">
        <a
          href={href}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-zinc-800 transition-colors hover:text-amber-700"
        >
          {cta}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </a>
      </div>
    </motion.div>
  );
}
