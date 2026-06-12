import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const lawyerBenefits = [
  "Build a verified, professional online profile",
  "Get discovered by clients searching in your city & practice areas",
  "Manage clients, cases, hearings and documents in one dashboard",
  "Set your own consultation fees and availability",
  "Receive secure online payments with full transaction history",
  "Track your performance with built-in analytics",
];

const clientBenefits = [
  "Search and compare verified advocates by city & specialisation",
  "Read genuine reviews and case highlights before you choose",
  "Book consultations online - in-person, video or phone",
  "Pay securely with digital invoices for every transaction",
  "Track your case status, hearings and documents in real time",
  "Message your lawyer directly without leaving the platform",
];

export function BenefitsSplit() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BenefitCard
          eyebrow="For Lawyers"
          title="Grow your practice with WakeelHub"
          description="Join thousands of advocates who use WakeelHub to reach new clients, manage cases efficiently, and build a trusted online reputation."
          items={lawyerBenefits}
          cta={{ label: "Register as Lawyer", href: "/register/lawyer" }}
          accent="primary"
        />
        <BenefitCard
          eyebrow="For Clients"
          title="Get the right legal help, faster"
          description="Whether it's a family matter, property dispute or business contract - find a verified advocate you can trust, and stay informed at every step."
          items={clientBenefits}
          cta={{ label: "Register as Client", href: "/register/client" }}
          accent="gold"
        />
      </div>
    </section>
  );
}

function BenefitCard({
  eyebrow,
  title,
  description,
  items,
  cta,
  accent,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
  cta: { label: string; href: string };
  accent: "primary" | "gold";
}) {
  return (
    <Card className="flex h-full flex-col border-border/80 p-8">
      <span
        className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ring-inset ${
          accent === "primary" ? "bg-primary/5 text-primary ring-primary/15" : "bg-gold/10 text-gold-foreground ring-gold/20"
        }`}
      >
        {eyebrow}
      </span>
      <h3 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-foreground">
            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${accent === "primary" ? "bg-primary/10 text-primary" : "bg-gold/15 text-gold-foreground"}`}>
              <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
            {item}
          </li>
        ))}
      </ul>
      <Button asChild className="mt-8 w-fit gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
        <Link href={cta.href}>
          {cta.label} <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </Card>
  );
}
