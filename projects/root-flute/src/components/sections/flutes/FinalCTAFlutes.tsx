"use client";

import { useState, useEffect } from "react";
import FluteInquiryModal from "./FluteInquiryModal";
import {
  inquiryContext,
  isCheckoutEligible,
  isMadeToOrder,
  isShowcase,
  type InventoryItem,
} from "@/lib/inventory";
import { startCheckout } from "@/lib/checkoutClient";

export default function FinalCTAFlutes({ items }: { items: InventoryItem[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "redirecting" | "error">("idle");
  const [stickyVisible, setStickyVisible] = useState(false);
  const current = items[0] ?? null;
  const eligible = current ? isCheckoutEligible(current) : false;
  // Showcase example: never reaches Stripe — inquiry only.
  const showcase = current ? isShowcase(current) : false;
  // Permanent made-to-order flute: a purchase records an order and the design
  // stays live. Purchasable when it has a price, inquiry-only when it doesn't.
  const madeToOrder = current ? isMadeToOrder(current) : false;
  const inquiryOnly = showcase || (madeToOrder && !eligible);
  const inquiryItem = current ? inquiryContext(current) : "";

  // Resets a stuck "Redirecting…" button when the customer returns via
  // browser Back and the page is restored from bfcache (no fresh mount).
  useEffect(() => {
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) setCheckoutStatus("idle");
    }
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // The sticky bar appears once the hero has scrolled away.
  useEffect(() => {
    const onScroll = () => setStickyVisible(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleAcquireClick() {
    if (!current || showcase || !eligible) {
      setModalOpen(true);
      return;
    }
    if (checkoutStatus === "redirecting") return;
    setCheckoutStatus("redirecting");
    const url = await startCheckout(current.id);
    if (url) {
      window.location.href = url;
    } else {
      setCheckoutStatus("error");
    }
  }

  return (
    <>
      <section id="acquire" className="relative bg-brand-dark py-20 sm:py-36 overflow-hidden">

        {/* Gold bloom */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(196,151,58,0.08),transparent)]"
        />

        {/* Horizontal accent lines */}
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent"
        />

        <div className="relative z-10 w-full max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-8 sm:gap-10">

          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans">
            {showcase || madeToOrder ? "Made to Order" : "One Available Now"}
          </p>

          {/* h2 — clamp scales 32px→48px across 360–565px, then sm:text-6xl takes over */}
          <h2 className="font-display text-[clamp(2rem,8.5vw,3rem)] sm:text-6xl md:text-7xl font-light text-brand-text leading-[1.1] sm:leading-tight w-full">
            Own a
            <br />
            <span className="italic text-brand-gold">Once-in-a-Lifetime</span>
            <br />
            Instrument.
          </h2>

          <p className="text-brand-muted text-base sm:text-lg leading-relaxed max-w-xl">
            Ancient material. Singular craft. A voice that no factory, no technology, and no
            future craftsman can replicate. This is not a purchase — it is a stewardship of
            something irreplaceable.
          </p>

          <p className="font-display text-2xl sm:text-4xl font-light italic text-brand-gold/75">
            Impossible to replicate.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-center w-full sm:w-auto">
            <button
              type="button"
              onClick={handleAcquireClick}
              disabled={checkoutStatus === "redirecting"}
              className="inline-flex items-center justify-center font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold bg-brand-gold text-brand-dark hover:bg-brand-gold-light disabled:opacity-40 disabled:cursor-not-allowed px-8 py-4 text-base sm:text-lg"
            >
              {showcase
                ? "Request a Made-to-Order Flute →"
                : checkoutStatus === "redirecting"
                ? "Redirecting…"
                : madeToOrder
                ? eligible
                  ? "Order This Flute →"
                  : "Request a Made-to-Order Flute →"
                : eligible
                ? "Claim This Instrument →"
                : "Begin Acquisition Inquiry →"}
            </button>
            <a
              href="#current-drop"
              className="inline-flex items-center justify-center font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark px-8 py-4 text-base sm:text-lg"
            >
              View the Instrument
            </a>
          </div>

          {checkoutStatus === "error" && (
            <p className="text-red-400/90 text-xs font-sans">
              Something went wrong starting checkout — please try again.
            </p>
          )}

          <p className="text-brand-muted/50 text-xs">
            {inquiryOnly
              ? "Private inquiry · Handled personally by Daniel"
              : eligible
              ? "Secure checkout via Stripe."
              : "Only 25 Woolly Mammoth tusks remain. Each acquisition is handled personally by Daniel."}
          </p>

        </div>
      </section>

      {/* Sticky bar — rendered HERE (not in the global layout bar) so its copy
          comes from the same server-provided item as the rest of the page: the
          server-rendered HTML and the hydrated page always agree. The global
          StickyBar deliberately renders nothing on /flutes. */}
      {current && (
        <div
          aria-hidden={!stickyVisible}
          className={`fixed bottom-0 inset-x-0 z-50 transition-transform duration-300 ${
            stickyVisible ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="bg-brand-surface border-t border-brand-border shadow-2xl">
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
              <p className="text-brand-muted text-sm hidden sm:block">
                {madeToOrder
                  ? "Made to order. Each individually handcrafted."
                  : showcase
                  ? "Individually made to order."
                  : "One instrument available now."}{" "}
                <span className="text-brand-gold font-semibold">
                  {showcase || madeToOrder
                    ? "Ancient materials. Each one shaped for its player."
                    : "Ancient materials. Impossible to replicate."}
                </span>
              </p>
              <p className="text-brand-gold font-semibold text-sm sm:hidden">
                {madeToOrder
                  ? "Made to order. Each individually handcrafted."
                  : showcase
                  ? "Individually made to order."
                  : "One instrument available now."}
              </p>
              <button
                type="button"
                onClick={() => {
                  // Inquiry-only listings open the existing inquiry; a finite piece
                  // with no price scrolls to the acquisition section (as before);
                  // anything purchasable goes straight to Stripe.
                  if (inquiryOnly) setModalOpen(true);
                  else if (!eligible) document.getElementById("acquire")?.scrollIntoView({ behavior: "smooth" });
                  else handleAcquireClick();
                }}
                disabled={checkoutStatus === "redirecting"}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold bg-brand-gold text-brand-dark hover:bg-brand-gold-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
              >
                {inquiryOnly
                  ? "Request a Made-to-Order Flute →"
                  : checkoutStatus === "redirecting"
                  ? "Redirecting…"
                  : checkoutStatus === "error"
                  ? "Try Again →"
                  : madeToOrder
                  ? "Order This Flute →"
                  : "Claim This Instrument →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rendered outside the sticky bar on purpose: the bar is CSS-transformed,
          and a `fixed` modal inside a transformed ancestor is positioned against
          that ancestor instead of the viewport. */}
      <FluteInquiryModal
        isOpen={modalOpen}
        defaultItem={inquiryItem}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
