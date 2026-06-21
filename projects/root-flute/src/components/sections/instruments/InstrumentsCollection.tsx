"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";
import InstrumentsInquiryModal from "./InstrumentsInquiryModal";

type InstrumentStatus = "inquiry" | "checkout" | "reserved" | "sold";

interface Instrument {
  id: string;
  eyebrow: string;
  name: string;
  tagline: string;
  description: string;
  materials: string;
  rarityLine: string;
  price: string;
  priceLabel: string;
  pricingNote?: string;
  images: { src: string; alt: string }[];
  layout: "left" | "right";
  status: InstrumentStatus;
}

const INSTRUMENTS: Instrument[] = [
  {
    id: "triton-violin",
    eyebrow: "Triton Violin",
    name: "Triton Violin",
    tagline: "Where the sea becomes song.",
    description:
      "Built from materials that carry the memory of ancient water — this violin does not simply play notes. It carries a current. For the player who wants the instrument to speak back.",
    materials: "Handcrafted · Natural materials · One of one",
    rarityLine: "Private acquisition. Priced on inquiry. Made once.",
    price: "Pricing on inquiry",
    priceLabel: "Private acquisition",
    images: [
      { src: "/images/instruments/triton-violin-1.png", alt: "Triton Violin — ceremonial handcrafted violin" },
    ],
    layout: "left",
    status: "inquiry",
  },
  {
    id: "wearable-triton-cello",
    eyebrow: "Wearable Triton Cello",
    name: "Wearable Triton Cello",
    tagline: "The resonance you carry on your body.",
    description:
      "A cello that does not stand apart from you — it becomes part of you. Designed to be worn, played, and inhabited. The vibration moves through wood, then body. There is no separation between player and instrument.",
    materials: "Handcrafted · Wearable design · One of one",
    rarityLine: "One of one. No instrument like this exists anywhere.",
    price: "$3,800",
    priceLabel: "Acquisition price",
    images: [
      { src: "/images/instruments/wearable-triton-cello-1.png", alt: "Wearable Triton Cello — first view" },
      { src: "/images/instruments/wearable-triton-cello-2.png", alt: "Wearable Triton Cello — second view" },
      { src: "/images/instruments/wearable-triton-cello-3.png", alt: "Wearable Triton Cello — third view" },
    ],
    layout: "right",
    status: "inquiry",
  },
  {
    id: "lyre",
    eyebrow: "Lyre",
    name: "Lyre",
    tagline: "An instrument as old as ceremony itself.",
    description:
      "The lyre is the oldest living music. This one was not built to imitate history — it was built to inhabit it. Strung for those who play music as ritual, not performance.",
    materials: "Handcrafted · Natural wood & string · One of one",
    rarityLine: "One of one. Ancient form. New voice.",
    price: "$3,200",
    priceLabel: "Acquisition price",
    images: [
      { src: "/images/instruments/lyre-1.png", alt: "Lyre — ceremonial handcrafted lyre, first view" },
      { src: "/images/instruments/lyre-2.png", alt: "Lyre — ceremonial handcrafted lyre, second view" },
    ],
    layout: "left",
    status: "inquiry",
  },
  {
    id: "triton-harp",
    eyebrow: "Triton Harp",
    name: "Triton Harp",
    tagline: "Sound that rises from the deep.",
    description:
      "Harp strings carry frequencies the body feels before the mind processes them. This instrument was shaped to speak to that part of you. A ceremonial object as much as a musical one — owned by those who treat sound as a sacred practice.",
    materials: "Handcrafted · Natural materials · One of one",
    rarityLine: "One of one. Handcrafted. Will not be made again.",
    price: "$3,200",
    priceLabel: "Acquisition price",
    images: [
      { src: "/images/instruments/triton-harp-1.png", alt: "Triton Harp — ceremonial handcrafted harp, first view" },
      { src: "/images/instruments/triton-harp-2.png", alt: "Triton Harp — ceremonial handcrafted harp, second view" },
    ],
    layout: "right",
    status: "inquiry",
  },
  {
    id: "guitar",
    eyebrow: "Guitar",
    name: "Guitar",
    tagline: "Every line carved with intention.",
    description:
      "Not a production instrument. Not a replica. A guitar that exists because someone gave it time — the kind of time that cannot be purchased from a factory. Each curve is a decision. Each fret a conversation between maker and material.",
    materials: "Handcrafted · Natural tonewoods · One of one",
    rarityLine: "Made once. Every detail a decision. No two the same.",
    price: "$2,400",
    priceLabel: "Acquisition price",
    images: [
      { src: "/images/instruments/guitar-1.png", alt: "Guitar — ceremonial handcrafted guitar, first view" },
      { src: "/images/instruments/guitar-2.png", alt: "Guitar — ceremonial handcrafted guitar, second view" },
      { src: "/images/instruments/guitar-3.png", alt: "Guitar — ceremonial handcrafted guitar, third view" },
    ],
    layout: "left",
    status: "inquiry",
  },
  {
    id: "shellivarious",
    eyebrow: "Shellivarious",
    name: "Shellivarious",
    tagline: "An instrument without precedent.",
    description:
      "There is no category for this instrument because none existed before it was built. The Shellivarious is a singular creation — a convergence of shell, string, and resonance that produces a sound you will not find anywhere else on earth. Available with or without the monochord extension.",
    materials: "Handcrafted · Shell & natural materials · One of one",
    rarityLine: "No category. No precedent. One of one.",
    price: "$5,400",
    priceLabel: "With monochord",
    pricingNote: "$4,500 without monochord",
    images: [
      { src: "/images/instruments/shellivarious-1.png", alt: "Shellivarious — ceremonial handcrafted instrument" },
    ],
    layout: "right",
    status: "inquiry",
  },
];

// ─── Price display ────────────────────────────────────────────────────────────
function PriceDisplay({
  price,
  priceLabel,
  pricingNote,
}: {
  price: string;
  priceLabel: string;
  pricingNote?: string;
}) {
  const isInquiry = price === "Pricing on inquiry";
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-brand-muted/40 text-[10px] uppercase tracking-[0.25em] font-sans">
        {priceLabel}
      </p>
      <p
        className={`font-display font-light text-brand-text ${
          isInquiry ? "text-2xl italic text-brand-text/60" : "text-4xl"
        }`}
      >
        {price}
      </p>
      {pricingNote && (
        <p className="text-brand-muted/50 text-xs font-sans mt-0.5">{pricingNote}</p>
      )}
    </div>
  );
}

// ─── CTA block ────────────────────────────────────────────────────────────────
function InstrumentCTA({
  instrument,
  onAcquire,
}: {
  instrument: Instrument;
  onAcquire: (name: string) => void;
}) {
  if (instrument.status === "sold") {
    return (
      <div className="flex flex-col gap-3">
        <span className="inline-block border border-brand-border text-brand-muted/50 text-xs uppercase tracking-widest px-4 py-2 self-start">
          Sold &nbsp;·&nbsp; One of One
        </span>
        <p className="text-brand-muted/40 text-xs font-sans">
          This instrument has found its owner.
        </p>
      </div>
    );
  }

  if (instrument.status === "reserved") {
    return (
      <div className="flex flex-col gap-3">
        <span className="inline-block border border-brand-gold/30 text-brand-gold/50 text-xs uppercase tracking-widest px-4 py-2 self-start">
          Reserved &nbsp;·&nbsp; Pending Acquisition
        </span>
        <p className="text-brand-muted/40 text-xs font-sans">
          An acquisition is in progress for this instrument.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <span className="inline-block border border-brand-border text-brand-muted text-xs uppercase tracking-widest px-4 py-2 self-start">
        Available Now &nbsp;·&nbsp; One of One
      </span>
      <button
        type="button"
        onClick={() => onAcquire(instrument.name)}
        className="inline-flex items-center justify-center font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold bg-brand-gold text-brand-dark hover:bg-brand-gold-light px-8 py-4 text-lg self-start"
      >
        Acquire This Instrument →
      </button>
      <p className="text-brand-muted/60 text-xs font-sans">
        Private acquisition inquiry &nbsp;·&nbsp; Handled personally by Daniel
      </p>
    </div>
  );
}

// ─── Per-instrument block ─────────────────────────────────────────────────────
function InstrumentBlock({
  instrument,
  onAcquire,
  isLast,
}: {
  instrument: Instrument;
  onAcquire: (name: string) => void;
  isLast?: boolean;
}) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const isRight = instrument.layout === "right";

  useEffect(() => {
    if (lightbox === null) return;
    const len = instrument.images.length;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        setLightbox((prev) => prev === null ? null : (prev - 1 + len) % len);
      } else if (e.key === "ArrowRight") {
        setLightbox((prev) => prev === null ? null : (prev + 1) % len);
      } else if (e.key === "Escape") {
        setLightbox(null);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox, instrument.images.length]);

  return (
    <div id={instrument.id} className="scroll-mt-24">

      {/* Main acquisition panel */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 border border-brand-border overflow-hidden ${
          isRight ? "lg:[direction:rtl]" : ""
        }`}
      >
        {/* Image panel — true gold frame matching Craftsman treatment */}
        <div
          className={`relative w-full max-h-[55vw] lg:max-h-none aspect-[4/3] lg:aspect-[3/4] lg:min-h-[500px] cursor-pointer group focus-visible:outline-2 focus-visible:outline-brand-gold ${
            isRight ? "lg:[direction:ltr]" : ""
          }`}
          onClick={() => setLightbox(0)}
          role="button"
          aria-label={`View full image of ${instrument.name}`}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setLightbox(0)}
          style={{
            background:
              "linear-gradient(145deg, rgba(196,151,58,0.92) 0%, rgba(196,151,58,0.62) 50%, rgba(196,151,58,0.86) 100%)",
          }}
        >
          <div
            className="absolute inset-[4px] overflow-hidden bg-brand-dark"
            style={{
              boxShadow:
                "inset 0 0 0 1px rgba(196,151,58,0.22), inset 0 0 32px rgba(0,0,0,0.5)",
            }}
          >
            {/* Blurred atmospheric fill — mobile only, eliminates pillarbox */}
            <Image
              src={instrument.images[0].src}
              alt=""
              aria-hidden="true"
              fill
              unoptimized
              className="lg:hidden object-cover object-center scale-110 pointer-events-none"
              style={{ filter: "blur(18px) brightness(0.45) saturate(0.55)" }}
              sizes="(max-width: 1024px) 100vw"
            />
            {/* Foreground — sharp, centered, edge-feathered on mobile */}
            <div
              className="absolute inset-0 z-10 lg:[mask-image:none] lg:[-webkit-mask-image:none]"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 7%, rgba(0,0,0,0.35) 14%, rgba(0,0,0,0.72) 21%, black 29%, black 71%, rgba(0,0,0,0.72) 79%, rgba(0,0,0,0.35) 86%, rgba(0,0,0,0.08) 93%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 7%, rgba(0,0,0,0.35) 14%, rgba(0,0,0,0.72) 21%, black 29%, black 71%, rgba(0,0,0,0.72) 79%, rgba(0,0,0,0.35) 86%, rgba(0,0,0,0.08) 93%, transparent 100%)",
              }}
            >
              <Image
                src={instrument.images[0].src}
                alt={instrument.images[0].alt}
                fill
                unoptimized
                priority={instrument.id === "triton-violin"}
                className="object-contain lg:object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-0 z-20 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent pointer-events-none"
            />
            <div className="absolute bottom-5 right-5 z-30 transition-opacity duration-300 opacity-35 group-hover:opacity-90">
              <span className="text-white text-[10px] font-sans uppercase tracking-[0.35em]">
                View Gallery
              </span>
            </div>
          </div>
        </div>

        {/* Product panel */}
        <div
          className={`bg-brand-surface p-10 lg:p-14 flex flex-col justify-between gap-10 ${
            isRight ? "lg:[direction:ltr]" : ""
          }`}
        >
          <div className="flex flex-col gap-4">
            <p className="text-brand-gold text-xs uppercase tracking-widest font-sans">
              {instrument.eyebrow}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text leading-tight">
              {instrument.name}
            </h2>
            <p className="text-brand-muted text-xs uppercase tracking-widest">
              {instrument.materials}
            </p>
            <p className="font-display text-xl italic text-brand-text/60">
              {instrument.tagline}
            </p>
            <p className="text-brand-muted text-sm leading-relaxed mt-1">
              {instrument.description}
            </p>
            <div className="pt-4 border-t border-brand-border">
              <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans">
                {instrument.rarityLine}
              </p>
            </div>
            <PriceDisplay
              price={instrument.price}
              priceLabel={instrument.priceLabel}
              pricingNote={instrument.pricingNote}
            />
          </div>

          <InstrumentCTA instrument={instrument} onAcquire={onAcquire} />
        </div>
      </div>

      {/* Chapter divider — separates each offering, hidden on last */}
      {!isLast && (
        <div
          aria-hidden="true"
          className="pt-16 sm:pt-20 pb-16 sm:pb-20 flex items-center gap-5"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brand-gold/15 to-transparent" />
          <div className="w-1 h-1 rounded-full bg-brand-gold/25" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-brand-gold/15 to-transparent" />
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
        >
          {/* Image */}
          <div
            className="relative w-full max-w-lg max-h-[85vh] aspect-[3/4]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={instrument.images[lightbox].src}
              alt={instrument.images[lightbox].alt}
              fill
              unoptimized
              className="object-contain"
              sizes="512px"
            />
            {/* Back to Piece — persistent luxury exit CTA */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 px-5 py-2 whitespace-nowrap text-white/55 text-[10px] font-sans uppercase tracking-[0.5em] bg-black/20 backdrop-blur-sm border border-white/8 transition-all duration-300 hover:text-white/88 hover:bg-black/30 focus-visible:outline-none"
              aria-label="Close gallery"
            >
              Back to Piece
            </button>
          </div>

          {/* Left arrow */}
          {instrument.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((lightbox - 1 + instrument.images.length) % instrument.images.length);
              }}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 text-white/65 hover:text-white/95 transition-colors duration-200 focus-visible:outline-none"
              aria-label="Previous image"
            >
              <span className="text-4xl leading-none select-none" style={{ textShadow: "0 0 20px rgba(0,0,0,1)" }}>‹</span>
            </button>
          )}

          {/* Right arrow */}
          {instrument.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((lightbox + 1) % instrument.images.length);
              }}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 text-white/65 hover:text-white/95 transition-colors duration-200 focus-visible:outline-none"
              aria-label="Next image"
            >
              <span className="text-4xl leading-none select-none" style={{ textShadow: "0 0 20px rgba(0,0,0,1)" }}>›</span>
            </button>
          )}

          {/* Nav dots */}
          {instrument.images.length > 1 && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {instrument.images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightbox(i); }}
                  aria-label={`Image ${i + 1}`}
                  className={`block w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                    i === lightbox ? "bg-brand-gold" : "bg-brand-muted/40"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Close Gallery */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-white/35 hover:text-white/75 text-[10px] font-sans uppercase tracking-[0.4em] transition-colors duration-200 focus-visible:outline-none"
            aria-label="Close gallery"
          >
            Close Gallery
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Collection section ───────────────────────────────────────────────────────
export default function InstrumentsCollection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState("");

  function openAcquire(instrumentName: string) {
    setSelectedInstrument(instrumentName);
    setModalOpen(true);
  }

  return (
    <>
      <SectionWrapper className="bg-brand-surface-2">
        <div id="collection" className="scroll-mt-20 sm:scroll-mt-24" />

        <div className="text-center mb-14">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
            The Collection
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text mb-6">
            Six instruments. Six intentions.
          </h2>
          <p className="text-brand-muted text-base leading-relaxed max-w-2xl mx-auto">
            Each instrument is made once. There is no restocking, no reordering, no
            reproduction. When it finds its player, it is gone.
          </p>
        </div>

        <div className="flex flex-col">
          {INSTRUMENTS.map((instrument, i) => (
            <InstrumentBlock
              key={instrument.id}
              instrument={instrument}
              onAcquire={openAcquire}
              isLast={i === INSTRUMENTS.length - 1}
            />
          ))}
        </div>

        <p className="text-center text-brand-muted text-sm max-w-lg mx-auto leading-relaxed mt-10">
          Past instruments are not available. Each is worked once — and never again.
        </p>
      </SectionWrapper>

      <InstrumentsInquiryModal
        isOpen={modalOpen}
        defaultItem={selectedInstrument}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
