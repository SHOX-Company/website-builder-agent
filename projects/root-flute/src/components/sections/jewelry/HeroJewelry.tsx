import Image from "next/image";

// ─── Selected hero images ─────────────────────────────────────────────────────
//
//   DOMINANT   eye-of-the-dragon-2.png — marquise amethyst eye, Ethiopian opal,
//              rosewood setting. Mountain + sky backdrop desaturates to cool
//              cinematic dark. The "eye" shape is the most iconic in the set.
//
//   SECONDARY  lavender-pendant-1.png  — oval amethyst + aquamarine in ivory/
//              bone frame. Softer geometry contrasts the Eye's sharp marquise.
//              Green bokeh dissolves naturally into near-black.
//
//   TERTIARY   triangle-pendant-1.png  — moonstone blue-flash, amber, gold inlay.
//              Sacred geometry. Almost shadow-level brightness — creates floor
//              depth without drawing attention. Hidden on mobile.
//
// ─────────────────────────────────────────────────────────────────────────────

export default function HeroJewelry() {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-[#07060B]">

      {/* ═══════════════════════════════════════════════════════════
          SECONDARY — lavender-pendant-1.png
          Upper-left anchor. Oval amethyst + aquamarine, ivory frame.
          Fades right + bottom into the sacred center darkness.
          All edges feathered — no visible image boundary.
          ═══════════════════════════════════════════════════════ */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 z-[1] w-[42%] sm:w-[36%] h-[52%] sm:h-[56%] pointer-events-none"
      >
        <Image
          src="/images/jewelry/lavender-pendant-1.png"
          alt=""
          fill
          priority
          unoptimized
          aria-hidden="true"
          className="object-cover object-[50%_48%] brightness-[0.56] saturate-[0.36]"
          sizes="(max-width: 640px) 42vw, 36vw"
        />
        {/* Top seal */}
        <div aria-hidden="true" className="absolute top-0 inset-x-0 h-[22%] bg-gradient-to-b from-[#07060B] via-[#07060B]/70 to-transparent pointer-events-none" />
        {/* Bottom feather — dissolves down into darkness */}
        <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-[48%] bg-gradient-to-t from-[#07060B] via-[#07060B]/75 to-transparent pointer-events-none" />
        {/* Right feather — dissolves toward center dark canvas */}
        <div aria-hidden="true" className="absolute inset-y-0 right-0 w-[55%] bg-gradient-to-r from-transparent via-[#07060B]/58 to-[#07060B] pointer-events-none" />
        {/* Left edge seal */}
        <div aria-hidden="true" className="absolute inset-y-0 left-0 w-[10%] bg-gradient-to-r from-[#07060B] to-transparent pointer-events-none" />
      </div>


      {/* ═══════════════════════════════════════════════════════════
          TERTIARY — triangle-pendant-1.png
          Lower-left depth layer. Moonstone blue-flash, amber, gold.
          Nearly shadow-level — creates spatial depth without
          competing for attention. Hidden on mobile.
          ═══════════════════════════════════════════════════════ */}
      <div
        aria-hidden="true"
        className="absolute left-0 bottom-[16%] z-[1] hidden sm:block w-[28%] h-[40%] pointer-events-none"
      >
        <Image
          src="/images/jewelry/triangle-pendant-1.png"
          alt=""
          fill
          unoptimized
          aria-hidden="true"
          className="object-cover object-[50%_44%] brightness-[0.44] saturate-[0.26]"
          sizes="28vw"
        />
        {/* Top feather — dissolves up into darkness */}
        <div aria-hidden="true" className="absolute top-0 inset-x-0 h-[48%] bg-gradient-to-b from-[#07060B] via-[#07060B]/72 to-transparent pointer-events-none" />
        {/* Bottom seal */}
        <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-[20%] bg-gradient-to-t from-[#07060B] via-[#07060B]/65 to-transparent pointer-events-none" />
        {/* Right feather */}
        <div aria-hidden="true" className="absolute inset-y-0 right-0 w-[58%] bg-gradient-to-r from-transparent via-[#07060B]/58 to-[#07060B] pointer-events-none" />
        {/* Left edge seal */}
        <div aria-hidden="true" className="absolute inset-y-0 left-0 w-[10%] bg-gradient-to-r from-[#07060B] to-transparent pointer-events-none" />
      </div>


      {/* ═══════════════════════════════════════════════════════════
          DOMINANT — eye-of-the-dragon-2.png
          Right-side hero. The Eye — amethyst marquise, opal fire,
          rosewood. Contained height (not full-bleed) preserves
          breathing room above and below. Left edge dissolves
          across more than half the container width — the pendant
          appears to emerge from the darkness on the right.
          ═══════════════════════════════════════════════════════ */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-[4%] z-[2] w-[56%] sm:w-[46%] h-[82%] sm:h-[88%] pointer-events-none"
      >
        <Image
          src="/images/jewelry/eye-of-the-dragon-2.png"
          alt=""
          fill
          priority
          unoptimized
          aria-hidden="true"
          className="object-cover object-[50%_34%] brightness-[0.70] saturate-[0.46]"
          sizes="(max-width: 640px) 56vw, 46vw"
        />
        {/* Top seal */}
        <div aria-hidden="true" className="absolute top-0 inset-x-0 h-[16%] bg-gradient-to-b from-[#07060B] via-[#07060B]/60 to-transparent pointer-events-none" />
        {/* Bottom feather */}
        <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-[26%] bg-gradient-to-t from-[#07060B] via-[#07060B]/65 to-transparent pointer-events-none" />
        {/* Left feather — dissolves toward center text canvas */}
        <div aria-hidden="true" className="absolute inset-y-0 left-0 w-[58%] bg-gradient-to-l from-transparent via-[#07060B]/55 to-[#07060B] pointer-events-none" />
        {/* Right edge seal */}
        <div aria-hidden="true" className="absolute inset-y-0 right-0 w-[8%] bg-gradient-to-l from-[#07060B] to-transparent pointer-events-none" />
      </div>


      {/* ═══════════════════════════════════════════════════════════
          ATMOSPHERIC LAYERS
          Restrained — the darkness is the atmosphere.
          One gentle gold breath. Nothing that competes with the text.
          ═══════════════════════════════════════════════════════ */}

      {/* Center-darkness pool: deepens the canvas between pieces */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_38%_52%_at_46%_50%,rgba(7,6,11,0.42),transparent_80%)] pointer-events-none"
      />

      {/* Gold resonance: 4% warmth only — a whisper, not a glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_24%_30%_at_48%_48%,rgba(196,151,58,0.042),transparent)] animate-ambient-breathe pointer-events-none"
      />

      {/* Bottom dissolution into the collection section */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 z-[4] h-44 bg-gradient-to-t from-brand-dark to-transparent pointer-events-none"
      />

      {/* Top edge seal */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 z-[4] h-16 bg-gradient-to-b from-[#07060B] to-transparent pointer-events-none"
      />


      {/* ═══════════════════════════════════════════════════════════
          TYPOGRAPHY
          Lives in the dark center canvas between the three pieces.
          Hermès register: tracked text link, no gold button.
          ═══════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-[15rem] sm:max-w-[17rem] mx-auto px-4 text-center flex flex-col items-center gap-5 sm:gap-6">

        {/* Eyebrow */}
        <p className="text-brand-gold/50 text-[9px] sm:text-[10px] uppercase tracking-[0.60em] font-sans">
          Sacred Adornment &nbsp;·&nbsp; RootFlute
        </p>

        {/* Headline */}
        <div
          className="flex flex-col font-display font-light tracking-tight leading-[0.97]"
          style={{ textShadow: "0 4px 52px rgba(0,0,0,1)" }}
        >
          <span className="block text-brand-text text-[3.75rem] sm:text-[4.5rem] md:text-[5.25rem]">
            Worn.
          </span>
          <span className="block text-brand-text text-[3.75rem] sm:text-[4.5rem] md:text-[5.25rem]">
            Held.
          </span>
          <span
            className="block italic text-brand-gold text-[3.75rem] sm:text-[4.5rem] md:text-[5.25rem]"
            style={{ textShadow: "0 0 28px rgba(196,151,58,0.15), 0 4px 52px rgba(0,0,0,1)" }}
          >
            Felt.
          </span>
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          className="w-7 h-px bg-gradient-to-r from-transparent via-brand-gold/26 to-transparent"
        />

        {/* Body */}
        <p
          className="text-white/50 text-[0.84rem] sm:text-[0.9rem] font-light leading-relaxed max-w-[210px] sm:max-w-[235px]"
          style={{ textShadow: "0 2px 28px rgba(0,0,0,1)" }}
        >
          Handcrafted ceremonial adornment for those who carry the practice into their body.
        </p>

        {/* CTA — luxury text link */}
        <a
          href="#collection"
          className="group mt-1 inline-block text-brand-gold/60 text-[10px] sm:text-[11px] uppercase tracking-[0.52em] font-sans transition-colors duration-300 hover:text-brand-gold/88"
        >
          <span className="border-b border-brand-gold/18 pb-[2px] transition-colors duration-300 group-hover:border-brand-gold/45">
            View the Collection
          </span>
        </a>

        {/* Micro-copy */}
        <p className="text-white/18 text-[10px] font-sans uppercase tracking-[0.38em]">
          Three pieces. Each made once.
        </p>

      </div>


      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-[0.20] pointer-events-none">
        <span className="text-brand-muted text-[9px] uppercase tracking-[0.22em] font-sans">Scroll</span>
        <div className="w-px h-7 bg-brand-muted/40 animate-pulse" />
      </div>

    </section>
  );
}
