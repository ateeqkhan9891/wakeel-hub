import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeading } from "@/components/shared/section-heading";
import { PricingPlans } from "@/components/pricing/pricing-plans";
import { FAQS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent pricing for Wakeel360 Pakistan - free for clients, Rs. 2,000/month (or Rs. 18,000/year) for verified advocates, plus a commission-only pay-as-you-go plan.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Pricing that grows with your practice"
        description="Always free for clients. Advocates choose a flat monthly plan or pay only when they earn - no setup fees, cancel anytime."
      />

      <section className="py-16 sm:py-20">
        <PricingPlans />
      </section>

      <section className="border-t border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="FAQs" title="Frequently asked questions" description="Everything you need to know about using Wakeel360 as a client or advocate." />

          <div className="mt-10 space-y-4">
            {FAQS.map((faq) => (
              <Card key={faq.question} className="border-border/80 p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <HelpCircle className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{faq.question}</p>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

