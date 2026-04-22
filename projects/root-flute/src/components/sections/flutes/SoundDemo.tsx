"use client";

import { useState, useRef } from "react";
import Button from "@/components/ui/Button";

export default function SoundDemo() {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  function toggleAudio() {
    if (!videoRef.current) return;
    const next = !muted;
    videoRef.current.muted = next;
    if (!next) {
      videoRef.current.volume = 1.0;
      videoRef.current.play();
    }
    setMuted(next);
  }

  return (
    <section id="sound-demo" className="relative overflow-hidden py-36">

      {/* Base */}
      <div aria-hidden="true" className="absolute inset-0 z-0 bg-brand-dark" />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(196,151,58,0.05),transparent)] animate-ambient-drift"
      />

      {/* Video — elk footage (temporary, same as hero) */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute inset-0 z-[1] w-full h-full object-cover"
        src="https://p2pvgplym6odmfbh.public.blob.vercel-storage.com/hero-web.mp4"
      />

      {/* Overlays */}
      <div aria-hidden="true" className="absolute inset-0 z-[2] bg-black/68" />
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 z-[3] h-28 bg-gradient-to-b from-brand-surface to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 z-[3] h-28 bg-gradient-to-t from-brand-surface-2 to-transparent"
      />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-10">

        <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans">
          The Sound
        </p>

        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-brand-text leading-tight">
          Hear the depth.
          <br />
          <span className="italic">Feel the resonance.</span>
        </h2>

        <p className="text-white/75 text-base sm:text-lg font-light leading-relaxed max-w-xl">
          The voice of a Woolly Mammoth tusk flute is unlike anything produced by modern
          materials. Ancient density. Natural warmth. A tone that settles into the body
          before the mind can name what it is.
        </p>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={toggleAudio}
            className="border border-brand-gold/70 text-brand-gold text-sm uppercase tracking-[0.3em] font-sans px-8 py-4 hover:bg-brand-gold hover:text-brand-dark transition-colors duration-200 bg-brand-dark/40 backdrop-blur-sm"
          >
            {muted ? "▶  Unmute — Hear the Flute" : "⏸  Mute"}
          </button>
          {muted && (
            <p className="text-brand-muted/60 text-xs font-sans uppercase tracking-widest">
              Tap to experience the sound
            </p>
          )}
        </div>

        <Button href="#acquire" variant="primary" size="lg" className="mt-2">
          Own This Sound →
        </Button>

      </div>
    </section>
  );
}
