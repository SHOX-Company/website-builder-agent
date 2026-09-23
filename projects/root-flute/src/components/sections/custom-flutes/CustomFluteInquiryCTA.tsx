"use client";

import { useState } from "react";
import FluteInquiryModal from "@/components/sections/flutes/FluteInquiryModal";

// The acquisition path for the seven Custom Flute Styles whose displayed
// price is a "starting at" figure rather than an authoritative, deposit-
// eligible checkout price (Bell, Point, Drone, Double Harmony, Four Chamber,
// Rack, Snake — see the 2026-09-23 commerce readiness audit). None of these
// have firm shipping/deposit terms published anywhere, and three of them
// (Bell/Point/Drone) explicitly say their price varies with labor and
// materials — none of that is a number a Stripe Checkout Session may safely
// be built from. Per explicit instruction: no fake/disabled "Pay $X" button,
// no invented fixed price — this reuses the SAME existing inquiry
// infrastructure already certified for /flutes (FluteInquiryModal ->
// /api/flute-inquiry -> sendInquiryEmail, both required internal recipients),
// with the specific design name carried through as `item` so the inquiry is
// never generic. Once a design's firm price is ever authorized, its page can
// switch to <MadeToOrderPurchase> instead (see TripleMayanChord.tsx),
// reusing the exact same underlying commerce architecture.
//
// Deliberately restrained language, matching the recent Mammoth cleanup
// principle ("luxury = clarity + restraint") and avoiding generic ecommerce
// phrasing (no "Buy Now" / "Add to Cart").
export default function CustomFluteInquiryCTA({ design }: { design: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold bg-brand-gold text-brand-dark hover:bg-brand-gold-light px-8 py-4 text-base sm:text-lg"
        >
          Have This Flute Made for You →
        </button>
        <p className="text-brand-muted/60 text-xs font-sans">
          Private acquisition inquiry &nbsp;·&nbsp; Handled personally by Daniel
        </p>
      </div>
      <FluteInquiryModal isOpen={open} defaultItem={design} onClose={() => setOpen(false)} />
    </>
  );
}
