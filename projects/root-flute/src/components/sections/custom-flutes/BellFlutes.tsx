import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";

// Content migrated verbatim from the old RootFlute site
// (https://www.rootflute.com/bell-flutes) — copy, price note, video, and
// sold-piece captions are Daniel's original words, not rewritten.
const soldPieces = [
  { src: "/images/custom-flutes/bell-flutes/bell-flute-sold-2500.jpg", caption: "sold for $2,500" },
  { src: "/images/custom-flutes/bell-flutes/bell-flute-sold-1700.jpg", caption: "sold for $1,700" },
  { src: "/images/custom-flutes/bell-flutes/bell-flute-sold-3500.jpg", caption: "sold for $3,500" },
  { src: "/images/custom-flutes/bell-flutes/bell-flute-sold-2200.jpg", caption: "sold for $2,200" },
];

export default function BellFlutes() {
  return (
    <SectionWrapper className="bg-brand-surface-2">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
            Custom Flute Style
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text mb-4">
            Bell Flutes
          </h2>
          <p className="text-brand-muted text-sm">
            from $1,500 - price based on labor and materials used
          </p>
        </div>

        {/* Hero photograph */}
        <div className="w-full max-w-md mx-auto mb-14 border border-brand-border overflow-hidden">
          <Image
            src="/images/custom-flutes/bell-flutes/bell-flute-hero.jpg"
            alt="Timeless treasures crafted from found natural materials."
            width={1160}
            height={1290}
            className="w-full h-auto object-cover"
            sizes="(max-width: 640px) 90vw, 448px"
          />
        </div>

        {/* Video */}
        <div className="aspect-video w-full max-w-2xl mx-auto mb-16 border border-brand-border overflow-hidden bg-black">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/4ofoo9ARjZU"
            title="“Open Fire” 7 hole flute by RootFlute"
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
