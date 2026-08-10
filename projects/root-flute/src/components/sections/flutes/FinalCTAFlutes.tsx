"use client";

import { useState, useEffect } from "react";
import FluteInquiryModal from "./FluteInquiryModal";
import { isCheckoutEligible, type InventoryItem } from "@/lib/inventory";
import { startCheckout } from "@/lib/checkoutClient";

export default function FinalCTAFlutes({ items }: { items: InventoryItem[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "redirecting" | "error">("idle");
  const current = items[0] ?? null;
  const eligible = current ? isCheckoutEligible(current) : false;

  useEffect(() => {
    const open = () => setModalOpen(true);
    window.addEventListener("rootflute:open-flute-modal", open);
    return () => window.removeEventListener("rootflute:open-flute-modal", open);
  }, []);

  async function handleAcquireClick() {
    if (!current || !eligible) {
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
            One Available Now
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
              {checkoutStatus === "redirecting"
                ? "Redirecting…"
                : eligible
                ? "Begin Acquisition →"
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
            {eligible
              ? "Secure checkout via Stripe."
              : "Only 25 Woolly Mammoth tusks remain. Each acquisition is handled personally by Daniel."}
          </p>

        </div>
      </section>

      <FluteInquiryModal
        isOpen={modalOpen}
        defaultItem={current?.name ?? ""}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
