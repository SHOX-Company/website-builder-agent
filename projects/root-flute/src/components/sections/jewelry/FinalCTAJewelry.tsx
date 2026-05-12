"use client";

import { useState } from "react";
import JewelryInquiryModal from "./JewelryInquiryModal";

export default function FinalCTAJewelry() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section id="inquire" className="relative bg-brand-dark py-36 overflow-hidden">

        {/* Warm amber bloom */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(196,151,58,0.07),transparent)]"
        />

        {/* Subtle violet secondary bloom */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_70%_60%,rgba(100,70,140,0.05),transparent)]"
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

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-10">

          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans">
            Three Pieces. Three Owners.
          </p>

          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-light text-brand-text leading-tight">
            Each piece
            <br />
            <span className="italic text-brand-gold">calls its own.</span>
          </h2>

          <p className="text-brand-muted text-base sm:text-lg leading-relaxed max-w-xl">
            There is no storefront, no cart, no checkout flow. If something here moves you,
            begin an acquisition inquiry. Daniel reviews every request personally.
          </p>

          <p className="font-display text-2xl sm:text-3xl font-light italic text-brand-gold/70">
            Handmade. Unrepeatable. Yours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center flex-wrap">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold bg-brand-gold text-brand-dark hover:bg-brand-gold-light px-8 py-4 text-lg"
            >
              Begin Acquisition Inquiry →
            </button>
            <a
              href="#collection"
              className="inline-flex items-center justify-center font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark px-8 py-4 text-lg"
            >
              View the Collection
            </a>
          </div>

          <p className="text-brand-muted/50 text-xs">
            Private acquisition inquiry &nbsp;·&nbsp; No automated responses
          </p>

        </div>
      </section>

      <JewelryInquiryModal
        isOpen={modalOpen}
        defaultPiece="General Inquiry"
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
