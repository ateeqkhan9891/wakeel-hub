import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { CookieConsent } from "@/components/cookie-consent";
import { WakeelAILazy } from "@/components/ai/wakeel-ai-lazy";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationJsonLd, websiteJsonLd, siteUrl } from "@/lib/seo";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "WakeelHub Pakistan - Find & Hire Verified Advocates Online",
    template: "%s | WakeelHub Pakistan",
  },
  description:
    "Find verified advocates in Pakistan by city, court and practice area. Compare lawyer profiles, book consultations, manage payments and follow your case online.",
  keywords: [
    "lawyers in Pakistan",
    "advocates Pakistan",
    "find a lawyer Pakistan",
    "legal consultation Pakistan",
    "WakeelHub",
    "hire advocate online",
    "Pakistan law firm directory",
  ],
  authors: [{ name: "WakeelHub Pakistan" }],
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: siteUrl,
    siteName: "WakeelHub Pakistan",
    title: "WakeelHub Pakistan - Find & Hire Verified Advocates Online",
    description:
      "Search verified advocates across Pakistan by city, court and practice area. Book consultations, hire lawyers, pay online and track your case.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "WakeelHub Pakistan" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WakeelHub Pakistan - Find & Hire Verified Advocates Online",
    description:
      "Compare verified advocates in Pakistan, book consultations, manage payments and track legal matters online.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: siteUrl },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={`${jakarta.variable} ${lora.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextTopLoader
          color="#c79a4d"
          height={3}
          shadow="0 0 10px #c79a4d,0 0 5px #c79a4d"
          showSpinner={false}
          speed={300}
          crawlSpeed={180}
          easing="ease"
        />
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false} disableTransitionOnChange>
          <TooltipProvider delayDuration={150}>
            <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
            {children}
            <WakeelAILazy />
            <CookieConsent />
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
