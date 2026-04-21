"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Button from "@/components/ui/Button";

const GALLERY = [
  { src: "/images/commission-1.jpg", alt: "Mammoth tusk — raw material" },
  { src: "/images/commission-2.jpg", alt: "Mammoth tusk — detail" },
  { src: "/images/commission-3.jpg", alt: "Mammoth tusk — texture" },
  { src: "/images/commission-4.jpg", alt: "Mammoth tusk — close-up" },
  { src: "/images/commission-5.jpg", alt: "Mammoth tusk — surface" },
  { src: "/images/commission-6.jpg", alt: "Mammoth tusk — grain" },
  { src: "/images/commission-7.jpg", alt: "Mammoth tusk — mouthpiece area" },
  { src: "/images/commission-8.jpg", alt: "Mammoth tusk — full view" },
];

export default function Flutes() {
  const [muted, setMuted] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  function toggleAudio() {
    if (!videoRef.current) return;
    const next = !muted;
    videoRef.current.muted = next;
    if (!next) {
      videoRef.current.volume = 0.6;
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
    setMuted(next);
  }

  function closeLightbox() {
    setLightbox(null);
  }

  // Close on Escape / navigate with arrow keys
  useEffect(() => {
    if (lightbox === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft")
        setLightbox((prev) =>
          prev !== null ? (prev - 1 + GALLERY.length) % GALLERY.length : 0
        );
      if (e.key === "ArrowRight")
        setLightbox((prev) =>
          prev !== null ? (prev + 1) % GALLERY.length : 0
        );
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  function prevImage(e: React.MouseEvent) {
    e.stopPropagation();
    setLightbox((prev) =>
      prev !== null ? (prev - 1 + GALLERY.length) % GALLERY.length : 0
    );
  }

  function nextImage(e: React.MouseEvent) {
    e.stopPropagation();
    setLightbox((prev) =>
      prev !== null ? (prev + 1) % GALLERY.length : 0
    );
  }

  return (
    <SectionWrapper className="bg-brand-surface-2">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="text-center mb-14">
        <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
          Rare Instruments
        </p>
        <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text mb-6">
          Flutes are born, not made.
        </h2>
        <p className="text-brand-muted text-base leading-relaxed max-w-2xl mx-auto">
          Each instrument is handcrafted by Dan — one at a time. Released as drops,
          not in a permanent shop. When one is ready, it finds its owner. Circle members
          receive access before anyone else.
        </p>
      </div>

      {/* ── Top row: video + product panel ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 border border-brand-border overflow-hidden mb-3">

        {/* Left: Video panel */}
        <div className="relative aspect-[3/4] lg:aspect-auto min-h-[500px] overflow-hidden bg-brand-dark">

          {/*
            Fallback image — visible on load and when video is absent.
            Replace with a high-res still when available.
          */}
          <Image
            src="/images/flute-obsidian-condor.svg"
            alt="The Obsidian Condor — handcrafted cedar flute by Dan"
            fill
            unoptimized
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={false}
          />

          {/*
            Video loop.
            Replace src with /video/flute-loop.mp4 when Dan provides final footage.
            Currently using hero-web.mp4 as a stand-in.
          */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-[1]"
            src="https://p2pvgplym6odmfbh.public.blob.vercel-storage.com/commission-video.mp4"
          />

          {/* Depth gradient */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[2] bg-gradient-to-t from-brand-dark/75 via-transparent to-transparent"
          />

          {/* Audio toggle — bottom-left */}
          <div className="absolute bottom-0 inset-x-0 z-[3] p-6 flex flex-col items-start gap-2">
            <button
              onClick={toggleAudio}
              className="border border-brand-gold/70 text-brand-gold text-xs uppercase tracking-[0.3em] font-sans px-5 py-2.5 hover:bg-brand-gold hover:text-brand-dark transition-colors duration-200 bg-brand-dark/40 backdrop-blur-sm"
            >
              {muted ? "Listen to the Flute" : "Mute"}
            </button>
            {muted && (
              <p className="text-brand-muted/60 text-xs font-sans">
                Tap to hear the flute
              </p>
            )}
          </div>
        </div>

        {/* Right: Product panel */}
        <div className="bg-brand-surface p-10 lg:p-14 flex flex-col justify-between gap-10">

          <div className="flex flex-col gap-4">
            <p className="text-brand-gold text-xs uppercase tracking-widest font-sans">
              Current Drop
            </p>

            <h3 className="font-display text-4xl sm:text-5xl font-light text-brand-text leading-tight">
              The Obsidian Condor
            </h3>

            <p className="text-brand-muted text-xs uppercase tracking-widest">
              Key of A &nbsp;·&nbsp; Old-Growth Cedar &nbsp;·&nbsp; Low Register
            </p>

            <p className="text-brand-muted text-sm leading-relaxed mt-1">
              Carved from a single piece of 200-year-old cedar, with obsidian inlay
              at the mouthpiece. Its voice sits deep in the chest — meditative,
              grounding, ceremonial. There is one. It will not be re-made.
            </p>

            <p className="font-display text-3xl font-light text-brand-text mt-1">
              $15,000 – $22,000
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <span className="inline-block border border-brand-border text-brand-muted text-xs uppercase tracking-widest px-4 py-2 self-start">
              Circle Members First &nbsp;·&nbsp; [Date TBD]
            </span>

            <Button href="#commission" variant="secondary" className="self-start">
              Request This Instrument →
            </Button>
          </div>

        </div>
      </div>

      {/* ── Bottom row: Gallery strip ───────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10" aria-label="Mammoth tusk gallery">
        {GALLERY.map(({ src, alt }, i) => (
          <button
            key={i}
            onClick={() => setLightbox(i)}
            className="relative aspect-square overflow-hidden border border-brand-border bg-brand-dark group focus-visible:outline-2 focus-visible:outline-brand-gold"
            aria-label={`View: ${alt}`}
          >
            <Image
              src={src}
              alt={alt}
              fill
              unoptimized
              className="object-cover object-center opacity-55 group-hover:opacity-80 transition-opacity duration-300"
              sizes="(max-width: 640px) 50vw, 25vw"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 group-hover:bg-brand-gold/5 transition-colors duration-300"
            />
          </button>
        ))}
      </div>

      {/* Below-fold note */}
      <p className="text-center text-brand-muted text-sm max-w-lg mx-auto leading-relaxed">
        Past drops are not available. Future drops are announced to Circle members first.{" "}
        <a
          href="#community"
          className="text-brand-gold hover:text-brand-gold-light transition-colors duration-200"
        >
          Join to be the first to know.
        </a>
      </p>

      {/* ── Lightbox ────────────────────────────────────────────── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-6"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-brand-muted hover:text-brand-text text-xs uppercase tracking-[0.3em] font-sans transition-colors duration-200"
            aria-label="Close image viewer"
          >
            Close ×
          </button>

          {/* Image */}
          <div
            className="relative w-full max-w-xl max-h-[80vh] aspect-[3/4]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={GALLERY[lightbox].src}
              alt={GALLERY[lightbox].alt}
              fill
              unoptimized
              className="object-contain"
              sizes="(max-width: 640px) 100vw, 576px"
            />
          </div>

          {/* Prev / Next */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8">
            <button
              onClick={prevImage}
              className="text-brand-muted hover:text-brand-text text-xs uppercase tracking-[0.3em] font-sans transition-colors duration-200"
            >
              ← Prev
            </button>
            <span className="text-brand-border text-xs font-sans tabular-nums">
              {lightbox + 1} / {GALLERY.length}
            </span>
            <button
              onClick={nextImage}
              className="text-brand-muted hover:text-brand-text text-xs uppercase tracking-[0.3em] font-sans transition-colors duration-200"
            >
              Next →
            </button>
          </div>
        </div>
      )}

    </SectionWrapper>
  );
}
