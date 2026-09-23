import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { getPublicInventory } from "@/lib/inventoryStore";
import { isCheckoutEligible } from "@/lib/inventory";
import MadeToOrderPurchase from "@/components/inventory/MadeToOrderPurchase";

// Content migrated verbatim from the old RootFlute site
// (https://www.rootflute.com/drone-flutes) — sold-piece caption is Daniel's
// original words, not rewritten. The standalone RootFlute logo graphic
// present on the old page was intentionally not migrated (site chrome, not
// Drone-Flute-specific content — same rule established for Bell Flutes and
// Point Flutes). Both source videos were self-hosted Squarespace native
// videos (not YouTube); recovered from their publicly-served HLS streams and
// stored locally as mp4 — see CF-3.1 report.
//
// Price converted from variable ("from $2,000 - price based on labor and
// materials used") to Daniel's final approved FIRM price of $2,600, with real
// made-to-order Full/50% Deposit commerce enabled (2026-09-23 Operation
// Bulletproof pricing + deposit commerce conversion), reusing the EXACT same
// certified architecture as Mammoth and Triple Chord — no new backend code.
// See TripleMayanChord.tsx for the full explanation of the lookup-by-name /
// `getPublicInventory("flute")[0]` safety pattern this also relies on.
const soldPieces = [
  { src: "/images/custom-flutes/drone-flutes/drone-flute-sold-2000.jpg", caption: "sold for $2,000" },
];

const DRONE_ITEM_NAME = "Drone Flutes";

export default async function DroneFlutes() {
  const flutes = await getPublicInventory("flute");
  const item = flutes.find((i) => i.name === DRONE_ITEM_NAME) ?? null;
  const eligible = item ? isCheckoutEligible(item) : false;

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
          <p className="text-brand-muted text-sm">$2,600</p>
          <p className="text-brand-muted text-sm">MADE TO ORDER</p>
        </div>

        {item && eligible && (
          <div className="max-w-md mx-auto mb-16 border border-brand-border bg-brand-surface p-6 sm:p-8">
            <MadeToOrderPurchase item={item} noun="Flute" id="drone-order" />
          </div>
        )}

        {/* Videos */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-16">
          <div className="aspect-[4/5] w-full border border-brand-border overflow-hidden bg-black">
            <video
              controls
              preload="none"
              poster="/videos/custom-flutes/drone-flutes/drone-flute-video-1-poster.jpg"
              className="w-full h-full object-contain"
            >
              <source src="/videos/custom-flutes/drone-flutes/drone-flute-video-1.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="aspect-[9/16] w-full border border-brand-border overflow-hidden bg-black">
            <video
              controls
              preload="none"
              poster="/videos/custom-flutes/drone-flutes/drone-flute-video-2-poster.jpg"
              className="w-full h-full object-contain"
            >
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
