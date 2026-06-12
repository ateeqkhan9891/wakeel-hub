import { ShieldCheck, Clock, Lock, HeartHandshake, MapPinned, MessagesSquare } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

const reasons = [
  { icon: ShieldCheck, title: "Verified advocates only", description: "Every lawyer's Bar Council credentials are manually verified by our admin team before they go live." },
  { icon: Lock, title: "Secure online payments", description: "Bank-grade encryption protects every transaction, with digital invoices for full transparency." },
  { icon: Clock, title: "Fast response times", description: "Most advocates respond to consultation requests within hours, not days." },
  { icon: MapPinned, title: "Nationwide coverage", description: "From Karachi to Peshawar, find advocates practicing in courts across all major Pakistani cities." },
  { icon: MessagesSquare, title: "Built-in messaging", description: "Communicate with your lawyer, share documents, and keep case updates tied to the same matter." },
  { icon: HeartHandshake, title: "Transparent fees", description: "See consultation fees upfront with no hidden charges, so you can choose confidently." },
];

export function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Why WakeelHub"
        title="Built on trust, designed for clarity"
        description="WakeelHub keeps the lawyer search practical: verified profiles, clear fees, secure communication, and tools that help clients stay organized."
      />
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((reason) => (
          <div key={reason.title} className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold-foreground">
              <reason.icon className="h-5 w-5 text-gold-foreground" strokeWidth={2} />
            </span>
            <div>
              <h3 className="font-heading text-base font-semibold text-foreground">{reason.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{reason.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
