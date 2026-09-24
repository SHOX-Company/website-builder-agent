import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { getPublicInventory } from "@/lib/inventoryStore";
import { isCheckoutEligible } from "@/lib/inventory";
import MadeToOrderPurchase from "@/components/inventory/MadeToOrderPurchase";
import ClosingOrderCTA from "./ClosingOrderCTA";

// Content migrated verbatim from the old RootFlute site
// (https://www.rootflute.com/mayan-harmony-flutes) — "MADE TO ORDER" label is
// Daniel's original words, not rewritten. The standalone RootFlute logo
// graphic present on the old page was intentionally not migrated (site
// chrome, not Mayan-Harmony-specific content — same rule established for
// Bell Flutes, Point Flutes, and Drone Flutes). The source images had no
// legitimate individual captions (just raw filenames/empty alt text), so
// none were invented.
//
// Customer-facing name updated from "Harmony Flutes" to "Double Harmony
// Flutes" and starting price updated from $2,200 to $2,600 (2026-09-23
// canonical production update). The internal file/directory naming
// ("mayan-harmony-flutes") and the route slug are unchanged — only the
// rendered customer-facing text changed, and the existing shared URL
// (/custom-flutes/mayan-harmony-flutes) keeps working.
//
// Video 2 (mayan-harmony-flutes-video-1.mp4, "double1") replaced the prior
// YouTube embed with the first approved supplied clip, self-hosted from
// /public the same way as every other native <video> in this section
// (Drone Flutes, Snake Flutes, Four Chamber Mayan Chord) — no Blob involved
// for this static marketing section. It is UNCHANGED and UNMOVED-IN-STORAGE
// by the addition below; it only moved to the second position on the page.
//
// Video 1 (mayan-harmony-flutes-video-2.mp4, "double2", 2026-09-23) is a
// NEW, ADDITIONAL clip placed FIRST per operator instruction — this is not
// a replacement. The operator-supplied source
// (~/Downloads/double2.mp4, 3840x2160, H.264/AAC already, but a
// ~1.9GB/52.5Mbps camera-master export unsuitable for direct web delivery)
// was transcoded to a web-appropriate 1920x1080 derivative at the same
// H.264 High-profile/AAC/CRF23/faststart settings used for the Triple Chord
// derivative, for consistency and file-size sanity — not for codec
// compatibility (the source was already H.264/AAC). Duration, aspect ratio,
// orientation, audio sync and visual content are unchanged; only
// resolution/bitrate were reduced. The original source file in Downloads is
// untouched. Poster frame extracted directly from the source video via
// ffmpeg (no AI-generated media), downscaled to match the derivative's
// resolution.
const images = [
  "/images/custom-flutes/mayan-harmony-flutes/mayan-harmony-flute-1.jpg",
  "/images/custom-flutes/mayan-harmony-flutes/mayan-harmony-flute-2.jpg",
  "/images/custom-flutes/mayan-harmony-flutes/mayan-harmony-flute-3.jpg",
  "/images/custom-flutes/mayan-harmony-flutes/mayan-harmony-flute-4.jpg",
  "/images/custom-flutes/mayan-harmony-flutes/mayan-harmony-flute-5.jpg",
  "/images/custom-flutes/mayan-harmony-flutes/mayan-harmony-flute-6.jpg",
];

// Price converted from "Starting at $2,600" to Daniel's final approved FIRM
// price of $2,600 (same number, no longer presented as variable), with real
// made-to-order Full/50% Deposit commerce enabled (2026-09-23 Operation
// Bulletproof pricing + deposit commerce conversion), reusing the EXACT same
// certified architecture as Mammoth and Triple Chord — no new backend code.
// See TripleMayanChord.tsx for the full explanation of the lookup-by-name /
// `getPublicInventory("flute")[0]` safety pattern this also relies on.
const DOUBLE_HARMONY_ITEM_NAME = "Double Harmony Flutes";

export default async function MayanHarmonyFlutes() {
  const flutes = await getPublicInventory("flute");
  const item = flutes.find((i) => i.name === DOUBLE_HARMONY_ITEM_NAME) ?? null;
  const eligible = item ? isCheckoutEligible(item) : false;

  return (
    <SectionWrapper className="bg-brand-surface-2">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
            Custom Flute Style
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text mb-4">
            Double Harmony Flutes
          </h2>
          <p className="text-brand-muted text-sm">$2,600</p>
          <p className="text-brand-muted text-sm">MADE TO ORDER</p>
        </div>

        {item && eligible && (
          <div className="max-w-md mx-auto mb-16 border border-brand-border bg-brand-surface p-6 sm:p-8">
            <MadeToOrderPurchase item={item} noun="Flute" id="double-harmony-order" />
          </div>
        )}

        {/* Videos */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          <div className="aspect-video w-full border border-brand-border overflow-hidden bg-black">
            <video
              controls
              preload="metadata"
              poster="/videos/custom-flutes/mayan-harmony-flutes/mayan-harmony-flutes-video-2-poster.jpg"
              aria-label="Double Harmony flute, by RootFlute"
              className="w-full h-full object-contain"
            >
              <source
                src="/videos/custom-flutes/mayan-harmony-flutes/mayan-harmony-flutes-video-2.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="aspect-video w-full border border-brand-border overflow-hidden bg-black">
            <video
              controls
              preload="metadata"
              poster="/videos/custom-flutes/mayan-harmony-flutes/mayan-harmony-flutes-video-1-poster.jpg"
              aria-label="Double Harmony flute, by RootFlute"
              className="w-full h-full object-contain"
            >
              <source
                src="/videos/custom-flutes/mayan-harmony-flutes/mayan-harmony-flutes-video-1.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>

        {/* Photographs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-16">
          {images.map((src) => (
            <div key={src} className="relative aspect-square border border-brand-border overflow-hidden">
              <Image
                src={src}
                alt="Double Harmony Flute"
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>

        {/* Closing acquisition CTA (2026-09-23 all-flute acquisition UX pass) —
            one restrained closing moment after the gallery, scrolling back to
            the SAME purchase panel above (#double-harmony-order) — not a
            second checkout. */}
        {item && eligible && (
          <ClosingOrderCTA cta="Order Your Double Harmony Flute →" targetId="double-harmony-order" />
        )}
      </div>
    </SectionWrapper>
  );
}
