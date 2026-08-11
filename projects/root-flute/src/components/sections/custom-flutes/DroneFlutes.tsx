import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";

// Content migrated verbatim from the old RootFlute site
// (https://www.rootflute.com/drone-flutes) — price note and sold-piece
// caption are Daniel's original words, not rewritten. The standalone
// RootFlute logo graphic present on the old page was intentionally not
// migrated (site chrome, not Drone-Flute-specific content — same rule
// established for Bell Flutes and Point Flutes). Both source videos were
// self-hosted Squarespace native videos (not YouTube); recovered from their
// publicly-served HLS streams and stored locally as mp4 — see CF-3.1 report.
const soldPieces = [
  { src: "/images/custom-flutes/drone-flutes/drone-flute-sold-2000.jpg", caption: "sold for $2,000" },
];

export default function DroneFlutes() {
  return (
    <SectionWrapper className="bg-brand-surface-2">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
            Custom Flute Style
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text mb-4">
            Drone Flutes
          </h2>
          <p className="text-brand-muted text-sm">
            from $2,000 - price based on labor and materials used
          </p>
        </div>

        {/* Videos */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-16">
          <div className="aspect-[4/5] w-full border border-brand-border overflow-hidden bg-black">
            <video controls preload="metadata" className="w-full h-full object-contain">
              <source src="/videos/custom-flutes/drone-flutes/drone-flute-video-1.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="aspect-[9/16] w-full border border-brand-border overflow-hidden bg-black">
            <video controls preload="metadata" className="w-full h-full object-contain">
              <source src="/videos/custom-flutes/drone-flutes/drone-flute-video-2.mp4" type="video/mp4" />
            </video>
          </div>
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
