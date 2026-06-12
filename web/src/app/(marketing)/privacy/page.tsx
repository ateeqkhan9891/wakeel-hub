import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how WakeelHub Pakistan collects, uses, and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS = [
  {
    title: "1. Information we collect",
    body: [
      "When you create an account, we collect information such as your name, email address, phone number, city, and password. Lawyers additionally provide professional details including Bar Council enrollment numbers, education, practice areas, and fee information for verification purposes.",
      "We also collect information you provide when booking consultations, messaging other users, uploading documents to your case dashboard, or making payments through the platform.",
      "Like most websites, we automatically collect certain technical information - such as your IP address, browser type, device information, and pages visited - to help us operate and improve WakeelHub.",
    ],
  },
  {
    title: "2. How we use your information",
    body: [
      "We use your information to create and manage your account, connect clients with advocates, process bookings and payments, enable secure messaging, and provide case-tracking features.",
      "We use contact details to send booking confirmations, case updates, hearing reminders, and important account notifications. You can manage non-essential notification preferences from your dashboard at any time.",
      "Aggregated, de-identified data may be used to improve our matching algorithms, understand usage trends, and develop new features.",
    ],
  },
  {
    title: "3. How we share your information",
    body: [
      "Your profile information (such as name, city, practice areas, and reviews) is shared with other users as part of the normal operation of the marketplace - for example, a client can view a lawyer's public profile before booking a consultation.",
      "We share information with trusted service providers who help us operate WakeelHub, such as payment processors and cloud hosting providers, under strict confidentiality obligations.",
      "We do not sell your personal information to third parties. We may disclose information if required by law, such as in response to a valid court order or Bar Council inquiry.",
    ],
  },
  {
    title: "4. Data security",
    body: [
      "We use industry-standard security measures, including encryption in transit and at rest, to protect your personal information from unauthorized access, alteration, or disclosure.",
      "Payments are processed through secure, PCI-compliant payment gateways. WakeelHub does not store your full card details on its servers.",
      "While we work hard to protect your data, no method of transmission or storage is 100% secure. We encourage you to use a strong, unique password and to keep your login credentials confidential.",
    ],
  },
  {
    title: "5. Your rights and choices",
    body: [
      "You can access, update, or correct your profile information at any time from your account settings. You may request a copy of the personal data we hold about you by contacting our support team.",
      "You can request that we delete your account and associated personal data, subject to any legal or regulatory record-keeping requirements (for example, records related to ongoing cases or payments).",
      "You can opt out of non-essential marketing communications at any time using the unsubscribe link in our emails or your notification settings.",
    ],
  },
  {
    title: "6. Cookies & tracking technologies",
    body: [
      "We use cookies and similar technologies to keep you signed in, remember your preferences, and understand how WakeelHub is used so we can improve it.",
      "You can control cookies through your browser settings; however, disabling certain cookies may affect the functionality of the platform, such as staying logged in to your dashboard.",
    ],
  },
  {
    title: "7. Children's privacy",
    body: [
      "WakeelHub is intended for users who are at least 18 years old or the age of majority in their jurisdiction. We do not knowingly collect personal information from children.",
    ],
  },
  {
    title: "8. Changes to this policy",
    body: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, regulatory, or operational reasons. We will notify you of material changes by posting a notice on the platform or sending you an email.",
    ],
  },
  {
    title: "9. Contact us",
    body: [
      "If you have any questions or concerns about this Privacy Policy or how your information is handled, please reach out to us at privacy@wakeelhub.pk or through our Contact page.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="Last updated: January 15, 2026. This policy explains how WakeelHub Pakistan collects, uses, shares, and protects your personal information."
      />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="border-border/80 p-6 sm:p-10">
          <p className="text-sm leading-7 text-muted-foreground">
            WakeelHub Pakistan (&ldquo;WakeelHub&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is
            committed to protecting your privacy. This Privacy Policy describes how we collect, use, disclose, and
            safeguard your information when you use our website, mobile experience, and related services
            (collectively, the &ldquo;Platform&rdquo;). By using WakeelHub, you agree to the collection and use of
            information in accordance with this policy.
          </p>

          <div className="mt-8 space-y-8">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">{section.title}</h2>
                <div className="mt-2 space-y-3">
                  {section.body.map((paragraph, i) => (
                    <p key={i} className="text-sm leading-7 text-muted-foreground">{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </>
  );
}
