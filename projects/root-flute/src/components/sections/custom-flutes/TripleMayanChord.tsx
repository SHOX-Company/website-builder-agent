import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { getPublicInventory } from "@/lib/inventoryStore";
import { isCheckoutEligible } from "@/lib/inventory";
import MadeToOrderPurchase from "@/components/inventory/MadeToOrderPurchase";
import ClosingOrderCTA from "./ClosingOrderCTA";

// Content migrated verbatim from the old RootFlute site
// (https://www.rootflute.com/triple-mayan-chord-flutes) — "MADE TO ORDER"
// label and materials line are Daniel's original words, not rewritten. The
// standalone RootFlute logo graphic present on the old page was
// intentionally not migrated (site chrome, not Triple-Mayan-Chord content —
// same rule established for every prior Custom Flutes section). The
// remaining source images had no legitimate individual captions (just raw
// filenames/empty alt text), so none were invented.
//
// Customer-facing name updated from "Triple Mayan Chord Flutes" to "Triple
// Chord Flutes" ("Mayan" removed) and the single $3,300 starting price
// replaced with two configurations, Small ($3,600, rooted in F#–E) and
// Large ($4,200, rooted in D–C) (2026-09-23 canonical production update).
// The internal file/directory naming ("triple-mayan-chord") and the route
// slug (/custom-flutes/triple-mayan-chord-flutes) are unchanged — only the
// rendered customer-facing text changed, so the existing shared URL keeps
// working.
//
// Video 1 is the ORIGINAL video that has been on this page since it was
// first built (commit 10cb6a0, "Add Triple Mayan Chord to Custom Flutes") —
// RootFlute's own YouTube upload (youtube.com/watch?v=BMNqOjPdr9g, titled
// "Triple Mayan Chord Flute", published on the @Rootflute channel). It was
// briefly replaced outright by the 2026-09-23 name/price update; that was a
// mistake (forensically confirmed via `git diff 10cb6a0..b15cf58` before
// this fix — this was the section's only video slot, so the embed was
// displaced rather than legitimately retired) and it is restored here in
// its original first position, per the same two-video grid pattern already
// used by Four Chamber Mayan Chord (native <video> + YouTube <iframe>,
// side by side).
//
// Video 2 (triple-mayan-chord-video-1.mp4) is the newly supplied clip,
// self-hosted from /public the same way as every other native <video> in
// this section — no Blob involved for this static marketing section. The
// public web copy is an H.264 (High profile) / AAC derivative transcoded
// from the operator-supplied AV1/Opus original for broad Safari/iOS
// compatibility; the original AV1 source is untouched in Downloads.
// Duration, aspect ratio, sync, frame rate and content are unchanged —
// only the codec. Poster frame extracted directly from the original video
// via ffmpeg (no AI-generated media).
const images = [
  "/images/custom-flutes/triple-mayan-chord/triple-mayan-chord-1.jpg",
  "/images/custom-flutes/triple-mayan-chord/triple-mayan-chord-2.jpg",
  "/images/custom-flutes/triple-mayan-chord/triple-mayan-chord-3.jpg",
  "/images/custom-flutes/triple-mayan-chord/triple-mayan-chord-4.jpg",
  "/images/custom-flutes/triple-mayan-chord/triple-mayan-chord-5.jpg",
];

const configurations = [
  { label: "Small", price: "$3,600", root: "F#–E" },
  { label: "Large", price: "$4,200", root: "D–C" },
];

// The single, authoritative name this design is looked up by in the flute
// inventory (see TRIPLE_CHORD_ITEM below) — the same "find by name" pattern
// already used elsewhere on this site (e.g. Instruments matches a detail
// page to its inventory record by slugified name). Deliberately NOT a
// hardcoded id: this component has no route param of its own to carry one,
// and matching by this exact, unique name is simple and self-documenting.
const TRIPLE_CHORD_ITEM_NAME = "Triple Chord Flutes";

// Real made-to-order commerce (2026-09-23), reusing the EXISTING certified
// architecture end to end — no parallel payment system. The inventory record
// is intentionally `category: "flute"` (the only category besides
// "instrument" that `isMadeToOrder` allows) yet never appears anywhere on
// /flutes: that page's only two flute-aware components (CurrentDrop,
// FinalCTAFlutes) both read exclusively `items[0]`, and Mammoth occupies that
// slot (kept at its existing, lower `order`). This record's sole purpose is
// to give the checkout/webhook/order/email pipeline something authoritative
// to price against; every customer-facing word on this page still comes from
// this component, not from any generic inventory template. A regression test
// (test-triple-chord-commerce.mjs) asserts `getPublicInventory("flute")[0]`
// stays the Mammoth record, guarding against this ever silently changing.
// Configurations/inclusions were set via the existing Studio inventory PATCH
// endpoint (already validated, already used for the Triton Shell Harp's own
// Large/Medium sizes) — no new backend code was needed for pricing or
// checkout. If the record is ever removed, this section still renders
// perfectly well without a purchase panel (no crash, no broken page).
export default async function TripleMayanChord() {
  const flutes = await getPublicInventory("flute");
  const item = flutes.find((i) => i.name === TRIPLE_CHORD_ITEM_NAME) ?? null;
  const eligible = item ? isCheckoutEligible(item) : false;

  return (
    <SectionWrapper className="bg-brand-surface-2">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
            Custom Flute Style
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text mb-4">
            Triple Chord Flutes
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-1 mb-1">
            {configurations.map((c) => (
              <p key={c.label} className="text-brand-muted text-sm">
                {c.label} — {c.price} · Rooted in {c.root}
              </p>
            ))}
          </div>
          <p className="text-brand-muted text-sm mb-4">MADE TO ORDER</p>
          <p className="text-brand-muted text-sm max-w-2xl mx-auto">
            Mammoth tusk, fossil walrus, Dino egg shell, black tourmaline, Romanian cave bear
            tooth, Ammonite, wild shed elk antler.
          </p>
        </div>

        {item && eligible && (
          <div className="max-w-md mx-auto mb-16 border border-brand-border bg-brand-surface p-6 sm:p-8">
            <MadeToOrderPurchase item={item} noun="Flute" id="triple-chord-order" />
          </div>
        )}

        {/* Videos */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          <div className="aspect-video w-full border border-brand-border overflow-hidden bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/BMNqOjPdr9g"
              title="Triple Mayan Chord Flute"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />
          </div>
          <div className="aspect-video w-full border border-brand-border overflow-hidden bg-black">
            <video
              controls
              preload="metadata"
              poster="/videos/custom-flutes/triple-mayan-chord/triple-mayan-chord-video-1-poster.jpg"
              aria-label="Triple Chord Flutes, by RootFlute"
              className="w-full h-full object-contain"
            >
              <source
                src="/videos/custom-flutes/triple-mayan-chord/triple-mayan-chord-video-1.mp4"
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
                alt="Triple Chord Flute"
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>

        {/* Closing acquisition CTA (2026-09-23 all-flute acquisition UX pass) —
            one restrained closing moment after the gallery, scrolling back to
            the SAME Size/Payment panel above (#triple-chord-order) — not a
            second checkout. */}
        {item && eligible && (
          <ClosingOrderCTA cta="Order Your Triple Chord Flute →" targetId="triple-chord-order" />
        )}
      </div>
    </SectionWrapper>
  );
}
