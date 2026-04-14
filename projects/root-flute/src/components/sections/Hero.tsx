import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* === 1. Cinematic gradient — base layer, always visible === */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-gradient-to-b from-[#1a1408] via-[#0d0b06] to-[#0A0A08]"
      />

      {/* === 2. Warm radial bloom behind video — animates as ambient fallback === */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(196,151,58,0.07),transparent)] animate-ambient-breathe"
      />

      {/* === 3. Hero video — sits above gradient === */}
      {/*
        Drop /public/video/hero.mp4 to activate.
        No poster attribute — the gradient layers beneath provide a seamless
        fallback on load and at loop restart. A poster pointing to a missing
        file causes a blank flash; omitting it eliminates that entirely.
      */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute inset-0 z-[1] w-full h-full object-cover origin-center animate-[hero-scale_20s_ease-in-out_infinite_alternate]"
        src="/video/hero-web.mp4"
      />

      {/* === 4. Gradient overlay — stabilizes readability across all video frames === */}
      {/* Slightly heavier at top/bottom (where brand text lives), lighter in the middle */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] bg-gradient-to-b from-black/60 via-black/40 to-black/60"
      />

      {/* === 5. Content === */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center flex flex-col items-center gap-8">
        <p className="text-brand-gold text-xl sm:text-2xl uppercase tracking-[0.25em] sm:tracking-[0.35em] font-sans font-medium [text-shadow:0_0_28px_rgba(196,151,58,0.35),0_2px_12px_rgba(0,0,0,0.95)]">
          Root Flute Sound Journeys
        </p>

        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-light text-brand-text leading-none tracking-tight">
          Sound.{" "}
          <br className="hidden sm:block" />
          Breath.{" "}
          <br className="hidden sm:block" />
          Presence.
        </h1>

        <p className="text-white/85 text-lg sm:text-xl font-light leading-relaxed max-w-sm [text-shadow:0_2px_12px_rgba(0,0,0,0.7)]">
          A private community for those called to the practice.
        </p>

        <Button
          href="#community"
          size="lg"
          className="hover:scale-105 hover:brightness-110 active:scale-100 transition-all duration-200 ease-out"
        >
          Join the Community →
        </Button>
      </div>

      {/* === Bottom fade into next section === */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 z-[3] h-40 bg-gradient-to-t from-brand-dark to-transparent"
      />

      {/* === Scroll indicator === */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
        <span className="text-brand-muted text-xs uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-px h-8 bg-brand-muted animate-pulse" />
      </div>
    </section>
  );
}
