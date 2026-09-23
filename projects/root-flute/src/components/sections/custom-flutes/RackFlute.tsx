import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { getPublicInventory } from "@/lib/inventoryStore";
import { isCheckoutEligible } from "@/lib/inventory";
import MadeToOrderPurchase from "@/components/inventory/MadeToOrderPurchase";

// Content migrated verbatim from the old RootFlute site
// (https://www.rootflute.com/rack-flutes) — the source page had no
// "MADE TO ORDER" label and no materials/details text (unlike some other
// sections). The standalone RootFlute logo graphic present on the old page
// was intentionally not migrated (site chrome, not Rack-Flute-specific
// content — same rule established for every prior Custom Flutes section).
// All three videos are direct YouTube embeds. The source images had no
// legitimate individual captions (just raw filenames/empty alt text), so
// none were invented.
//
// RACK NAMING GUARD (2026-09-23 Operation Bulletproof audit): Daniel said
// "Triple rack flutes" when confirming the $7,500 price. Audited — the
// phrase only appears in two of this page's own YouTube video titles
// describing this design's construction (a rack of three tubes); there is
// no separate "Triple Rack Flutes" page, route, nav entry, or inventory
// record anywhere in the codebase. Verdict: no separate design exists —
// name stays "Rack Flutes", price is applied here unambiguously.
//
// Price converted from "Starting at $6,500" to Daniel's final approved FIRM
// price of $7,500, with real made-to-order Full/50% Deposit commerce
// enabled, reusing the EXACT same certified architecture as Mammoth and
// Triple Chord — no new backend code. This is a LONG page (13 photographs),
// so per the CTA strategy it keeps both an upper and a lower purchase
// touchpoint — the same two-full-panel pattern already certified for
// Mammoth's own long-page /flutes layout (CurrentDrop + FinalCTAFlutes),
// not a duplicated form fighting itself: each panel independently resolves
// and submits against the same authoritative server-side item/price. See
// TripleMayanChord.tsx for the full explanation of the lookup-by-name /
// `getPublicInventory("flute")[0]` safety pattern this also relies on.
const videos = [
  { id: "aLtf9-UbJyY", title: "Triple Drone Harmony Flute made from Elk Antler" },
  { id: "66Q-p8ssihA", title: 'Custom "triple rack flute" by RootFlute' },
  { id: "QEWxIhIM28Q", title: 'Custom "Triple Rack Flute" by RootFlute' },
];

const images = [
  "/images/custom-flutes/rack-flute/rack-flute-1.jpg",
  "/images/custom-flutes/rack-flute/rack-flute-2.jpg",
  "/images/custom-flutes/rack-flute/rack-flute-3.jpg",
  "/images/custom-flutes/rack-flute/rack-flute-4.jpg",
  "/images/custom-flutes/rack-flute/rack-flute-5.jpg",
  "/images/custom-flutes/rack-flute/rack-flute-6.jpg",
  "/images/custom-flutes/rack-flute/rack-flute-7.jpg",
  "/images/custom-flutes/rack-flute/rack-flute-8.jpg",
  "/images/custom-flutes/rack-flute/rack-flute-9.jpg",
  "/images/custom-flutes/rack-flute/rack-flute-10.jpg",
  "/images/custom-flutes/rack-flute/rack-flute-11.jpg",
  "/images/custom-flutes/rack-flute/rack-flute-12.jpg",
  "/images/custom-flutes/rack-flute/rack-flute-13.jpg",
];

const RACK_ITEM_NAME = "Rack Flutes";

export default async function RackFlute() {
  const flutes = await getPublicInventory("flute");
  const item = flutes.find((i) => i.name === RACK_ITEM_NAME) ?? null;
  const eligible = item ? isCheckoutEligible(item) : false;

  return (
    <SectionWrapper className="bg-brand-surface-2">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
            Custom Flute Style
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text mb-4">
            Rack Flutes
          </h2>
          <p className="text-brand-muted text-sm">$7,500</p>
          <p className="text-brand-muted text-sm">MADE TO ORDER</p>
        </div>

        {/* Upper purchase touchpoint — see the file header for the two-panel reasoning. */}
        {item && eligible && (
          <div className="max-w-md mx-auto mb-16 border border-brand-border bg-brand-surface p-6 sm:p-8">
            <MadeToOrderPurchase item={item} noun="Flute" id="rack-order-upper" />
          </div>
        )}

        {/* Videos */}
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {videos.map((video) => (
            <div key={video.id} className="aspect-video w-full border border-brand-border overflow-hidden bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />
            </div>
          ))}
        </div>

        {/* Photographs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-16">
          {images.map((src) => (
            <div key={src} className="relative aspect-square border border-brand-border overflow-hidden">
              <Image
                src={src}
                alt="Rack Flute"
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>

        {/* Lower purchase touchpoint — see the file header for the two-panel reasoning. */}
        {item && eligible && (
          <div className="max-w-md mx-auto border border-brand-border bg-brand-surface p-6 sm:p-8">
            <MadeToOrderPurchase item={item} noun="Flute" id="rack-order-lower" />
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
