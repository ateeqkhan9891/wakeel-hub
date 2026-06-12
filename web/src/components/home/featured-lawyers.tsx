import Link from "next/link";
import { ArrowRight, Clock3, MessageSquareText, ShieldCheck, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LawyerCard } from "@/components/shared/lawyer-card";
import { getVerifiedLawyers } from "@/lib/data/public-lawyers";

const SECTION_PROOF = [
  { label: "Verified", value: "Registered advocates", icon: ShieldCheck },
  { label: "Response Time", value: "Shown on profiles", icon: Clock3 },
  { label: "Consultations", value: "Real account activity", icon: MessageSquareText },
  { label: "Client Reviews", value: "Verified feedback", icon: Star },
] as const;

export async function FeaturedLawyers() {
  const lawyers = await getVerifiedLawyers();
  const featured = lawyers
    .filter((lawyer) => lawyer.verified)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    })
    .slice(0, 6);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-gold" />
              Featured Advocates
            </span>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Meet Pakistan&apos;s Top Verified Advocates
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              Browse registered lawyers across family, criminal, property, corporate, civil, constitutional, tax, and immigration law.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm">
            {SECTION_PROOF.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl bg-secondary/50 p-3">
                <Icon className="h-4 w-4 text-gold" />
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="mt-1 text-xs font-medium text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((lawyer) => (
            <LawyerCard key={lawyer.id} lawyer={lawyer} />
          ))}
        </div>

        <div className="flex justify-center">
          <Button variant="outline" asChild className="gap-2 rounded-xl">
            <Link href="/find-lawyers">
              View all verified lawyers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
