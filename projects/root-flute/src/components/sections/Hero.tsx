"use client";

import { useRef, useEffect } from "react";
import Button from "@/components/ui/Button";

export default function Hero() {
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

      {/* Cinematic gradient base — always visible, seamless fallback */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-gradient-to-b from-[#1a1408] via-[#0d0b06] to-[#0A0A08]"
      />

      {/* Warm radial bloom behind video */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(196,151,58,0.07),transparent)] animate-ambient-breathe"
      />

      {/* Community hero video — ceremony / sound journey footage */}
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
        className="absolute inset-0 z-[1] w-full h-full object-cover origin-center animate-[hero-scale_20s_ease-in-out_infinite_alternate]"
      >
        <source src="/video/community-hero-web.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay — stabilizes readability across all video frames */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] bg-gradient-to-b from-black/60 via-black/40 to-black/60"
      />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center flex flex-col items-center gap-8">
        <p className="text-brand-gold text-2xl sm:text-3xl font-display font-normal [text-shadow:0_0_28px_rgba(196,151,58,0.35),0_2px_12px_rgba(0,0,0,0.95)]">
          RootFlute Sound Journeys
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
