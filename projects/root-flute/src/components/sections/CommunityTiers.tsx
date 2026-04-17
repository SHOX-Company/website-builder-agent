import SectionWrapper from "@/components/ui/SectionWrapper";
import Button from "@/components/ui/Button";

const tiers = [
  {
    name: "The Root",
    tagline: "Start here. Stay close.",
    price: "$30",
    seats: "200 founding seats",
    cta: "Join The Root →",
    highlighted: false,
    benefits: [
      "One sound journey per month",
      "Private community access",
    ],
  },
  {
    name: "The Studio",
    tagline: "For people who actually play.",
    price: "$50",
    seats: "100 founding seats",
    cta: "Join The Studio →",
    highlighted: true,
    benefits: [
      "Two sound journeys per month",
      "Two live Q&As with Daniel",
      "Access to coupon codes for select RootFlute offerings",
    ],
  },
  {
    name: "The Circle",
    tagline: "As close as it gets.",
    price: "$80",
    seats: "50 founding seats",
    cta: "Join The Circle →",
    highlighted: false,
    benefits: [
      "Three sound journeys per month",
      "Three live Q&As with Daniel",
      "Additional intimate Q&A with Daniel, reserved for Tier 3",
      "Access to coupon codes for select RootFlute offerings",
      "Founding member recognition",
    ],
  },
];

export default function CommunityTiers() {
  return (
    <SectionWrapper id="community" className="bg-brand-surface-2">

      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
          Choose Your Path
        </p>
        <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text mb-4">
          Choose your depth.
        </h2>
        <p className="text-brand-muted text-base max-w-xl mx-auto">
          Each level opens a deeper layer of the same practice.
        </p>
      </div>

      {/* Tier grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mb-12">
        {tiers.map((tier) =>
          tier.highlighted ? (
            /* Elevated / Most Popular card */
            <div
              key={tier.name}
              className="relative bg-brand-surface border border-brand-gold p-8 md:py-12 md:-mt-4 md:-mb-4 flex flex-col gap-6 shadow-[0_0_80px_rgba(196,151,58,0.10)]"
            >
              {/* Most Popular badge */}
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-gold text-brand-dark text-xs font-bold uppercase tracking-widest px-4 py-1 whitespace-nowrap">
                Most Popular
              </span>

              <div className="flex flex-col gap-1 pt-2">
                <h3 className="font-display text-2xl font-light text-brand-text">
                  {tier.name}
                </h3>
                <p className="text-brand-muted text-sm italic">{tier.tagline}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-brand-gold">{tier.price}</span>
                <span className="text-brand-muted text-base font-normal">/mo</span>
              </div>

              <p className="text-brand-gold text-xs uppercase tracking-widest">
                {tier.seats}
              </p>

              <hr className="border-brand-gold/30" />

              <ul className="flex flex-col gap-3">
                {tier.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-sm leading-relaxed text-brand-text/80">
                    <span className="text-brand-gold flex-shrink-0 mt-0.5" aria-hidden="true">—</span>
                    {benefit}
                  </li>
                ))}
              </ul>

              <Button href="#community" variant="primary" size="md" className="w-full justify-center mt-auto">
                {tier.cta}
              </Button>
            </div>
          ) : (
            /* Standard card */
            <div
              key={tier.name}
              className="bg-brand-surface border border-brand-border p-8 flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-2xl font-light text-brand-text">
                  {tier.name}
                </h3>
                <p className="text-brand-muted text-sm italic">{tier.tagline}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-brand-text">{tier.price}</span>
                <span className="text-brand-muted text-base font-normal">/mo</span>
              </div>

              <p className="text-brand-gold text-xs uppercase tracking-widest">
                {tier.seats}
              </p>

              <hr className="border-brand-border" />

              <ul className="flex flex-col gap-3">
                {tier.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-sm leading-relaxed text-brand-muted">
                    <span className="text-brand-gold flex-shrink-0 mt-0.5" aria-hidden="true">—</span>
                    {benefit}
                  </li>
                ))}
              </ul>

              <Button href="#community" variant="secondary" size="md" className="w-full justify-center mt-auto">
                {tier.cta}
              </Button>
            </div>
          )
        )}
      </div>

      {/* Closing anchor */}
      <p className="text-center font-display text-2xl sm:text-3xl font-light italic text-brand-text/80 tracking-wide mt-20 max-w-2xl mx-auto leading-snug">
        Each level opens a deeper layer of the same practice.
      </p>

    </SectionWrapper>
  );
}
