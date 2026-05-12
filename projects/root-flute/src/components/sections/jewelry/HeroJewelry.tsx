import Image from "next/image";

// ─── Hero image selection ──────────────────────────────────────────────────────
//
//   PRIMARY    pendant-array-1.png  — full arrangement of all three pieces.
//              Bottom-centered, object-contain so nothing is cropped.
//              Materializes from below into the dark canvas. Feathered deeply
//              on top so pieces emerge beneath the typography without competing.
//
//   SECONDARY  pearl-vision-1.png   — single ametrine/pearl pendant.
//              Upper-left atmospheric whisper. Very low brightness — a presence
//              only. Hidden on mobile for clean negative-space mobile layout.
//
// ─────────────────────────────────────────────────────────────────────────────

export default function HeroJewelry() {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-[#07060B]">

      {/* ═══════════════════════════════════════════════════════════
          SECONDARY — pearl-vision-1.png
          Upper-left atmospheric accent. Very faded — a presence,
          not a feature. Creates counterweight to the array below.
          Hidden on mobile; pure negative space there.
          ═══════════════════════════════════════════════════════ */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 z-[1] hidden sm:block w-[30%] h-[46%] pointer-events-none"
      >
        <Image
          src="/images/jewelry/pearl-vision-1.png"
          alt=""
          fill
          unoptimized
          aria-hidden="true"
          className="object-cover object-[50%_40%] brightness-[0.36] saturate-[0.20]"
          sizes="30vw"
        />
        {/* Top seal */}
        <div aria-hidden="true" className="absolute top-0 inset-x-0 h-[20%] bg-gradient-to-b from-[#07060B] to-transparent pointer-events-none" />
        {/* Bottom feather — deep dissolve into darkness */}
        <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-[58%] bg-gradient-to-t from-[#07060B] via-[#07060B]/80 to-transparent pointer-events-none" />
        {/* Right feather — dissolves toward center canvas */}
        <div aria-hidden="true" className="absolute inset-y-0 right-0 w-[62%] bg-gradient-to-r from-transparent via-[#07060B]/68 to-[#07060B] pointer-events-none" />
        {/* Left edge seal */}
        <div aria-hidden="true" className="absolute inset-y-0 left-0 w-[12%] bg-gradient-to-r from-[#07060B] to-transparent pointer-events-none" />
      </div>


      {/* ═══════════════════════════════════════════════════════════
          PRIMARY — pendant-array-1.png
          Bottom-center anchor. object-contain ensures the full
          arrangement of all three pieces is visible — no cropping.
          Top feather spans 60% of container — the pendants rise
          from beneath the typography, materializing from darkness.
          ═══════════════════════════════════════════════════════ */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 bottom-0 z-[2] w-[90%] sm:w-[68%] h-[52%] sm:h-[60%] pointer-events-none"
      >
        <Image
          src="/images/jewelry/pendant-array-1.png"
          alt=""
          fill
          priority
          unoptimized
          aria-hidden="true"
          className="object-contain object-bottom brightness-[0.60] saturate-[0.42]"
          sizes="(max-width: 640px) 90vw, 68vw"
        />
        {/* Top feather — deep dissolve up into text zone */}
        <div aria-hidden="true" className="absolute top-0 inset-x-0 h-[60%] bg-gradient-to-b from-[#07060B] via-[#07060B]/84 to-transparent pointer-events-none" />
        {/* Bottom seal */}
        <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-[6%] bg-gradient-to-t from-[#07060B] to-transparent pointer-events-none" />
        {/* Left feather */}
        <div aria-hidden="true" className="absolute inset-y-0 left-0 w-[16%] bg-gradient-to-r from-[#07060B] via-[#07060B]/55 to-transparent pointer-events-none" />
        {/* Right feather */}
        <div aria-hidden="true" className="absolute inset-y-0 right-0 w-[16%] bg-gradient-to-l from-[#07060B] via-[#07060B]/55 to-transparent pointer-events-none" />
      </div>


      {/* ═══════════════════════════════════════════════════════════
          ATMOSPHERIC LAYERS
          Center darkness pool deepens the canvas above the array.
          Gold resonance: 3.6% warmth only — a whisper.
          ═══════════════════════════════════════════════════════ */}

      {/* Center-darkness pool — protects text readability */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_52%_62%_at_50%_42%,rgba(7,6,11,0.54),transparent_80%)] pointer-events-none"
      />

      {/* Gold resonance — barely there */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_20%_24%_at_50%_46%,rgba(196,151,58,0.036),transparent)] animate-ambient-breathe pointer-events-none"
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
          Lives in the dark upper-center canvas — breathing room
          above, array emerging from below.
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
