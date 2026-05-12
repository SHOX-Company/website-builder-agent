import Image from "next/image";
import Button from "@/components/ui/Button";

export default function HeroJewelry() {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden">

      {/* ── Base: sacred near-black with blue-violet undertone ────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[#07060B]"
      />

      {/* ── Primary hero image ─────────────────────────────────────────
          root-pendant.png: moonstone + amber + oxidised silver setting.
          Desaturated to pull the green bokeh background to near-black,
          leaving the gemstone quality and metal texture to carry through.
          Slow Ken-Burns scale gives the piece a living, breathing quality. */}
      <Image
        src="/images/jewelry/root-pendant.png"
        alt=""
        fill
        priority
        aria-hidden="true"
        unoptimized
        className="absolute inset-0 z-[1] object-cover object-center brightness-[0.58] saturate-[0.32] animate-[hero-scale_30s_ease-in-out_infinite_alternate]"
        sizes="100vw"
      />

      {/* ── Secondary depth layer ──────────────────────────────────────
          amethyst-case-pendent.png: group of ceremonial pieces resting
          on raw amethyst. At 7% opacity the purple-violet tones add
          atmospheric depth without visual noise. Positioned bottom-right
          so it reads as the shadow of other worlds beyond the frame.     */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 z-[1] w-[50%] h-[55%] overflow-hidden pointer-events-none"
      >
        <Image
          src="/images/jewelry/amethyst-case-pendent.png"
          alt=""
          fill
          aria-hidden="true"
          unoptimized
          className="object-cover object-[70%_10%] opacity-[0.07] brightness-90 saturate-[0.4]"
          sizes="50vw"
        />
      </div>

      {/* ── Cinematic vignette ─────────────────────────────────────────
          Transparent center preserves the piece's glow; dark edges
          frame it like a sacred object under a museum spot. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_58%_62%_at_50%_44%,transparent_25%,rgba(7,6,11,0.65)_72%,rgba(7,6,11,0.96)_100%)]"
      />

      {/* ── Top curtain — deepens the ceiling ─────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 z-[2] h-[28%] bg-gradient-to-b from-[#07060B] via-[#07060B]/55 to-transparent"
      />

      {/* ── Gold atmospheric bloom ─────────────────────────────────────
          Centered on the piece. Breathes slowly — the warmth of the
          amber stone resonating outward. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_48%_55%_at_50%_46%,rgba(196,151,58,0.09),transparent_70%)] animate-ambient-breathe"
      />

      {/* ── Moonstone resonance — violet bloom ─────────────────────────
          The moonstone's blue flash carries a violet frequency.
          Positioned slightly right of center, drifting slowly. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_30%_38%_at_58%_52%,rgba(105,80,175,0.055),transparent)] animate-ambient-drift"
      />

      {/* ── Bottom fade — clean dissolve into collection ───────────── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 z-[3] h-52 bg-gradient-to-t from-brand-dark to-transparent"
      />

      {/* ── Hairline gold accent — upper ───────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute top-[14%] inset-x-0 z-[4] h-px bg-gradient-to-r from-transparent via-brand-gold/12 to-transparent"
      />

      {/* ── Content ────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center flex flex-col items-center gap-7">

        <p className="text-brand-gold/65 text-[10px] uppercase tracking-[0.55em] font-sans [text-shadow:0_0_20px_rgba(196,151,58,0.2)]">
          Sacred Adornment &nbsp;·&nbsp; RootFlute
        </p>

        <h1 className="font-display text-[4.75rem] sm:text-[5.5rem] md:text-8xl font-light text-brand-text leading-[1.0] tracking-tight [text-shadow:0_4px_40px_rgba(0,0,0,0.95)]">
          Worn.<br />
          Held.<br />
          <span className="italic text-brand-gold [text-shadow:0_0_48px_rgba(196,151,58,0.28),0_4px_40px_rgba(0,0,0,0.95)]">
            Felt.
          </span>
        </h1>

        {/* Breath divider */}
        <div
          aria-hidden="true"
          className="w-14 h-px bg-gradient-to-r from-transparent via-brand-gold/45 to-transparent"
        />

        <p className="text-white/68 text-base sm:text-[1.1rem] font-light leading-relaxed max-w-[320px] [text-shadow:0_2px_20px_rgba(0,0,0,0.85)]">
          Handcrafted ceremonial adornment for those who carry the practice into their body.
        </p>

        <Button
          href="#collection"
          size="lg"
          className="hover:scale-[1.03] hover:brightness-110 active:scale-[0.99] transition-all duration-200 ease-out"
        >
          View the Collection →
        </Button>

        <p className="text-white/28 text-[11px] font-sans uppercase tracking-[0.42em]">
          Three pieces. Three owners. Each made once.
        </p>

      </div>

      {/* ── Scroll indicator ───────────────────────────────────────── */}
      <div className="absolute bottom-11 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-28">
        <span className="text-brand-muted text-[10px] uppercase tracking-[0.22em] font-sans">Scroll</span>
        <div className="w-px h-8 bg-brand-muted/55 animate-pulse" />
      </div>

    </section>
  );
}
