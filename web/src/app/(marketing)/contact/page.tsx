import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the WakeelHub Pakistan team - for support, lawyer verification, billing questions, or partnership inquiries.",
  alternates: { canonical: "/contact" },
};

const CONTACT_DETAILS = [
  {
    icon: MapPin,
    title: "Head office",
    lines: ["WakeelHub Pakistan", "Floor 4, Evacuee Trust Complex", "F-5/1, Islamabad, Pakistan"],
  },
  {
    icon: Phone,
    title: "Phone & WhatsApp",
    lines: ["+92 51 111 925 335", "Mon - Sat, 9:00 AM - 7:00 PM PKT"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["support@wakeelhub.pk", "lawyers@wakeelhub.pk"],
  },
  {
    icon: MessageCircle,
    title: "Live chat",
    lines: ["Available from your dashboard", "Typical response time: under 2 hours"],
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact us"
        title="We'd love to hear from you"
        description="Whether you have a question about finding a lawyer, growing your practice, or anything else - our team is ready to help."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">Get in touch</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Reach out using the form, or contact us directly using the details below. Our support team typically
              responds within one business day.
            </p>

            <div className="mt-6 space-y-4">
              {CONTACT_DETAILS.map((detail) => (
                <Card key={detail.title} className="border-border/80 p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <detail.icon className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{detail.title}</p>
                      {detail.lines.map((line) => (
                        <p key={line} className="text-sm text-muted-foreground">{line}</p>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <Card className="border-border/80 p-6 sm:p-8">
              <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">Send us a message</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Fill out the form below and a member of our team will get back to you shortly.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
