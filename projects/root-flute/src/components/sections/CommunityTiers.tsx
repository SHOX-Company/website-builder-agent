import SectionWrapper from "@/components/ui/SectionWrapper";
import Button from "@/components/ui/Button";

const DISPLAYED_BENEFITS = [
  "2 Live Sound Journeys Monthly",
  "2 Live Q&A Sessions Hosted by Daniel Monthly",
  "Private Community Access",
  "Founding Member Price Locked for Life",
  "Member Discounts on Future Offerings",
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

      {/* Single offer card */}
      <div className="max-w-lg mx-auto">
        <div className="relative bg-brand-surface border border-brand-gold p-10 sm:p-14 flex flex-col gap-8 shadow-[0_0_80px_rgba(196,151,58,0.10)]">

          {/* Founding Member badge */}
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-gold text-brand-dark text-xs font-bold uppercase tracking-widest px-5 py-1.5 whitespace-nowrap">
            Founding Member
          </span>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-2">
            <span className="font-display text-6xl font-light text-brand-gold">$35</span>
            <span className="text-brand-muted text-lg">/month</span>
          </div>

          {/* Divider */}
          <hr className="border-brand-gold/30" />

          {/* Benefits */}
          <ul className="flex flex-col gap-4">
            {DISPLAYED_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-4 text-base leading-relaxed text-brand-text/90">
                <span className="text-brand-gold flex-shrink-0 mt-0.5" aria-hidden="true">—</span>
                {benefit}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Button href="#community" variant="primary" size="lg" className="w-full justify-center">
            Join the Community →
          </Button>

          {/* Reassurance */}
          <p className="text-center text-brand-muted text-xs">
            Month-to-month. Cancel anytime. Rate locked forever.
          </p>

        </div>
      </div>

      {/* Closing line */}
      <p className="text-center font-display text-2xl sm:text-3xl font-light italic text-brand-text/70 tracking-wide mt-20 max-w-2xl mx-auto leading-snug">
        This is proximity to the practice. Not a subscription. A seat.
      </p>

    </SectionWrapper>
  );
}
