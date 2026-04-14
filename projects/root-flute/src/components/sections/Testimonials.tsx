import SectionWrapper from "@/components/ui/SectionWrapper";

const testimonials = [
  {
    quote:
      "This community changed how I approach my daily practice. Dan's presence in the workshops is unlike anything I've experienced in an online space.",
    name: "Sarah M.",
    tier: "The Studio Member",
  },
  {
    quote:
      "I joined for the flute access but stayed for the sound journeys. The monthly live sessions have become the most important hour of my month.",
    name: "James A.",
    tier: "The Circle Member",
  },
  {
    quote:
      "Being in The Root gave me a community of people who actually take this seriously. The technique tips alone are worth the membership.",
    name: "Priya K.",
    tier: "The Root Member",
  },
];

export default function Testimonials() {
  return (
    <SectionWrapper className="bg-brand-surface-2">

      <div className="text-center mb-14">
        <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
          From the Community
        </p>
        <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text">
          What members say.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="bg-brand-surface border border-brand-border p-8 flex flex-col gap-6"
          >
            <blockquote className="font-display text-lg font-light italic text-brand-text leading-relaxed flex-1">
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            <div className="border-t border-brand-border pt-5 flex items-center justify-between gap-4 flex-wrap">
              <span className="text-brand-text text-sm font-semibold">{t.name}</span>
              <span className="border border-brand-gold/40 text-brand-gold text-xs uppercase tracking-widest px-3 py-1">
                {t.tier}
              </span>
            </div>
          </div>
        ))}
      </div>

    </SectionWrapper>
  );
}
