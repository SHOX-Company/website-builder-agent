"use client";

import { useState } from "react";
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
    price: "Pricing on inquiry",
    priceLabel: "Private acquisition",
    images: [{ src: "/images/instruments/triton-violin-1.png", alt: "Triton Violin — ceremonial handcrafted violin" }],
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
    price: "$5,400",
    priceLabel: "With monochord",
    pricingNote: "$4,500 without monochord",
    images: [{ src: "/images/instruments/shellivarious-1.png", alt: "Shellivarious — ceremonial handcrafted instrument" }],
    layout: "right",
    status: "inquiry",
  },
];

// ─── Price anchor ────────────────────────────────────────────────────────────
function PriceAnchor({
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
      <p className={`font-display font-light text-brand-text ${isInquiry ? "text-2xl italic text-brand-text/60" : "text-4xl"}`}>
        {price}
      </p>
      {pricingNote && (
        <p className="text-brand-muted/50 text-xs font-sans mt-0.5">{pricingNote}</p>
      )}
    </div>
  );
}

// ─── CTA block ───────────────────────────────────────────────────────────────
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
      <div className="flex flex-col gap-5">
        <PriceAnchor price={instrument.price} priceLabel={instrument.priceLabel} pricingNote={instrument.pricingNote} />
        <div className="flex flex-col gap-3">
          <span className="inline-block border border-brand-gold/30 text-brand-gold/50 text-xs uppercase tracking-widest px-4 py-2 self-start">
            Reserved &nbsp;·&nbsp; Pending Acquisition
          </span>
          <p className="text-brand-muted/40 text-xs font-sans">
            An acquisition is in progress for this instrument.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <PriceAnchor price={instrument.price} priceLabel={instrument.priceLabel} pricingNote={instrument.pricingNote} />
      <div className="flex flex-col gap-4">
        <span className="inline-block border border-brand-border text-brand-muted text-xs uppercase tracking-widest px-4 py-2 self-start">
          Available Now &nbsp;·&nbsp; One of One
        </span>
        <button
          type="button"
          onClick={() => onAcquire(instrument.name)}
          className="inline-flex items-center justify-center font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold bg-brand-gold text-brand-dark hover:bg-brand-gold-light px-8 py-4 text-base self-start"
        >
          Acquire This Instrument →
        </button>
        <p className="text-brand-muted/50 text-xs font-sans">
          Private acquisition inquiry &nbsp;·&nbsp; Handled personally by Daniel
        </p>
      </div>
    </div>
  );
}

// ─── Instrument card ─────────────────────────────────────────────────────────
function InstrumentCard({
  instrument,
  onAcquire,
}: {
  instrument: Instrument;
  onAcquire: (name: string) => void;
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const isRight = instrument.layout === "right";

  return (
    <div id={instrument.id} className="scroll-mt-24">
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 border border-brand-border overflow-hidden ${
          isRight ? "lg:[direction:rtl]" : ""
        }`}
      >
        {/* Image panel */}
        <div
          className={`relative aspect-[3/4] min-h-[480px] overflow-hidden bg-brand-dark cursor-pointer group ${
            isRight ? "lg:[direction:ltr]" : ""
          }`}
          onClick={() => setLightbox(true)}
          role="button"
          aria-label={`View full image of ${instrument.name}`}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setLightbox(true)}
        >
          <Image
            src={instrument.images[activeImg].src}
            alt={instrument.images[activeImg].alt}
            fill
            unoptimized
            priority={instrument.id === "triton-violin"}
            className="object-contain object-center transition-transform duration-700 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent pointer-events-none"
          />
          <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="text-brand-muted/70 text-xs font-sans uppercase tracking-[0.2em]">Expand</span>
          </div>

          {instrument.images.length > 1 && (
            <div className="absolute bottom-5 left-5 flex gap-2 z-10">
              {instrument.images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveImg(i); }}
                  aria-label={`View image ${i + 1}`}
                  className={`w-8 h-8 overflow-hidden border transition-all duration-200 ${
                    i === activeImg
                      ? "border-brand-gold opacity-100"
                      : "border-brand-border opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={32}
                    height={32}
                    unoptimized
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product panel */}
        <div
          className={`bg-brand-surface p-10 lg:p-14 flex flex-col justify-between gap-10 ${
            isRight ? "lg:[direction:ltr]" : ""
          }`}
        >
          <div className="flex flex-col gap-5">
            <p className="text-brand-gold text-xs uppercase tracking-widest font-sans">
              {instrument.eyebrow}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text leading-tight">
              {instrument.name}
            </h2>
            <p className="font-display text-xl italic text-brand-text/60">
              {instrument.tagline}
            </p>
            <div className="w-8 h-px bg-brand-gold/40 my-1" aria-hidden="true" />
            <p className="text-brand-muted text-sm leading-relaxed">
              {instrument.description}
            </p>
            <p className="text-brand-muted/50 text-xs uppercase tracking-widest font-sans pt-2">
              {instrument.materials}
            </p>
          </div>
          <InstrumentCTA instrument={instrument} onAcquire={onAcquire} />
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/94 flex items-center justify-center p-6"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-6 right-6 text-brand-muted hover:text-brand-text text-xs uppercase tracking-[0.3em] font-sans transition-colors duration-200"
            aria-label="Close"
          >
            Close ×
          </button>
          <div
            className="relative w-full max-w-lg max-h-[85vh] aspect-[3/4]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={instrument.images[activeImg].src}
              alt={instrument.images[activeImg].alt}
              fill
              unoptimized
              className="object-contain"
              sizes="512px"
            />
          </div>
          {instrument.images.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {instrument.images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveImg(i); }}
                  aria-label={`Image ${i + 1}`}
                  className={`block w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                    i === activeImg ? "bg-brand-gold" : "bg-brand-muted/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Collection section ──────────────────────────────────────────────────────
export default function InstrumentsCollection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState("");

  function openAcquire(instrumentName: string) {
    setSelectedInstrument(instrumentName);
    setModalOpen(true);
  }

  return (
    <>
      <SectionWrapper className="bg-brand-dark">
        <div id="collection" className="scroll-mt-20 sm:scroll-mt-24" />

        <div className="text-center mb-20">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
            The Collection
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text mb-6">
            Six instruments. Six intentions.
          </h2>
          <p className="text-brand-muted text-base leading-relaxed max-w-xl mx-auto">
            Each instrument is made once. There is no restocking, no reordering, no
            reproduction. When it finds its player, it is gone.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {INSTRUMENTS.map((instrument) => (
            <InstrumentCard key={instrument.id} instrument={instrument} onAcquire={openAcquire} />
          ))}
        </div>
      </SectionWrapper>

      <InstrumentsInquiryModal
        isOpen={modalOpen}
        defaultItem={selectedInstrument}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
