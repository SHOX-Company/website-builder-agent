import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { getPublicInventory } from "@/lib/inventoryStore";
import { isCheckoutEligible } from "@/lib/inventory";
import MadeToOrderPurchase from "@/components/inventory/MadeToOrderPurchase";
import ClosingOrderCTA from "./ClosingOrderCTA";

// Content migrated verbatim from the old RootFlute site
// (https://www.rootflute.com/4-chamber-mayan-chord) — "MADE TO ORDER" label
// is Daniel's original words, not rewritten. The standalone RootFlute logo
// graphic present on the old page was intentionally not migrated (site
// chrome, not Four-Chamber-Mayan-Chord content — same rule established for
// every prior Custom Flutes section). Video 1 was a self-hosted Squarespace
// native video; recovered from its publicly-served HLS stream and stored
// locally as mp4 (same method as Drone Flutes, see CF-3.1). Video 2 is a
// direct YouTube embed. The source images had no legitimate individual
// captions (just raw filenames/empty alt text), so none were invented.
//
// Customer-facing name completed from "Four Chamber Mayan Chord Flutes" to
// "Four Chamber Chord Flutes" ("Mayan" removed), matching the PUBLIC NAMING
// list in the 2026-09-23 Operation Bulletproof pricing conversion and the
// Navbar's existing "Four Chamber Chord Flutes" label (previously a
// display-only nav shorthand — this brings the page heading into line with
// it, completing the same "Mayan" removal already done for Double Harmony
// and Triple Chord in the prior task). The internal file/directory naming
// ("four-chamber-mayan-chord") and the route slug are unchanged — only the
// rendered customer-facing text changed, so the existing shared URL keeps
// working. Price converted from "starting at $4,200" to Daniel's final
// approved FIRM price of $4,500, with real made-to-order Full/50% Deposit
// commerce enabled, reusing the EXACT same certified architecture as
// Mammoth and Triple Chord — no new backend code. See TripleMayanChord.tsx
// for the full explanation of the lookup-by-name /
// `getPublicInventory("flute")[0]` safety pattern this also relies on.
const images = [
  "/images/custom-flutes/four-chamber-mayan-chord/four-chamber-mayan-chord-1.jpg",
  "/images/custom-flutes/four-chamber-mayan-chord/four-chamber-mayan-chord-2.jpg",
  "/images/custom-flutes/four-chamber-mayan-chord/four-chamber-mayan-chord-3.jpg",
  "/images/custom-flutes/four-chamber-mayan-chord/four-chamber-mayan-chord-4.jpg",
  "/images/custom-flutes/four-chamber-mayan-chord/four-chamber-mayan-chord-5.jpg",
  "/images/custom-flutes/four-chamber-mayan-chord/four-chamber-mayan-chord-6.jpg",
  "/images/custom-flutes/four-chamber-mayan-chord/four-chamber-mayan-chord-7.jpg",
  "/images/custom-flutes/four-chamber-mayan-chord/four-chamber-mayan-chord-8.jpg",
];

const FOUR_CHAMBER_ITEM_NAME = "Four Chamber Chord Flutes";

export default async function FourChamberMayanChord() {
  const flutes = await getPublicInventory("flute");
  const item = flutes.find((i) => i.name === FOUR_CHAMBER_ITEM_NAME) ?? null;
  const eligible = item ? isCheckoutEligible(item) : false;

  return (
    <SectionWrapper className="bg-brand-surface-2">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
            Custom Flute Style
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text mb-4">
            Four Chamber Chord Flutes
          </h2>
          <p className="text-brand-muted text-sm">$4,500</p>
          <p className="text-brand-muted text-sm">MADE TO ORDER</p>
        </div>

        {item && eligible && (
          <div className="max-w-md mx-auto mb-16 border border-brand-border bg-brand-surface p-6 sm:p-8">
            <MadeToOrderPurchase item={item} noun="Flute" id="four-chamber-order" />
          </div>
        )}

        {/* Videos */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          <div className="aspect-video w-full border border-brand-border overflow-hidden bg-black">
            <video
              controls
              preload="none"
              poster="/videos/custom-flutes/four-chamber-mayan-chord/four-chamber-mayan-chord-video-1-poster.jpg"
              className="w-full h-full object-contain"
            >
              <source
                src="/videos/custom-flutes/four-chamber-mayan-chord/four-chamber-mayan-chord-video-1.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="aspect-video w-full border border-brand-border overflow-hidden bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/qxdsgcZcFSU"
              title="Enchanting Antler Flute Music at Volcán de Fuego | Rootflute"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />
          </div>
        </div>

        {/* Photographs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-16">
          {images.map((src) => (
            <div key={src} className="relative aspect-square border border-brand-border overflow-hidden">
              <Image
                src={src}
                alt="Four Chamber Chord Flute"
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>

        {/* Closing acquisition CTA (2026-09-23 all-flute acquisition UX pass) —
            one restrained closing moment after the gallery, scrolling back to
            the SAME purchase panel above (#four-chamber-order) — not a second
            checkout. */}
        {item && eligible && (
          <ClosingOrderCTA cta="Order Your Four Chamber Chord Flute →" targetId="four-chamber-order" />
        )}
      </div>
    </SectionWrapper>
  );
}
