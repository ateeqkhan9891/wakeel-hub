import type { Metadata } from "next";

import {
  ArrowUpRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the WakeelHub Pakistan team for support, lawyer verification, billing questions, or partnership inquiries.",
  alternates: { canonical: "/contact" },
};

const CONTACT_DETAILS = [
  {
    icon: MapPin,
    title: "Office",
    lines: [
      "WakeelHub Pakistan",
      "Floor 4, Evacuee Trust Complex",
      "F-5/1, Islamabad, Pakistan",
    ],
  },
  {
    icon: Phone,
    title: "Phone & WhatsApp",
    lines: ["+92 51 111 925 335", "Mon - Sat, 9:00 AM - 7:00 PM PKT"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["ateeqrehmankhan0346@gmail.com", "lawyers@wakeelhub.pk"],
  },
  {
    icon: MessageCircle,
    title: "Live chat",
    lines: ["Available from your dashboard", "Typical response time: under 2 hours"],
  },
];

const SUPPORT_TOPICS = [
  "Finding a lawyer",
  "Lawyer verification",
  "Account support",
  "Billing",
  "Partnerships",
];

export default function ContactPage() {
  return (
    <main className="bg-background">
      <PageHeader
        eyebrow="Contact"
        title="How can we help?"
        description="Have a fuckong question about WakeelHub? Send us a message and our team will help you with the next step."
      />

      <section className="border-b border-border/70">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  Get in touch
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-foreground sm:text-3xl">
                  We&apos;re here to help.
                </h2>

                <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
                  Contact us directly or use the form to send your question.
                  We&apos;ll make sure your request reaches the right team.
                </p>
              </div>

              <div className="mt-8 divide-y divide-border/70 border-y border-border/70">
                {CONTACT_DETAILS.map((detail) => {
                  const Icon = detail.icon;

                  return (
                    <div
                      key={detail.title}
                      className="group flex gap-4 py-5"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 text-primary">
                        <Icon className="h-4 w-4" strokeWidth={1.8} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-sm font-semibold text-foreground">
                            {detail.title}
                          </p>

                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                        </div>

                        <div className="mt-1.5 space-y-0.5">
                          {detail.lines.map((line) => (
                            <p
                              key={line}
                              className="text-sm leading-5 text-muted-foreground"
                            >
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-7 flex gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                <p className="text-xs leading-5 text-muted-foreground">
                  Please avoid including confidential case details in your
                  initial inquiry.
                </p>
              </div>
            </div>

            <Card className="border-border/80 bg-background">
              <div className="border-b border-border/70 px-6 py-6 sm:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  Send a message
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl">
                  Tell us what you need.
                </h2>

                <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                  Provide a few details below and our team will get back to
                  you.
                </p>
              </div>

              <div className="px-6 py-6 sm:px-8 sm:py-8">
                <ContactForm />
              </div>

              <div className="border-t border-border/70 bg-muted/20 px-6 py-5 sm:px-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Common topics
                </p>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                  {SUPPORT_TOPICS.map((topic) => (
                    <span
                      key={topic}
                      className="text-xs text-muted-foreground"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}