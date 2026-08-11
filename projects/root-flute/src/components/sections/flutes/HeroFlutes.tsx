"use client";

import { useRef, useEffect } from "react";
import Button from "@/components/ui/Button";

export default function HeroFlutes() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.play().catch(() => {});
    }
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* Cinematic gradient base */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-gradient-to-b from-[#1a1408] via-[#0d0b06] to-[#0A0A08]"
      />

      {/* Warm radial bloom */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(196,151,58,0.07),transparent)] animate-ambient-breathe"
      />

      {/* Hero video — elk/Daniel footage */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        loop
        preload="metadata"
        poster="/video/hero-web-fs-poster.jpg"
        disablePictureInPicture
        controls={false}
        aria-hidden="true"
        className="absolute inset-0 z-[1] w-full h-full object-cover origin-center animate-[hero-scale_20s_ease-in-out_infinite_alternate]"
      >
        <source src="/video/hero-web-fs.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] bg-gradient-to-b from-black/65 via-black/45 to-black/65"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-5 sm:gap-8">

        {/* Brand name — hidden on mobile (FloatingLogo carries it once scrolled; hero text visible on sm+) */}
        <p className="hidden sm:block text-brand-gold text-3xl sm:text-4xl font-display font-normal [text-shadow:0_0_28px_rgba(196,151,58,0.35),0_2px_12px_rgba(0,0,0,0.95)]">
          RootFlute
        </p>

        {/* h1 — clamp scales 36px→60px across 360–600px, then sm:text-7xl takes over */}
        <h1 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] sm:text-7xl md:text-8xl font-light text-brand-text leading-[1.05] sm:leading-none tracking-tight w-full">
          Rare Instruments
          <br />
          <span className="italic text-brand-gold">With a Soul.</span>
        </h1>

        <p className="text-white/85 text-base sm:text-xl font-light leading-relaxed max-w-lg [text-shadow:0_2px_12px_rgba(0,0,0,0.7)]">
          Handcrafted, intentional instruments built for depth, resonance, and presence.
        </p>

        <Button
          href="#current-drop"
          size="lg"
          className="hover:scale-105 hover:brightness-110 active:scale-100 transition-all duration-200 ease-out"
        >
          View Current Offering →
        </Button>

        {/* Micro-copy accent */}
        <div className="flex flex-col items-center gap-2 pt-1 sm:pt-2">
          <p className="text-white/40 text-xs font-sans uppercase tracking-[0.35em]">
            No forest. No farm. No factory.
          </p>
          <p className="text-brand-gold/60 text-xs font-sans uppercase tracking-widest">
            One instrument available now.
          </p>
        </div>

      </div>

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 z-[3] h-40 bg-gradient-to-t from-brand-dark to-transparent"
      />

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
        <span className="text-brand-muted text-xs uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-px h-8 bg-brand-muted animate-pulse" />
      </div>

    </section>
  );
}
