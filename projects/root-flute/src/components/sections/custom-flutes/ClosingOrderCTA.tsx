"use client";

// The closing acquisition moment for a firm-price, checkout-enabled Custom
// Flute Style (2026-09-23 all-flute acquisition UX pass). Deliberately NOT a
// second purchase panel and NOT a second Stripe/checkout implementation —
// it is a plain anchor link back to the SAME canonical <MadeToOrderPurchase>
// module already rendered earlier on this page (see `targetId`), so the
// visitor who has just finished the gallery/media experience gets one quiet,
// restrained invitation back to the acquisition moment rather than a
// duplicated form. Works with JS disabled too (a real `<a href="#id">`,
// browser-native jump); with JS, the scroll is smoothed and centered.
export default function ClosingOrderCTA({
  cta,
  targetId,
  contextLine = "Made for you, one at a time.",
}: {
  /** Design-specific verb, e.g. "Order Your Drone Flute →". */
  cta: string;
  /** The id of the existing purchase panel to scroll back to. */
  targetId: string;
  contextLine?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-brand-muted text-sm italic mb-1">{contextLine}</p>
      <a
        href={`#${targetId}`}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }}
        className="inline-flex items-center justify-center font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold bg-brand-gold text-brand-dark hover:bg-brand-gold-light px-8 py-4 text-base sm:text-lg"
      >
        {cta}
      </a>
    </div>
  );
}
