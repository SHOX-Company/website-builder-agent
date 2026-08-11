"use client";

import { useRef, useEffect } from "react";

export default function HomepageHero() {
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
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(196,151,58,0.08),transparent)] animate-ambient-breathe"
      />

      {/* Hero video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        loop
        preload="metadata"
        poster="/video/hero-web-poster.jpg"
        disablePictureInPicture
        controls={false}
        aria-hidden="true"
        className="absolute inset-0 z-[1] w-full h-full object-cover origin-center animate-[hero-scale_20s_ease-in-out_infinite_alternate]"
      >
        <source src="/video/hero-web.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] bg-gradient-to-b from-black/60 via-black/40 to-black/70"
      />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center flex flex-col items-center gap-8">

        <p className="text-brand-gold text-2xl sm:text-3xl font-display font-normal [text-shadow:0_0_28px_rgba(196,151,58,0.35),0_2px_12px_rgba(0,0,0,0.95)]">
          RootFlute
        </p>

        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-light text-brand-text leading-none tracking-tight">
          Sound.{" "}
          <br className="hidden sm:block" />
          Craft.{" "}
          <br className="hidden sm:block" />
          <span className="italic text-brand-gold">Adornment.</span>
        </h1>

        <p className="text-white/80 text-lg sm:text-xl font-light leading-relaxed max-w-sm [text-shadow:0_2px_12px_rgba(0,0,0,0.7)]">
          Three pathways into the RootFlute world. One creator. Everything made by hand.
        </p>


      </div>

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 z-[3] h-24 sm:h-48 bg-gradient-to-t from-brand-dark to-transparent"
      />

    </section>
  );
}
