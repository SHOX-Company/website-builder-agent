"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";
import JewelryInquiryModal from "./JewelryInquiryModal";

type PieceStatus = "inquiry" | "checkout" | "reserved" | "sold";

interface Piece {
  id: string;
  eyebrow: string;
  name: string;
  tagline: string;
  description: string;
  materials: string;
  rarityLine: string;
  price: string;
  priceLabel: string;
  images: { src: string; alt: string }[];
  heroSrc?: string;
  heroAlt?: string;
  layout: "left" | "right";
  status: PieceStatus;
  stripeUrl?: string;
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
    rarityLine: "One piece. One owner. Made once — never again.",
    price: "$4,600",
    priceLabel: "Acquisition price",
    images: [
      { src: "/images/jewelry/square-pendent.png", alt: "Pearl of Vision — ceremonial pearl adornment" },
    ],
    layout: "left",
    status: "inquiry",
  },
  {
    id: "lavender-moonrise",
    eyebrow: "Lavender Moonrise",
    name: "Lavender Moonrise",
    tagline: "For those who move in the in-between.",
    description:
      "Born from the light between dusk and night — the color of something neither here nor there. The lavender holds a quality the eye recognizes before the mind does. An adornment for those who exist at the threshold.",
    materials: "Handcrafted setting · Natural stones · One of one",
    rarityLine: "Made once. The same arrangement of stones will not occur again.",
    price: "$1,200",
    priceLabel: "Acquisition price",
    heroSrc: "/images/jewelry/lavender-pendant-1.png",
    heroAlt: "Lavender Moonrise — ceremonial adornment",
    images: [
      { src: "/images/jewelry/circ-1.png", alt: "Lavender Moonrise — ceremonial adornment" },
      { src: "/images/jewelry/circ-2.png", alt: "Lavender Moonrise — alternate view" },
    ],
    layout: "right",
    status: "inquiry",
  },
  {
    id: "eye-of-dragon",
    eyebrow: "Eye of Dragon",
    name: "Eye of Dragon",
    tagline: "Ancient sight. Present form.",
    description:
      "There are pieces that protect and pieces that see. This is both. A moody, powerful artifact — not a decoration but an intention made physical. For the one who moves through the unseen with awareness and without fear.",
    materials: "Handcrafted setting · Natural stones · One of one",
    rarityLine: "Singular. Unrepeatable. Made for one person.",
    price: "$1,700",
    priceLabel: "Acquisition price",
    images: [
      { src: "/images/jewelry/eye-of-the-dragon-2.png", alt: "Eye of Dragon — ceremonial adornment" },
      { src: "/images/jewelry/eye-of-the-dragon-1.png", alt: "Eye of Dragon — alternate view" },
      { src: "/images/jewelry/eye-of-dragon-1.png",     alt: "Eye of Dragon — detail view" },
    ],
    layout: "left",
    status: "inquiry",
  },
];

// ─── Price display ────────────────────────────────────────────────────────────
function PriceDisplay({ price, priceLabel }: { price: string; priceLabel: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-brand-muted/40 text-[10px] uppercase tracking-[0.25em] font-sans">
        {priceLabel}
      </p>
      <p className="font-display text-4xl font-light text-brand-text">{price}</p>
    </div>
  );
}

// ─── CTA block ────────────────────────────────────────────────────────────────
function PieceCTA({
  piece,
  onAcquire,
}: {
  piece: Piece;
  onAcquire: (name: string) => void;
}) {
  if (piece.status === "sold") {
    return (
      <div className="flex flex-col gap-3">
        <span className="inline-block border border-brand-border text-brand-muted/50 text-xs uppercase tracking-widest px-4 py-2 self-start">
          Sold &nbsp;·&nbsp; One of One
        </span>
        <p className="text-brand-muted/40 text-xs font-sans">This piece has found its owner.</p>
      </div>
    );
  }

  if (piece.status === "reserved") {
    return (
      <div className="flex flex-col gap-3">
        <span className="inline-block border border-brand-gold/30 text-brand-gold/50 text-xs uppercase tracking-widest px-4 py-2 self-start">
          Reserved &nbsp;·&nbsp; Pending Acquisition
        </span>
        <p className="text-brand-muted/40 text-xs font-sans">
          An acquisition is in progress for this piece.
        </p>
      </div>
    );
  }

  if (piece.status === "checkout" && piece.stripeUrl) {
    return (
      <div className="flex flex-col gap-4">
        <span className="inline-block border border-brand-border text-brand-muted text-xs uppercase tracking-widest px-4 py-2 self-start">
          Available Now &nbsp;·&nbsp; One of One
        </span>
        <a
          href={piece.stripeUrl}
          className="inline-flex items-center justify-center font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold bg-brand-gold text-brand-dark hover:bg-brand-gold-light px-8 py-4 text-base self-start"
        >
          Purchase This Piece →
        </a>
        <p className="text-brand-muted/60 text-xs font-sans">
          Secure checkout &nbsp;·&nbsp; Direct acquisition
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
        onClick={() => onAcquire(piece.name)}
        className="inline-flex items-center justify-center font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold bg-brand-gold text-brand-dark hover:bg-brand-gold-light px-8 py-4 text-lg self-start"
      >
        Acquire This Piece →
      </button>
      <p className="text-brand-muted/60 text-xs font-sans">
        Private acquisition inquiry &nbsp;·&nbsp; Handled personally by Daniel
      </p>
    </div>
  );
}

// ─── Per-piece block ──────────────────────────────────────────────────────────
function PieceBlock({
  piece,
  onAcquire,
  isLast,
}: {
  piece: Piece;
  onAcquire: (name: string) => void;
  isLast?: boolean;
}) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const isRight = piece.layout === "right";

  useEffect(() => {
    if (lightbox === null) return;
    const len = piece.images.length;
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
  }, [lightbox, piece.images.length]);

  return (
    <div id={piece.id} className="scroll-mt-24">

      {/* Main acquisition panel */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 border border-brand-border overflow-hidden ${
          isRight ? "lg:[direction:rtl]" : ""
        }`}
      >
        {/* Image panel — true gold frame matching Craftsman treatment */}
        {(() => {
          const hasGallery = piece.images.length > 0;
          const imgSrc = hasGallery ? piece.images[0].src : (piece.heroSrc ?? "");
          const imgAlt = hasGallery ? piece.images[0].alt : (piece.heroAlt ?? piece.name);
          return (
            <div
              className={`relative w-full max-h-[55vw] lg:max-h-none aspect-[4/3] lg:aspect-[3/4] lg:min-h-[500px] group ${
                hasGallery ? "cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-gold" : ""
              } ${isRight ? "lg:[direction:ltr]" : ""}`}
              {...(hasGallery ? {
                onClick: () => setLightbox(0),
                role: "button",
                "aria-label": `View full image of ${piece.name}`,
                tabIndex: 0,
                onKeyDown: (e: React.KeyboardEvent) => e.key === "Enter" && setLightbox(0),
              } : {})}
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
                  src={imgSrc}
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
                    src={imgSrc}
                    alt={imgAlt}
                    fill
                    unoptimized
                    priority={piece.id === "pearl-of-vision"}
                    className="object-contain lg:object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-20 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent pointer-events-none"
                />
                {hasGallery && (
                  <div className="absolute bottom-5 right-5 z-30 transition-opacity duration-300 opacity-35 group-hover:opacity-90">
                    <span className="text-white text-[10px] font-sans uppercase tracking-[0.35em]">
                      View Gallery
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Product panel */}
        <div
          className={`bg-brand-surface p-10 lg:p-14 flex flex-col justify-between gap-10 ${
            isRight ? "lg:[direction:ltr]" : ""
          }`}
        >
          <div className="flex flex-col gap-4">
            <p className="text-brand-gold text-xs uppercase tracking-widest font-sans">
              {piece.eyebrow}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text leading-tight">
              {piece.name}
            </h2>
            <p className="text-brand-muted text-xs uppercase tracking-widest">
              {piece.materials}
            </p>
            <p className="font-display text-xl italic text-brand-text/60">
              {piece.tagline}
            </p>
            <p className="text-brand-muted text-sm leading-relaxed mt-1">
              {piece.description}
            </p>
            <div className="pt-4 border-t border-brand-border">
              <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans">
                {piece.rarityLine}
              </p>
            </div>
            <PriceDisplay price={piece.price} priceLabel={piece.priceLabel} />
          </div>

          <PieceCTA piece={piece} onAcquire={onAcquire} />
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
              src={piece.images[lightbox].src}
              alt={piece.images[lightbox].alt}
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
          {piece.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((lightbox - 1 + piece.images.length) % piece.images.length);
              }}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 text-white/65 hover:text-white/95 transition-colors duration-200 focus-visible:outline-none"
              aria-label="Previous image"
            >
              <span className="text-4xl leading-none select-none" style={{ textShadow: "0 0 20px rgba(0,0,0,1)" }}>‹</span>
            </button>
          )}

          {/* Right arrow */}
          {piece.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((lightbox + 1) % piece.images.length);
              }}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 text-white/65 hover:text-white/95 transition-colors duration-200 focus-visible:outline-none"
              aria-label="Next image"
            >
              <span className="text-4xl leading-none select-none" style={{ textShadow: "0 0 20px rgba(0,0,0,1)" }}>›</span>
            </button>
          )}

          {/* Nav dots */}
          {piece.images.length > 1 && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {piece.images.map((_, i) => (
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
export default function JewelryCollection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState("");

  function openAcquire(pieceName: string) {
    setSelectedPiece(pieceName);
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
            Three pieces. Three intentions.
          </h2>
          <p className="text-brand-muted text-base leading-relaxed max-w-2xl mx-auto">
            Each piece is made once. There is no restocking, no reordering, no reproduction.
            When it finds its owner, it is gone.
          </p>
        </div>

        <div className="flex flex-col">
          {PIECES.map((piece, i) => (
            <PieceBlock
              key={piece.id}
              piece={piece}
              onAcquire={openAcquire}
              isLast={i === PIECES.length - 1}
            />
          ))}
        </div>

        <p className="text-center text-brand-muted text-sm max-w-lg mx-auto leading-relaxed mt-10">
          These pieces are not available in a storefront. Each one finds its owner — and then it is gone.
        </p>
      </SectionWrapper>

      <JewelryInquiryModal
        isOpen={modalOpen}
        defaultPiece={selectedPiece}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
