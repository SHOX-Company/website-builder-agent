import Button from "@/components/ui/Button";

export default function FinalCTAFlutes() {
  return (
    <section id="acquire" className="relative bg-brand-dark py-36 overflow-hidden">

      {/* Gold bloom */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(196,151,58,0.08),transparent)]"
      />

      {/* Horizontal accent lines */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent"
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-10">

        <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans">
          One Available Now
        </p>

        <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-light text-brand-text leading-tight">
          Own a
          <br />
          <span className="italic text-brand-gold">Once-in-a-Lifetime</span>
          <br />
          Instrument.
        </h2>

        <p className="text-brand-muted text-base sm:text-lg leading-relaxed max-w-xl">
          Ancient material. Singular craft. A voice that no factory, no technology, and no
          future craftsman can replicate. This is not a purchase — it is a stewardship of
          something irreplaceable.
        </p>

        <p className="font-display text-3xl sm:text-4xl font-light italic text-brand-gold/75">
          Impossible to replicate.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center flex-wrap">
          <Button href="#current-drop" variant="primary" size="lg">
            View Current Offering →
          </Button>
        </div>

        <p className="text-brand-muted/50 text-xs">
          Only 25 Woolly Mammoth tusks remain. Each acquisition is handled personally by Daniel.
        </p>

      </div>
    </section>
  );
}
