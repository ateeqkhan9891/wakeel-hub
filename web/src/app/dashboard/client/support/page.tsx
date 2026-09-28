import type { Metadata } from "next";

import {
  AlertCircle,
  CreditCard,
  FileText,
  HelpCircle,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { ComplaintForm } from "@/components/dashboard/client/complaint-form";

export const metadata: Metadata = {
  title: "Support",
};

const SUPPORT_ITEMS = [
  {
    icon: AlertCircle,
    title: "Report an issue",
    description: "Booking, account, or service problems",
    tone: "blue",
  },
  {
    icon: CreditCard,
    title: "Payment support",
    description: "Payment, refund, or receipt issues",
    tone: "emerald",
  },
  {
    icon: FileText,
    title: "Case & booking",
    description: "Concerns about consultations or cases",
    tone: "slate",
  },
];

export default function ClientSupportPage() {
  return (
    <div className="space-y-5">
      <Card className="relative overflow-hidden border-slate-200 bg-white p-0 shadow-sm ring-0">
        <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-blue-50/70 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-14 -left-10 h-28 w-28 rounded-full bg-emerald-50/60 blur-2xl" />
        <div className="pointer-events-none absolute right-12 top-8 h-16 w-16 rounded-full border border-blue-100/70" />
        <div className="pointer-events-none absolute right-16 top-12 h-8 w-8 rounded-full border border-blue-100/50" />

        <div className="relative px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MessageSquare className="h-4.5 w-4.5" strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-lg font-semibold tracking-tight text-slate-950">
                  Support & Reports
                </h1>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                  <ShieldCheck className="h-3 w-3" />
                  Secure
                </span>
              </div>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                Need help with your account, booking, payment, or case? Tell
                us what happened and our support team will review your request.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {SUPPORT_ITEMS.map((item) => {
          const Icon = item.icon;

          const iconClass =
            item.tone === "blue"
              ? "bg-blue-50 text-blue-600"
              : item.tone === "emerald"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-100 text-slate-600";

          return (
            <div
              key={item.title}
              className="group rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconClass}`}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
              </div>

              <h2 className="mt-3 text-xs font-semibold text-slate-900">
                {item.title}
              </h2>

              <p className="mt-1 text-[11px] leading-4 text-slate-500">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      <Card className="relative overflow-hidden border-slate-200 bg-white p-0 shadow-sm ring-0">
        <div className="pointer-events-none absolute -right-14 -top-14 h-28 w-28 rounded-full bg-blue-50/50 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-24 w-24 rounded-full border border-slate-100" />

        <div className="relative flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <HelpCircle className="h-4 w-4" strokeWidth={1.8} />
          </div>

          <div>
            <h2 className="font-heading text-sm font-semibold text-slate-950">
              Submit a support request
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Provide the details below so we can investigate your issue.
            </p>
          </div>
        </div>

        <div className="relative p-4 sm:p-5">
          <ComplaintForm />
        </div>
      </Card>
    </div>
  );
}