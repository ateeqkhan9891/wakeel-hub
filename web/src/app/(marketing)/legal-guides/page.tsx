import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, ShieldAlert } from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LEGAL_GUIDES } from "@/lib/seo-content";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Legal Guides Pakistan | WakeelHub",
  description:
    "Read general legal information guides for people in Pakistan preparing to speak with a qualified lawyer. No legal advice, no fake claims.",
  alternates: { canonical: "/legal-guides" },
  openGraph: {
    title: "Legal Guides Pakistan | WakeelHub",
    description:
      "General legal information for people preparing to find and speak with a lawyer in Pakistan.",
    url: absoluteUrl("/legal-guides"),
    images: ["/og-image.png"],
  },
};

export default function LegalGuidesPage() {
  return (
    <main className="bg-[#f8fafc] text-foreground">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Legal Guides", path: "/legal-guides" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Legal Guides Pakistan",
            url: absoluteUrl("/legal-guides"),
            hasPart: LEGAL_GUIDES.map((guide) => ({
              "@type": "Article",
              headline: guide.title,
              url: absoluteUrl(`/legal-guides/${guide.slug}`),
            })),
          },
        ]}
      />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <Badge variant="outline" className="rounded-full bg-slate-50 px-3 py-1.5">
            <BookOpen className="mr-1.5 h-3.5 w-3.5 text-gold" />
            Legal guides
          </Badge>
          <h1 className="mt-5 max-w-3xl font-heading text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Practical legal guides for people in Pakistan
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
            These guides help you prepare questions, documents and next steps before speaking with a qualified advocate.
            They are not legal advice and do not replace a lawyer&apos;s review of your facts.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <div className="flex gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <p>This guide is for general information only and is not legal advice.</p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {LEGAL_GUIDES.map((guide) => (
            <Link key={guide.slug} href={`/legal-guides/${guide.slug}`} className="group">
              <Card className="flex h-full flex-col border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-lg">
                <BookOpen className="h-5 w-5 text-gold" />
                <h2 className="mt-4 font-heading text-xl font-semibold text-slate-950">{guide.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{guide.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-950 group-hover:text-gold-foreground">
                  Read guide
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
