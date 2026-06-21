"use client";

import { useState, useEffect } from "react";
import FluteInquiryModal from "./FluteInquiryModal";

export default function FinalCTAFlutes() {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const open = () => setModalOpen(true);
    window.addEventListener("rootflute:open-flute-modal", open);
    return () => window.removeEventListener("rootflute:open-flute-modal", open);
  }, []);

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
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold bg-brand-gold text-brand-dark hover:bg-brand-gold-light px-8 py-4 text-base sm:text-lg"
            >
              Begin Acquisition Inquiry →
            </button>
            <a
              href="#current-drop"
              className="inline-flex items-center justify-center font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark px-8 py-4 text-base sm:text-lg"
            >
              View the Instrument
            </a>
          </div>

          <p className="text-brand-muted/50 text-xs">
            Only 25 Woolly Mammoth tusks remain. Each acquisition is handled personally by Daniel.
          </p>

        </div>
      </section>

      <FluteInquiryModal
        isOpen={modalOpen}
        defaultItem="Woolly Mammoth Tusk Flute"
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
