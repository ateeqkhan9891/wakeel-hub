import {
  Clock3,
  HeartHandshake,
  LockKeyhole,
  MapPinned,
  MessagesSquare,
  ShieldCheck,
} from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Verified advocates",
    description:
      "Bar Council credentials are reviewed before an advocate profile is published.",
  },
  {
    icon: LockKeyhole,
    title: "Secure payments",
    description:
      "Protected transactions and digital invoices keep every payment clear and accountable.",
  },
  {
    icon: Clock3,
    title: "Faster responses",
    description:
      "Send consultation requests and connect with advocates without unnecessary delays.",
  },
  {
    icon: MapPinned,
    title: "Nationwide coverage",
    description:
      "Discover advocates practicing across major cities, courts, and legal specialties.",
  },
  {
    icon: MessagesSquare,
    title: "Private communication",
    description:
      "Keep conversations, documents, and matter updates organized in one place.",
  },
  {
    icon: HeartHandshake,
    title: "Clearer fees",
    description:
      "Review consultation fees upfront and make decisions with fewer surprises.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="border-y border-border/70 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          eyebrow="Why Wakeel360"
          title="A simpler way to find legal help"
          description="Everything you need to discover, evaluate, and communicate with advocates through one trusted platform."
        />

        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 border-t border-border sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;

            return (
              <article
                key={reason.title}
                className={`group relative border-b border-border p-6 transition-colors duration-200 hover:bg-card ${
                  index % 2 !== 0 ? "sm:border-l" : ""
                } ${
                  index % 3 !== 0 ? "lg:border-l" : ""
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/20 bg-gold/8 text-gold-foreground transition-all duration-200 group-hover:border-gold/35 group-hover:bg-gold/12">
                  <Icon
                    className="h-5 w-5"
                    strokeWidth={1.8}
                    aria-hidden
                  />
                </div>

                <h3 className="mt-5 font-heading text-base font-semibold tracking-tight text-foreground">
                  {reason.title}
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  {reason.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
