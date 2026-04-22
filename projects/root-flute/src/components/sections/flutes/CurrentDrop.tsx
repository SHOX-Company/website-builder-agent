"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Button from "@/components/ui/Button";

const GALLERY = [
  { src: "/images/commission-1.jpg", alt: "Woolly Mammoth tusk — raw material" },
  { src: "/images/commission-2.jpg", alt: "Woolly Mammoth tusk — grain detail" },
  { src: "/images/commission-3.jpg", alt: "Woolly Mammoth tusk — texture" },
  { src: "/images/commission-4.jpg", alt: "Woolly Mammoth tusk — close-up" },
  { src: "/images/commission-5.jpg", alt: "Woolly Mammoth tusk — surface" },
  { src: "/images/commission-6.jpg", alt: "Woolly Mammoth tusk — cross-section" },
  { src: "/images/commission-7.jpg", alt: "Woolly Mammoth tusk — mouthpiece area" },
  { src: "/images/commission-8.jpg", alt: "Woolly Mammoth tusk — full form" },
];

export default function CurrentDrop() {
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

  return (
    <SectionWrapper id="current-drop" className="bg-brand-surface-2">

      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
          Current Offering
        </p>
        <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text mb-6">
          Born from 10,000 years of time.
        </h2>
        <p className="text-brand-muted text-base leading-relaxed max-w-2xl mx-auto">
          Each instrument is carved from ancient Woolly Mammoth tusk — preserved beneath Arctic
          permafrost for millennia. Released one at a time. Each one is the only one that will
          ever exist.
        </p>
      </div>

      {/* Two-column: video + product panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 border border-brand-border overflow-hidden mb-3">

        {/* Left: video panel */}
        <div className="relative aspect-[3/4] lg:aspect-auto min-h-[500px] overflow-hidden bg-brand-dark">

          <Image
            src="/images/commission-1.jpg"
            alt="Woolly Mammoth tusk — ancient material"
            fill
            unoptimized
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={false}
          />

          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-[1]"
            src="https://p2pvgplym6odmfbh.public.blob.vercel-storage.com/commission-video.mp4"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 z-[2] bg-gradient-to-t from-brand-dark/75 via-transparent to-transparent"
          />

          <div className="absolute bottom-0 inset-x-0 z-[3] p-6 flex flex-col items-start gap-2">
            <button
              onClick={toggleAudio}
              className="border border-brand-gold/70 text-brand-gold text-xs uppercase tracking-[0.3em] font-sans px-5 py-2.5 hover:bg-brand-gold hover:text-brand-dark transition-colors duration-200 bg-brand-dark/40 backdrop-blur-sm"
            >
              {muted ? "Listen to the Flute" : "Mute"}
            </button>
            {muted && (
              <p className="text-brand-muted/60 text-xs font-sans">
                Tap to hear the instrument
              </p>
            )}
          </div>
        </div>

        {/* Right: product panel */}
        <div className="bg-brand-surface p-10 lg:p-14 flex flex-col justify-between gap-10">

          <div className="flex flex-col gap-4">
            <p className="text-brand-gold text-xs uppercase tracking-widest font-sans">
              Current Drop
            </p>

            <h3 className="font-display text-4xl sm:text-5xl font-light text-brand-text leading-tight">
              Woolly Mammoth
              <br />
              Tusk Flute
            </h3>

            <p className="text-brand-muted text-xs uppercase tracking-widest">
              Ancient Tusk &nbsp;·&nbsp; Hand-Carved &nbsp;·&nbsp; One of One
            </p>

            <p className="text-brand-gold/70 text-xs font-sans leading-relaxed">
              Woolly Mammoth tusk preserved beneath Arctic permafrost for 10,000+ years.
            </p>
            <p className="text-brand-muted/60 text-xs font-sans italic -mt-2">
              A material the world stopped producing when the Ice Age ended.
            </p>

            <p className="text-brand-muted text-sm leading-relaxed mt-1">
              Shaped slowly by hand in response to the material itself — no two pieces
              are ever the same. What emerges is not just an instrument, but a voice
              from deep time.
            </p>

            <div className="pt-4 border-t border-brand-border">
              <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans">
                Only 25 tusks remain for custom work.
              </p>
            </div>

            <p className="font-display text-4xl font-light text-brand-text">
              $15,000
            </p>
            <p className="text-brand-muted text-sm leading-relaxed -mt-2">
              One Woolly Mammoth Tusk Flute available now.
            </p>
            <p className="text-brand-gold/50 text-xs font-sans uppercase tracking-[0.3em]">
              Hand-tuned resonance.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <span className="inline-block border border-brand-border text-brand-muted text-xs uppercase tracking-widest px-4 py-2 self-start">
              Extremely Limited &nbsp;·&nbsp; One Available Now
            </span>
            <Button href="#acquire" variant="primary" size="lg" className="self-start">
              Claim This Instrument →
            </Button>
            <p className="text-brand-muted/60 text-xs font-sans">
              Serious acquisition handled personally.
            </p>
          </div>

        </div>
      </div>

      {/* Gallery strip */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
        aria-label="Woolly Mammoth tusk gallery"
      >
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

      <p className="text-center text-brand-muted text-sm max-w-lg mx-auto leading-relaxed">
        Past instruments are not available. Each tusk is worked once — and never again.
      </p>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 text-brand-muted hover:text-brand-text text-xs uppercase tracking-[0.3em] font-sans transition-colors duration-200"
            aria-label="Close image viewer"
          >
            Close ×
          </button>

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

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((p) =>
                  p !== null ? (p - 1 + GALLERY.length) % GALLERY.length : 0
                );
              }}
              className="text-brand-muted hover:text-brand-text text-xs uppercase tracking-[0.3em] font-sans transition-colors duration-200"
            >
              ← Prev
            </button>
            <span className="text-brand-border text-xs font-sans tabular-nums">
              {lightbox + 1} / {GALLERY.length}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((p) =>
                  p !== null ? (p + 1) % GALLERY.length : 0
                );
              }}
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
