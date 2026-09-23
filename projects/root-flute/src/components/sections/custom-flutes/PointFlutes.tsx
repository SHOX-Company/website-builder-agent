import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";
import CustomFluteInquiryCTA from "./CustomFluteInquiryCTA";

// Content migrated verbatim from the old RootFlute site
// (https://www.rootflute.com/point-flutes) — price note and sold-piece
// captions are Daniel's original words, not rewritten. The standalone
// RootFlute logo graphic present on the old page was intentionally not
// migrated (site chrome, not Point-Flute-specific content — same rule
// established for Bell Flutes).
const soldPieces = [
  { src: "/images/custom-flutes/point-flutes/point-flute-sold-1800.jpg", caption: "sold for $1,800" },
  { src: "/images/custom-flutes/point-flutes/point-flute-sold-2500-a.jpg", caption: "sold for $2,500" },
  { src: "/images/custom-flutes/point-flutes/point-flute-sold-2200.jpg", caption: "sold for $2,200" },
  { src: "/images/custom-flutes/point-flutes/point-flute-sold-2500-b.jpg", caption: "sold for $2,500" },
  { src: "/images/custom-flutes/point-flutes/point-flute-sold-1600.jpg", caption: "sold for $1,600" },
];

export default function PointFlutes() {
  return (
    <SectionWrapper className="bg-brand-surface-2">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
            Custom Flute Style
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text mb-4">
            Point Flutes
          </h2>
          <p className="text-brand-muted text-sm">
            Starting at $1,800 - price based on labor and materials used
          </p>
        </div>

        {/* Acquisition inquiry (2026-09-23, price updated 2026-09-23 per Operation
            Bulletproof pricing conversion) — no firm/fixed checkout price exists for this
            design (price varies with labor and materials, per the copy above), so this is
            the existing certified inquiry pathway, not a Stripe checkout. See
            CustomFluteInquiryCTA.tsx for the full reasoning. */}
        <div className="flex justify-center mb-16">
          <CustomFluteInquiryCTA design="Point Flutes" />
        </div>

        {/* Video */}
        <div className="aspect-video w-full max-w-2xl mx-auto mb-16 border border-brand-border overflow-hidden bg-black">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/b6cMtN5c9dc"
            title="Custom royal tine flute : by RootFlute"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        </div>

        {/* Sold pieces */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {soldPieces.map((piece) => (
            <div key={piece.src} className="flex flex-col gap-3">
              <div className="relative aspect-square border border-brand-border overflow-hidden">
                <Image
                  src={piece.src}
                  alt={piece.caption}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
              <p className="text-center text-brand-muted text-xs uppercase tracking-widest font-sans">
                {piece.caption}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
