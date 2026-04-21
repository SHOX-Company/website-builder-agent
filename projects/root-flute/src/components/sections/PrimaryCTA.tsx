import Button from "@/components/ui/Button";

export default function PrimaryCTA() {
  return (
    <section className="relative bg-brand-dark py-32 overflow-hidden">

      {/* Radial gold bloom */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(196,151,58,0.06),transparent)]"
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center flex flex-col items-center gap-8">

        <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans">
          Founding Member Access
        </p>

        <h2 className="font-display text-5xl sm:text-6xl font-light text-brand-text leading-tight">
          The price you join at is the price you keep. Forever.
        </h2>

        <p className="text-brand-muted text-base">
          Founding membership is limited. When the seats are gone, the rate goes up.
        </p>

        <Button href="#community" size="lg" variant="primary">
          Claim Your Founding Seat →
        </Button>

        <p className="text-brand-muted text-xs">
          $35/month. Cancel anytime. Founding rate locked for life.
        </p>

      </div>
    </section>
  );
}
