"use client";

import { AboutHero } from "./AboutHero";
import { AudienceSection } from "./AudienceSection";
import { ComparisonSection } from "./ComparisonSection";
import { FinalCta } from "./FinalCta";
import { LiveSimulationSection } from "./LiveSimulationSection";
import { ProblemSection } from "./ProblemSection";
import { ValuesSection } from "./ValuesSection";

export function AboutStory() {
  return (
    <main className="overflow-hidden bg-[#fbfcfd] text-zinc-950">
      <AboutHero />
      <LiveSimulationSection />
      <ProblemSection />
      <AudienceSection />
      <ValuesSection />
      <ComparisonSection />
      <FinalCta />
    </main>
  );
}
