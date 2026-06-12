import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/shared/section-heading";
import { FAQS } from "@/lib/constants";

export function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Everything you need to know about using WakeelHub - for clients and lawyers alike."
      />
      <Accordion type="single" collapsible className="mt-10 w-full">
        {FAQS.map((faq, i) => (
          <AccordionItem key={faq.question} value={`item-${i}`} className="border-border/80">
            <AccordionTrigger className="text-left font-heading text-base font-medium text-foreground hover:text-primary">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-6 text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
