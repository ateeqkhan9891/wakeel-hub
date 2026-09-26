import { BriefcaseBusiness, UserRound } from "lucide-react";
import { motion } from "framer-motion";

import {
  ADVOCATE_ACTIONS,
  CLIENT_ACTIONS,
  fadeUp,
} from "./about.constants";
import { AudiencePanel } from "./AudiencePanel";
import { Kicker } from "./Kicker";

export function AudienceSection() {
  return (
    <section className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <motion.div {...fadeUp} className="max-w-2xl">
          <Kicker>Built for both sides</Kicker>

          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-zinc-950 sm:text-4xl">
            One platform, two connected experiences.
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-600 sm:text-base">
            Clients need a clearer way to discover and manage legal help.
            Advocates need practical tools for presenting their practice and
            organizing their work. WakeelHub brings both experiences together.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <AudiencePanel
            eyebrow="For clients"
            title="Start with the legal help you need."
            description="Discover advocates, compare relevant information, request consultations, and keep the matter organized as it progresses."
            icon={UserRound}
            actions={CLIENT_ACTIONS}
            href="/lawyers"
            cta="Find a Lawyer"
          />

          <AudiencePanel
            eyebrow="For advocates"
            title="Build a professional digital practice."
            description="Present your expertise clearly, manage client relationships, and keep consultations and case activity connected."
            icon={BriefcaseBusiness}
            actions={ADVOCATE_ACTIONS}
            href="/auth/register?role=LAWYER"
            cta="Join as Advocate"
          />
        </div>
      </div>
    </section>
  );
}