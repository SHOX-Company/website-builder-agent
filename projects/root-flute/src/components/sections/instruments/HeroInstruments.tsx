import Image from "next/image";

// ─── Hero image ────────────────────────────────────────────────────────────────
//   instruments-hero.png — centered, object-contain, positioned behind headline.
//   Same cinematic treatment as the jewelry hero:
//   soft gradient masking on all edges, bottom feather clears body/CTA zone,
//   lower readability vignette deepens the canvas below the headline.
// ─────────────────────────────────────────────────────────────────────────────

export default function HeroInstruments() {
  return (
    <section className="relative min-h-[100svh] lg:min-h-[88vh] flex flex-col items-center justify-center overflow-hidden bg-[#07060B]">

      {/* ═══════════════════════════════════════════════════════════
          HERO IMAGE — instruments-hero.png
          Centered behind headline. object-contain preserves the
          full instrument composition. Bottom feather (50%) clears
          body copy and CTA. All four edges feathered into the dark.
          ═══════════════════════════════════════════════════════ */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 top-[16%] sm:top-[13%] lg:top-[8%] z-[1] w-[88%] sm:w-[66%] lg:w-[88%] h-[52%] sm:h-[60%] lg:h-[82%] pointer-events-none"
      >
        <Image
          src="/images/instruments/instruments-hero.png"
          alt=""
          fill
          priority
          unoptimized
          aria-hidden="true"
          className="object-contain object-center brightness-[0.62] saturate-[0.44]"
          sizes="(max-width: 640px) 88vw, 66vw"
        />
        {/* Top feather */}
        <div aria-hidden="true" className="absolute top-0 inset-x-0 h-[20%] bg-gradient-to-b from-[#07060B] via-[#07060B]/70 to-transparent pointer-events-none" />
        {/* Bottom feather — 50% clears below headline */}
        <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-[50%] bg-gradient-to-t from-[#07060B] via-[#07060B]/85 to-transparent pointer-events-none" />
        {/* Left edge */}
        <div aria-hidden="true" className="absolute inset-y-0 left-0 w-[14%] bg-gradient-to-r from-[#07060B] via-[#07060B]/50 to-transparent pointer-events-none" />
        {/* Right edge */}
        <div aria-hidden="true" className="absolute inset-y-0 right-0 w-[14%] bg-gradient-to-l from-[#07060B] via-[#07060B]/50 to-transparent pointer-events-none" />
      </div>


      {/* ═══════════════════════════════════════════════════════════
          ATMOSPHERIC LAYERS
          ═══════════════════════════════════════════════════════ */}

      {/* Lower readability vignette — deepens body/CTA zone */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_65%_48%_at_50%_76%,rgba(7,6,11,0.78),transparent_72%)] pointer-events-none"
      />

      {/* Ambient center depth */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_45%_38%_at_50%_46%,rgba(7,6,11,0.36),transparent_80%)] pointer-events-none"
      />

      {/* Gold resonance — barely perceptible warmth */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_22%_26%_at_50%_40%,rgba(196,151,58,0.042),transparent)] animate-ambient-breathe pointer-events-none"
      />

      {/* Bottom dissolution into collection section */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 z-[4] h-32 bg-gradient-to-t from-brand-dark to-transparent pointer-events-none"
      />

      {/* Top edge seal */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 z-[4] h-16 bg-gradient-to-b from-[#07060B] to-transparent pointer-events-none"
      />


      {/* ═══════════════════════════════════════════════════════════
          TYPOGRAPHY
          ═══════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-[15rem] sm:max-w-[18rem] mx-auto px-4 text-center flex flex-col items-center gap-5 sm:gap-6">

        {/* Eyebrow */}
        <p className="text-brand-gold/50 text-[9px] sm:text-[10px] uppercase tracking-[0.60em] font-sans">
          Handcrafted Instruments &nbsp;·&nbsp; RootFlute
        </p>

        {/* Headline */}
        <div
          className="flex flex-col font-display font-light tracking-tight leading-[0.97]"
          style={{ textShadow: "0 2px 48px rgba(0,0,0,0.92), 0 0 80px rgba(0,0,0,0.6)" }}
        >
          <span className="block text-brand-text text-[3.75rem] sm:text-[4.5rem] md:text-[5.25rem]">
            Carved.
          </span>
          <span className="block text-brand-text text-[3.75rem] sm:text-[4.5rem] md:text-[5.25rem]">
            Voiced.
          </span>
          <span
            className="block italic text-brand-gold text-[3.75rem] sm:text-[4.5rem] md:text-[5.25rem]"
            style={{ textShadow: "0 0 28px rgba(196,151,58,0.18), 0 2px 48px rgba(0,0,0,0.92)" }}
          >
            Presence.
          </span>
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          className="w-7 h-px bg-gradient-to-r from-transparent via-brand-gold/26 to-transparent"
        />

        {/* Body */}
        <p
          className="text-white/50 text-[0.84rem] sm:text-[0.9rem] font-light leading-relaxed max-w-[215px] sm:max-w-[240px]"
          style={{ textShadow: "0 2px 20px rgba(0,0,0,1)" }}
        >
          Handcrafted, intentional instruments for those who understand that sound is not produced — it is revealed.
        </p>

        {/* CTA */}
        <a
          href="#collection"
          className="group mt-1 inline-block text-brand-gold/60 text-[10px] sm:text-[11px] uppercase tracking-[0.52em] font-sans transition-colors duration-300 hover:text-brand-gold/88"
        >
          <span className="border-b border-brand-gold/18 pb-[2px] transition-colors duration-300 group-hover:border-brand-gold/45">
            View the Instruments
          </span>
        </a>

        {/* Micro-copy */}
        <p className="text-white/18 text-[10px] font-sans uppercase tracking-[0.38em]">
          Six instruments. Each made once.
        </p>

      </div>



    </section>
  );
}
