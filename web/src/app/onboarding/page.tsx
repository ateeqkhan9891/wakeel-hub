import type { Metadata } from "next";

import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export const metadata: Metadata = {
  title: "Get Started | Wakeel360",
  description: "Set up your Wakeel360 experience.",
};

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
