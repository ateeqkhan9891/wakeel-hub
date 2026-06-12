import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read the terms and conditions governing your use of the WakeelHub Pakistan platform.",
  alternates: { canonical: "/terms" },
};

const SECTIONS = [
  {
    title: "1. Acceptance of terms",
    body: [
      "By creating an account or using WakeelHub Pakistan (\"WakeelHub\", \"we\", \"us\", \"the Platform\"), you agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree to these terms, please do not use the Platform.",
      "You must be at least 18 years old, and have the legal capacity to enter into a binding contract, to create an account on WakeelHub.",
    ],
  },
  {
    title: "2. Nature of the platform",
    body: [
      "WakeelHub is a marketplace that connects clients seeking legal assistance with independent advocates and law firms (\"Lawyers\"). WakeelHub is a technology platform - it is not a law firm, does not provide legal advice, and is not a party to any engagement between a client and a Lawyer.",
      "Any consultation, representation, advice, or service provided by a Lawyer is solely between the client and that Lawyer, who remains independently responsible for complying with applicable Bar Council rules and professional obligations.",
    ],
  },
  {
    title: "3. Account registration & verification",
    body: [
      "You agree to provide accurate, current, and complete information when creating an account, and to keep this information up to date. You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account.",
      "Lawyers must submit valid Bar Council enrollment details and supporting credentials. WakeelHub reviews these submissions and reserves the right to approve, reject, suspend, or revoke verified status at its sole discretion, including where information appears inaccurate, incomplete, or where complaints raise concerns about professional conduct.",
    ],
  },
  {
    title: "4. Bookings, fees & payments",
    body: [
      "Consultation fees are set by individual Lawyers and displayed on their profiles. By booking a consultation, you agree to pay the listed fee (plus any applicable platform fee) through WakeelHub's secure payment gateway.",
      "Payments for confirmed bookings are held securely and released to the Lawyer once the consultation is completed, in accordance with our payment and refund procedures. Cancellations and refunds are subject to the cancellation policy displayed at the time of booking.",
      "Lawyers on paid subscription plans agree to pay the applicable subscription fees in advance on a recurring basis until cancelled. Subscription fees are non-refundable except where required by law.",
    ],
  },
  {
    title: "5. User conduct",
    body: [
      "You agree not to use WakeelHub for any unlawful purpose, to misrepresent your identity or qualifications, to harass or abuse other users, to upload malicious or infringing content, or to attempt to circumvent the Platform's booking and payment systems.",
      "WakeelHub may suspend or terminate accounts that violate these terms, engage in fraudulent activity, or receive repeated, substantiated complaints regarding professional conduct or service quality.",
    ],
  },
  {
    title: "6. Reviews & content",
    body: [
      "Clients may leave reviews and ratings reflecting their genuine experience with a Lawyer. Reviews must be honest, respectful, and free of defamatory, abusive, or unlawful content. WakeelHub reserves the right to remove content that violates these standards.",
      "By submitting content (including reviews, messages, and documents) to the Platform, you grant WakeelHub a limited license to host, store, and display that content as necessary to operate the service.",
    ],
  },
  {
    title: "7. Intellectual property",
    body: [
      "The WakeelHub name, logo, design, and platform technology are the property of WakeelHub Pakistan and may not be copied, reproduced, or used without prior written permission.",
    ],
  },
  {
    title: "8. Limitation of liability",
    body: [
      "WakeelHub provides the Platform on an \"as is\" and \"as available\" basis. To the fullest extent permitted by law, WakeelHub disclaims all warranties and shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform, or from any consultation, advice, or representation provided by a Lawyer.",
      "Nothing in these terms limits any liability that cannot be excluded or limited under applicable Pakistani law.",
    ],
  },
  {
    title: "9. Termination",
    body: [
      "You may close your account at any time from your account settings. WakeelHub may suspend or terminate access to the Platform, with or without notice, for conduct that violates these terms or that we believe is harmful to other users or the Platform.",
    ],
  },
  {
    title: "10. Governing law",
    body: [
      "These Terms & Conditions are governed by the laws of the Islamic Republic of Pakistan. Any disputes arising from these terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts of Islamabad.",
    ],
  },
  {
    title: "11. Changes to these terms",
    body: [
      "We may update these Terms & Conditions from time to time. Material changes will be communicated through the Platform or by email, and continued use of WakeelHub after such changes constitutes acceptance of the updated terms.",
    ],
  },
  {
    title: "12. Contact us",
    body: [
      "If you have questions about these Terms & Conditions, please contact us at legal@wakeelhub.pk or through our Contact page.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        description="Last updated: January 15, 2026. Please read these terms carefully before using the WakeelHub Pakistan platform."
      />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="border-border/80 p-6 sm:p-10">
          <p className="text-sm leading-7 text-muted-foreground">
            These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your access to and use of WakeelHub Pakistan,
            including our website and any related services (collectively, the &ldquo;Platform&rdquo;). Please read
            them carefully - by accessing or using WakeelHub, you agree to be bound by these Terms.
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
