"use client";

import { useRef, useEffect } from "react";
import Button from "@/components/ui/Button";

export default function HeroJewelry() {
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

      {/* Cinematic gradient base — earthy, ceremonial */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-gradient-to-b from-[#120e08] via-[#0d0a06] to-[#0A0A08]"
      />

      {/* Deep amber bloom — warmer than flutes/society for jewelry */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_65%_at_50%_35%,rgba(180,130,50,0.09),transparent)] animate-ambient-breathe"
      />

      {/* Secondary drift bloom — lower position, cooler tone */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_50%_40%_at_65%_70%,rgba(100,80,140,0.06),transparent)] animate-ambient-drift"
      />

      {/* Hero video — swap src when atmospheric footage is available */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        disablePictureInPicture
        controls={false}
        aria-hidden="true"
        className="absolute inset-0 z-[1] w-full h-full object-cover origin-center animate-[hero-scale_22s_ease-in-out_infinite_alternate] opacity-0 [&:not([data-loaded])]:opacity-0"
        onLoadedData={(e) => {
          (e.target as HTMLVideoElement).classList.add("opacity-60");
          (e.target as HTMLVideoElement).dataset.loaded = "true";
        }}
      >
        {/* Replace this src with ceremonial/jewelry atmospheric footage when available */}
        <source src="/video/jewelry-hero.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay — stabilizes readability */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] bg-gradient-to-b from-black/65 via-black/40 to-black/70"
      />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center flex flex-col items-center gap-8">

        <p className="text-brand-gold text-2xl sm:text-3xl font-display font-normal [text-shadow:0_0_28px_rgba(196,151,58,0.35),0_2px_12px_rgba(0,0,0,0.95)]">
          RootFlute
        </p>

        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-light text-brand-text leading-none tracking-tight">
          Worn.{" "}
          <br className="hidden sm:block" />
          Held.{" "}
          <br className="hidden sm:block" />
          <span className="italic text-brand-gold">Felt.</span>
        </h1>

        <p className="text-white/85 text-lg sm:text-xl font-light leading-relaxed max-w-sm [text-shadow:0_2px_12px_rgba(0,0,0,0.7)]">
          Handcrafted ceremonial adornment for those who carry the practice into their body.
        </p>

        <Button
          href="#collection"
          size="lg"
          className="hover:scale-105 hover:brightness-110 active:scale-100 transition-all duration-200 ease-out"
        >
          View the Collection →
        </Button>

        <div className="flex flex-col items-center gap-2 pt-2">
          <p className="text-white/40 text-xs font-sans uppercase tracking-[0.35em]">
            Each piece made by hand. Each one unrepeatable.
          </p>
        </div>

      </div>

      {/* Bottom fade into next section */}
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
