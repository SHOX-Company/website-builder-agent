import SectionWrapper from "@/components/ui/SectionWrapper";
import Button from "@/components/ui/Button";

// Benefit lists mirror the Skool plan benefits exactly — Skool is the source
// of truth. Guided Sound Meditations are never described as live or by
// delivery format; the Q&As are live.
const TIERS = [
  {
    name: "Standard",
    price: "$35",
    benefits: [
      "2 Guided Sound Meditations with Daniel each month",
      "Exclusive members-only RootFlute content",
      "Massive video and audio library",
      "Full access to the RootFlute Society community",
    ],
  },
  {
    name: "Premium",
    price: "$60",
    benefits: [
      "2 Guided Sound Meditations with Daniel each month",
      "2 live Q&A sessions with Daniel each month",
      "Behind-the-scenes access to Daniel's private workshop",
      "Instructional videos",
      "Exclusive members-only RootFlute content",
      "Massive video and audio library",
      "Full access to the RootFlute Society community",
    ],
  },
  {
    name: "VIP",
    price: "$135",
    benefits: [
      "Everything in Premium.",
      "Plus 1 private 30-minute one-on-one lesson with Daniel each month",
    ],
  },
];

export default function CommunityTiers() {
  return (
    <SectionWrapper className="bg-brand-surface-2">
      {/* Scroll target: sits inside content so CTA lands with heading visible below FloatingLogo */}
      <div id="community" className="scroll-mt-20 sm:scroll-mt-24" />

      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
          Limited Availability
        </p>
        <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text mb-4">
          Become a Founding Member.
        </h2>
        <p className="text-brand-muted text-base max-w-lg mx-auto">
          Founding members lock in their rate for life. When the seats are gone, the price goes up.
        </p>
      </div>

      {/* Offer cards — Standard + Premium + VIP */}
      <div className="max-w-lg lg:max-w-none mx-auto grid grid-cols-1 lg:grid-cols-3 gap-14 lg:gap-8">
        {TIERS.map((tier) => (
        <div key={tier.name} className="relative bg-brand-surface border border-brand-gold p-10 sm:p-14 lg:p-8 flex flex-col gap-8 shadow-[0_0_80px_rgba(196,151,58,0.10)]">

          {/* Founding Member badge */}
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-gold text-brand-dark text-xs font-bold uppercase tracking-widest px-5 py-1.5 whitespace-nowrap">
            Founding Member
          </span>

          {/* Tier + Price */}
          <div className="flex flex-col gap-3 pt-2">
            <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans">
              {tier.name}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-6xl font-light text-brand-gold">{tier.price}</span>
              <span className="text-brand-muted text-lg">/month</span>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-brand-gold/30" />

          {/* Benefits */}
          <ul className="flex flex-col gap-4">
            {tier.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-4 text-base leading-relaxed text-brand-text/90">
                <span className="text-brand-gold flex-shrink-0 mt-0.5" aria-hidden="true">—</span>
                {benefit}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Button href="https://skool.com/rootflute" target="_blank" rel="noopener noreferrer" variant="primary" size="lg" className="w-full justify-center mt-auto lg:px-4 lg:text-base">
            Join the Community →
          </Button>

          {/* Reassurance */}
          <p className="text-center text-brand-muted text-xs">
            7-day free trial. Month-to-month. Cancel anytime. Rate locked forever.
          </p>

        </div>
        ))}
      </div>

      {/* Closing line */}
      <p className="text-center font-display text-2xl sm:text-3xl font-light italic text-brand-text/70 tracking-wide mt-20 max-w-2xl mx-auto leading-snug">
        This is proximity to the practice. Not a subscription. A seat.
      </p>

    </SectionWrapper>
  );
}
