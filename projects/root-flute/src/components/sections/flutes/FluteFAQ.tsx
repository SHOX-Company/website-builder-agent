import SectionWrapper from "@/components/ui/SectionWrapper";

const faqs = [
  {
    q: "Why are these instruments priced so high?",
    a: "The materials alone are extraordinarily rare — Woolly Mammoth tusk has not been naturally replenished for 10,000 years. Combined with 20+ years of craft, weeks of hand-tuning per instrument, and the one-of-one nature of each piece, these flutes are priced in the same category as fine art. They are not purchased. They are acquired.",
  },
  {
    q: "What materials are used?",
    a: "Daniel works primarily with ancient Woolly Mammoth tusk and naturally shed elk antler — both ethically sourced. No living animal is harmed. The tusk is prehistoric material recovered from permafrost deposits, and is legal to own worldwide. Each piece carries unique grain, density, and resonance properties that cannot be replicated.",
  },
  {
    q: "Is each flute truly unique?",
    a: "Yes. Every piece of tusk is different in density, grain, and internal structure. Daniel works in response to the material — which means no two instruments are ever built the same way. There is no mold, no template, no duplication. When yours is built, it is the only one of its kind that will ever exist.",
  },
  {
    q: "How does shipping and delivery work?",
    a: "Each instrument is packed and shipped directly by Daniel, insured for full value. Domestic delivery typically takes 5–10 business days after completion. International shipping is available and arranged case by case. Commissioned pieces require 4–16 weeks depending on complexity and materials.",
  },
  {
    q: "Can I commission a custom flute?",
    a: "Yes — by application only. Daniel reviews each request personally and accepts commissions selectively based on alignment with the intended use. Commissions range from $3,000–$20,000+ depending on materials and complexity. Only 25 Woolly Mammoth tusks remain available for custom work. Begin by inquiring below.",
  },
];

export default function FluteFAQ() {
  return (
    <SectionWrapper className="bg-brand-surface">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-14">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
            Questions
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text">
            Everything you need to know.
          </h2>
        </div>

        <div className="flex flex-col divide-y divide-brand-border">
          {faqs.map((faq) => (
            <details key={faq.q} className="group py-7">
              <summary className="flex items-start justify-between gap-4">
                <h3 className="font-display text-xl sm:text-2xl font-light text-brand-text leading-snug pr-4">
                  {faq.q}
                </h3>
                <span
                  aria-hidden="true"
                  className="text-brand-gold text-2xl flex-shrink-0 mt-0.5 font-light transition-transform duration-200 group-open:rotate-45 leading-none"
                >
                  +
                </span>
              </summary>
              <p className="text-brand-muted text-base leading-relaxed mt-5 max-w-2xl">
                {faq.a}
              </p>
            </details>
          ))}
        </div>

      </div>
    </SectionWrapper>
  );
}
