import { MessageSquareText } from "lucide-react";

import type { Lawyer } from "@/lib/types";

import { PRACTICE_AREAS } from "@/lib/constants";

type LawyerProfileFaqsProps = {
  lawyer: Lawyer;
};

export function LawyerProfileFaqs({
  lawyer,
}: LawyerProfileFaqsProps) {
  const faqs = getLawyerProfileFaqs(lawyer);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
          <MessageSquareText className="h-4 w-4" />
        </span>

        <div>
          <h2 className="font-heading text-base font-semibold tracking-tight text-slate-950">
            Frequently asked questions
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Common questions about this advocate
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {faqs.map((faq) => (
          <div
            key={faq.question}
            className="py-4 first:pt-0 last:pb-0"
          >
            <h3 className="font-heading text-sm font-semibold text-slate-950">
              {faq.question}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function getLawyerProfileFaqs(lawyer: Lawyer) {
  const practiceAreas =
    lawyer.practiceAreas.map(practiceAreaName).join(", ") ||
    "legal matters";

  const courts = lawyer.courts.length
    ? lawyer.courts.join(", ")
    : `${lawyer.city} courts`;

  const languages = lawyer.languages.length
    ? lawyer.languages.join(", ")
    : "languages listed on the profile";

  return [
    {
      question: `What practice areas does ${lawyer.fullName} handle?`,
      answer: `${lawyer.fullName} lists ${practiceAreas} on this WakeelHub profile. You should confirm whether your specific facts fall within the lawyer's current practice before hiring.`,
    },
    {
      question: `Where does ${lawyer.fullName} practice?`,
      answer: `${lawyer.fullName} is listed in ${lawyer.city}, Pakistan, with courts shown as ${courts}. Court availability can depend on the matter and schedule.`,
    },
    {
      question: `What languages are listed for ${lawyer.fullName}?`,
      answer: `This profile lists ${languages}. Confirm your preferred language when requesting a consultation.`,
    },
    {
      question: "Is this profile legal advice?",
      answer:
        "No. WakeelHub is a lawyer marketplace and does not provide legal advice. Book a consultation with a qualified advocate for advice on your specific facts.",
    },
  ];
}

function practiceAreaName(slug: string) {
  return (
    PRACTICE_AREAS.find((area) => area.slug === slug)?.name ??
    slug.replace(/-/g, " ")
  );
}