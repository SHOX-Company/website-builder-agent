import Image from "next/image";

export default function HeroJewelry() {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-[#07060B]">

      {/* ══════════════════════════════════════════════════════════════
          LEFT — root-array-flower.png
          Multi-piece hanging group. Upper-left quadrant of the frame.
          Phone chrome (top) and Instagram UI (bottom) hidden by
          aggressive gradient masks. Right edge dissolves into the
          sacred dark center canvas.
          ══════════════════════════════════════════════════════════ */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 z-[1] w-[55%] sm:w-[58%] h-[70%] sm:h-[80%] pointer-events-none"
      >
        <Image
          src="/images/jewelry/root-array-flower.png"
          alt=""
          fill
          priority
          unoptimized
          aria-hidden="true"
          className="object-cover object-[22%_38%] brightness-[0.60] saturate-[0.42]"
          sizes="(max-width: 640px) 55vw, 58vw"
        />
        {/* Top — hides phone status bar & Instagram header */}
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-[30%] bg-gradient-to-b from-[#07060B] via-[#07060B]/80 to-transparent pointer-events-none"
        />
        {/* Bottom — hides Instagram share UI & bottom chrome */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-[35%] bg-gradient-to-t from-[#07060B] via-[#07060B]/70 to-transparent pointer-events-none"
        />
        {/* Right — dissolves image toward the dark center */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-[52%] bg-gradient-to-r from-transparent via-[#07060B]/50 to-[#07060B] pointer-events-none"
        />
        {/* Left edge reinforcement */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[8%] bg-gradient-to-r from-[#07060B] to-transparent pointer-events-none"
        />
      </div>


      {/* ══════════════════════════════════════════════════════════════
          RIGHT — dragon-eye-pendant.png
          The Eye of Dragon — amethyst marquise, Ethiopian opal,
          Burmese rosewood setting. Contained height for breathing
          room above and below — not full-bleed, not a wallpaper.
          Phone chrome and Instagram caption masked by gradients.
          Left edge dissolves into the dark center canvas.
          ══════════════════════════════════════════════════════════ */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-[5%] z-[1] w-[52%] sm:w-[44%] h-[82%] sm:h-[88%] pointer-events-none"
      >
        <Image
          src="/images/jewelry/dragon-eye-pendant.png"
          alt=""
          fill
          priority
          unoptimized
          aria-hidden="true"
          className="object-cover object-[52%_40%] brightness-[0.75] saturate-[0.55]"
          sizes="(max-width: 640px) 52vw, 44vw"
        />
        {/* Top — hides phone status bar & Instagram header */}
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-[26%] bg-gradient-to-b from-[#07060B] via-[#07060B]/70 to-transparent pointer-events-none"
        />
        {/* Bottom — hides "Eye of dragon" caption & Android nav bar */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-[32%] bg-gradient-to-t from-[#07060B] via-[#07060B]/70 to-transparent pointer-events-none"
        />
        {/* Left — dissolves toward the dark center canvas */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[54%] bg-gradient-to-l from-transparent via-[#07060B]/50 to-[#07060B] pointer-events-none"
        />
        {/* Right edge — slight taper at viewport edge */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-[6%] bg-gradient-to-l from-[#07060B] to-transparent pointer-events-none"
        />
      </div>


      {/* ══════════════════════════════════════════════════════════════
          ATMOSPHERIC LAYERS — restrained, not glowy
          ══════════════════════════════════════════════════════════ */}

      {/* Center-pool: deepens the canvas between the two pieces */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_36%_58%_at_50%_50%,rgba(7,6,11,0.50)_0%,transparent_80%)] pointer-events-none"
      />

      {/* Gold resonance — 4% warmth, barely perceptible */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_28%_34%_at_50%_47%,rgba(196,151,58,0.04)_0%,transparent_100%)] animate-ambient-breathe pointer-events-none"
      />

      {/* Bottom dissolution into the collection section */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 z-[3] h-48 bg-gradient-to-t from-brand-dark to-transparent pointer-events-none"
      />

      {/* Top edge reinforcement */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 z-[3] h-16 bg-gradient-to-b from-[#07060B] to-transparent pointer-events-none"
      />


      {/* ══════════════════════════════════════════════════════════════
          TYPOGRAPHY — Hermès register
          The text occupies the sacred dark center between the pieces.
          No large gold button. Tracked text link instead.
          ══════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-[17rem] sm:max-w-xs mx-auto px-4 text-center flex flex-col items-center gap-5 sm:gap-6">

        {/* Eyebrow */}
        <p className="text-brand-gold/50 text-[9px] sm:text-[10px] uppercase tracking-[0.62em] font-sans">
          Sacred Adornment &nbsp;·&nbsp; RootFlute
        </p>

        {/* Headline — stacked, tight leading */}
        <div className="flex flex-col gap-0 font-display font-light tracking-tight leading-[0.97] [text-shadow:0_4px_48px_rgba(0,0,0,1)]">
          <span className="block text-brand-text text-[3.85rem] sm:text-[4.75rem] md:text-[5.5rem]">
            Worn.
          </span>
          <span className="block text-brand-text text-[3.85rem] sm:text-[4.75rem] md:text-[5.5rem]">
            Held.
          </span>
          <span className="block italic text-brand-gold text-[3.85rem] sm:text-[4.75rem] md:text-[5.5rem] [text-shadow:0_0_30px_rgba(196,151,58,0.16),0_4px_48px_rgba(0,0,0,1)]">
            Felt.
          </span>
        </div>

        {/* Hair-line divider */}
        <div
          aria-hidden="true"
          className="w-8 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent"
        />

        {/* Body copy */}
        <p className="text-white/50 text-sm font-light leading-relaxed max-w-[240px] sm:max-w-[260px] [text-shadow:0_2px_24px_rgba(0,0,0,0.95)]">
          Handcrafted ceremonial adornment for those who carry the practice into their body.
        </p>

        {/* CTA — luxury text link, not a button */}
        <a
          href="#collection"
          className="group mt-1 inline-block text-brand-gold/60 text-[10px] sm:text-[11px] uppercase tracking-[0.52em] font-sans transition-colors duration-300 hover:text-brand-gold/90"
        >
          <span className="border-b border-brand-gold/20 pb-[2px] transition-colors duration-300 group-hover:border-brand-gold/50">
            View the Collection
          </span>
        </a>

        {/* Micro-copy */}
        <p className="text-white/20 text-[10px] font-sans uppercase tracking-[0.38em]">
          Three pieces. Each made once.
        </p>

      </div>


      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-[0.22] pointer-events-none">
        <span className="text-brand-muted text-[9px] uppercase tracking-[0.22em] font-sans">Scroll</span>
        <div className="w-px h-7 bg-brand-muted/45 animate-pulse" />
      </div>

    </section>
  );
}
