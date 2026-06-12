import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, ChevronRight, ShieldAlert } from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LEGAL_GUIDES, legalGuideBySlug } from "@/lib/seo-content";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";

type PageParams = { slug: string };

export function generateStaticParams(): PageParams[] {
  return LEGAL_GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = legalGuideBySlug(slug);
  if (!guide) return {};

  const path = `/legal-guides/${guide.slug}`;
  return {
    title: `${guide.title} | WakeelHub`,
    description: guide.description,
    alternates: { canonical: path },
    openGraph: {
      title: `${guide.title} | WakeelHub`,
      description: guide.description,
      url: absoluteUrl(path),
      type: "article",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${guide.title} | WakeelHub`,
      description: guide.description,
      images: ["/og-image.png"],
    },
  };
}

export default async function LegalGuideArticlePage({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  const guide = legalGuideBySlug(slug);
  if (!guide) notFound();

  const path = `/legal-guides/${guide.slug}`;
  const related = LEGAL_GUIDES.filter((item) => item.slug !== guide.slug).slice(0, 4);

  return (
    <main className="bg-[#f8fafc] text-foreground">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Legal Guides", path: "/legal-guides" },
            { name: guide.title, path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: guide.title,
            description: guide.description,
            url: absoluteUrl(path),
            author: {
              "@type": "Organization",
              name: "WakeelHub Pakistan",
            },
            publisher: {
              "@type": "Organization",
              name: "WakeelHub Pakistan",
              logo: {
                "@type": "ImageObject",
                url: absoluteUrl("/og-image.png"),
              },
            },
            mainEntityOfPage: absoluteUrl(path),
          },
        ]}
      />

      <article>
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
              <Link href="/" className="hover:text-slate-950">Home</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href="/legal-guides" className="hover:text-slate-950">Legal Guides</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-medium text-slate-950">{guide.title}</span>
            </nav>
            <Badge variant="outline" className="mt-7 rounded-full bg-slate-50 px-3 py-1.5">
              <BookOpen className="mr-1.5 h-3.5 w-3.5 text-gold" />
              General information
            </Badge>
            <h1 className="mt-5 font-heading text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {guide.title}
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">{guide.description}</p>
          </div>
        </header>

        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8">
          <div className="space-y-6">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              <div className="flex gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
                <p>This guide is for general information only and is not legal advice.</p>
              </div>
            </div>

            {guide.sections.map((section) => (
              <section key={section.heading} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="font-heading text-2xl font-semibold text-slate-950">{section.heading}</h2>
                <p className="mt-3 text-sm leading-8 text-slate-600">{section.body}</p>
              </section>
            ))}

            <Card className="border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
              <h2 className="font-heading text-xl font-semibold">Ready to compare lawyer profiles?</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Use WakeelHub to search verified lawyer profiles by city, practice area, court, language and fee.
              </p>
              <Link href="/find-lawyers" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950">
                Search lawyers
              </Link>
            </Card>
          </div>

          <aside className="space-y-5">
            <Link href="/legal-guides" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-950">
              <ArrowLeft className="h-4 w-4" />
              All legal guides
            </Link>
            <Card className="border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-heading text-base font-semibold text-slate-950">Related guides</h2>
              <div className="mt-4 space-y-3">
                {related.map((item) => (
                  <Link key={item.slug} href={`/legal-guides/${item.slug}`} className="block text-sm leading-6 text-slate-600 hover:text-gold-foreground">
                    {item.title}
                  </Link>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </article>
    </main>
  );
}
