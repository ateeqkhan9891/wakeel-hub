import Link from "next/link";
import { Globe, MessageCircle, Send, Share2, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { PRACTICE_AREAS, CITIES } from "@/lib/constants";
import { SEO_PRACTICE_PAGES, cityPracticeSlug } from "@/lib/seo-content";

const footerLinks = {
  platform: [
    { href: "/find-lawyers", label: "Find Lawyers" },
    { href: "/pricing", label: "Pricing" },
    { href: "/legal-guides", label: "Legal Guides" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ],
  account: [
    { href: "/login", label: "Log in" },
    { href: "/register/client", label: "Register as Client" },
    { href: "/register/lawyer", label: "Register as Lawyer" },
    { href: "/dashboard/client", label: "Client Dashboard" },
    { href: "/dashboard/lawyer", label: "Lawyer Dashboard" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              WakeelHub helps people in Pakistan compare verified advocates, book consultations,
              manage payments, and keep legal matters organized online.
            </p>
            <div className="mt-5 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold" /> ateeqrehmankhan0346@gmail.com
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold" /> +92 3367070686
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" /> i-8bd, Islamabad, Pakistan
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3">
              {[Globe, MessageCircle, Send, Share2].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <FooterCol title="Platform" links={footerLinks.platform} />
          <FooterCol title="Account" links={footerLinks.account} />
          <div>
            <h3 className="font-heading text-sm font-semibold text-foreground">Practice Areas</h3>
            <ul className="mt-4 space-y-2.5">
              {PRACTICE_AREAS.slice(0, 6).map((area) => (
                <li key={area.slug}>
                  <Link
                    href={`/${SEO_PRACTICE_PAGES.find((page) => page.practiceAreaSlug === area.slug)?.slug ?? `find-lawyers?practiceArea=${area.slug}`}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-gold"
                  >
                    {area.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Find lawyers in
          </p>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((city) => (
              <Link
                key={city}
                href={`/${cityPracticeSlug(SEO_PRACTICE_PAGES[0], city)}`}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-gold hover:text-gold"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>Copyright {new Date().getFullYear()} WakeelHub Pakistan. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {footerLinks.legal.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-gold">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="font-heading text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-gold">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
