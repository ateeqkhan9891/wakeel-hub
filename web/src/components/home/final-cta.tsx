import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center shadow-2xl sm:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background:radial-gradient(50%_60%_at_50%_0%,oklch(0.78_0.13_85_/_0.18),transparent)]"
        />
        <h2 className="relative font-heading text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
          Ready to find the right legal help?
        </h2>
        <p className="relative mx-auto mt-3 max-w-xl text-base leading-7 text-primary-foreground/80">
          Join thousands of clients and advocates already using Wakeel360 to connect, collaborate and
          resolve legal matters with confidence.
        </p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="gap-2 bg-gold text-gold-foreground hover:bg-gold/90">
            <Link href="/find-lawyers">
              Find a lawyer now <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
            <Link href="/register/lawyer">Register as a Lawyer</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

