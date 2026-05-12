"use client";

import { useState } from "react";
import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";

interface Piece {
  id: string;
  eyebrow: string;
  name: string;
  tagline: string;
  description: string;
  materials: string;
  images: { src: string; alt: string }[];
  cta: string;
  ctaHref: string;
  layout: "left" | "right";
}

const PIECES: Piece[] = [
  {
    id: "pearl-of-vision",
    eyebrow: "Pearl of Vision",
    name: "Pearl of Vision",
    tagline: "A luminous presence held close.",
    description:
      "A single pearl — luminous, still, singular. Not decorative. Worn by the one who has learned to hold clarity in a world of noise. This piece is quiet in the way that still water is quiet. It carries something.",
    materials: "Natural pearl · Handcrafted setting · One of one",
    images: [{ src: "/images/jewelry/pearl-of-vision-1.png", alt: "Pearl of Vision — ceremonial pearl adornment" }],
    cta: "Inquire About This Piece",
    ctaHref: "https://instagram.com/rootflute",
    layout: "left",
  },
  {
    id: "lavender-moonrise",
    eyebrow: "Lavender Moonrise",
    name: "Lavender Moonrise",
    tagline: "For those who move in the in-between.",
    description:
      "Born from the light between dusk and night — the color of something neither here nor there. Two views of the same piece. The lavender holds a quality the eye recognizes before the mind does. An adornment for those who exist at the threshold.",
    materials: "Handcrafted setting · Natural stones · One of one",
    images: [
      { src: "/images/jewelry/lavender-moonrise-1.png", alt: "Lavender Moonrise — ceremonial adornment, first view" },
      { src: "/images/jewelry/lavender-moonrise-2.png", alt: "Lavender Moonrise — ceremonial adornment, second view" },
    ],
    cta: "Inquire About This Piece",
    ctaHref: "https://instagram.com/rootflute",
    layout: "right",
  },
  {
    id: "eye-of-dragon",
    eyebrow: "Eye of Dragon",
    name: "Eye of Dragon",
    tagline: "Ancient sight. Present form.",
    description:
      "There are pieces that protect and pieces that see. This is both. A moody, powerful artifact — not a decoration but an intention made physical. For the one who moves through the unseen with awareness and without fear.",
    materials: "Handcrafted setting · Natural stones · One of one",
    images: [
      { src: "/images/jewelry/eye-of-dragon-1.png", alt: "Eye of Dragon — ceremonial adornment, first view" },
      { src: "/images/jewelry/eye-of-dragon-2.png", alt: "Eye of Dragon — ceremonial adornment, second view" },
    ],
    cta: "Inquire About This Piece",
    ctaHref: "https://instagram.com/rootflute",
    layout: "left",
  },
];

function PieceCard({ piece }: { piece: Piece }) {
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const isRight = piece.layout === "right";

  return (
    <div id={piece.id} className="scroll-mt-24">
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
          aria-label={`View full image of ${piece.name}`}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setLightbox(true)}
        >
          <Image
            src={piece.images[activeImg].src}
            alt={piece.images[activeImg].alt}
            fill
            unoptimized
            priority={piece.id === "pearl-of-vision"}
            className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />

          {/* Subtle gradient at bottom */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent pointer-events-none"
          />

          {/* Expand hint */}
          <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="text-brand-muted/70 text-xs font-sans uppercase tracking-[0.2em]">
              Expand
            </span>
          </div>

          {/* Thumbnail switcher for multi-image pieces */}
          {piece.images.length > 1 && (
            <div className="absolute bottom-5 left-5 flex gap-2 z-10">
              {piece.images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImg(i);
                  }}
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
              {piece.eyebrow}
            </p>

            <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text leading-tight">
              {piece.name}
            </h2>

            <p className="font-display text-xl italic text-brand-text/60">
              {piece.tagline}
            </p>

            <div className="w-8 h-px bg-brand-gold/40 my-1" aria-hidden="true" />

            <p className="text-brand-muted text-sm leading-relaxed">
              {piece.description}
            </p>

            <p className="text-brand-muted/50 text-xs uppercase tracking-widest font-sans pt-2">
              {piece.materials}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <span className="inline-block border border-brand-border text-brand-muted text-xs uppercase tracking-widest px-4 py-2 self-start">
              Available Now &nbsp;·&nbsp; One of One
            </span>

            <a
              href={piece.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold bg-brand-gold text-brand-dark hover:bg-brand-gold-light px-8 py-4 text-base self-start"
            >
              {piece.cta} →
            </a>

            <p className="text-brand-muted/50 text-xs font-sans">
              Inquiries handled personally by Daniel.
            </p>
          </div>
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
            aria-label="Close image viewer"
          >
            Close ×
          </button>

          <div
            className="relative w-full max-w-lg max-h-[85vh] aspect-[3/4]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={piece.images[activeImg].src}
              alt={piece.images[activeImg].alt}
              fill
              unoptimized
              className="object-contain"
              sizes="512px"
            />
          </div>

          {piece.images.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {piece.images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImg(i);
                  }}
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

export default function JewelryCollection() {
  return (
    <SectionWrapper className="bg-brand-dark">
      <div id="collection" className="scroll-mt-20 sm:scroll-mt-24" />

      {/* Section header */}
      <div className="text-center mb-20">
        <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
          The Collection
        </p>
        <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text mb-6">
          Three pieces. Three intentions.
        </h2>
        <p className="text-brand-muted text-base leading-relaxed max-w-xl mx-auto">
          Each piece is made once. There is no restocking, no reordering, no reproduction.
          When it finds its owner, it is gone.
        </p>
      </div>

      {/* Pieces */}
      <div className="flex flex-col gap-3">
        {PIECES.map((piece) => (
          <PieceCard key={piece.id} piece={piece} />
        ))}
      </div>
    </SectionWrapper>
  );
}
