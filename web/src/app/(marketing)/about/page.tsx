import type { Metadata } from "next";

import { AboutStory } from "@/components/about/about-story";

export const metadata: Metadata = {
  title: "About WakeelHub",
  description:
    "Learn why WakeelHub exists and how it helps people in Pakistan find verified advocates, book consultations, communicate securely, and track legal matters online.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutStory />;
}
