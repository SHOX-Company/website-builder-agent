"use client";

import { useState } from "react";
import InstrumentsInquiryModal from "./InstrumentsInquiryModal";

export default function FinalCTAInstruments() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section id="inquire" className="relative bg-brand-dark py-36 overflow-hidden">

        {/* Gold bloom */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(196,151,58,0.08),transparent)]"
        />

        {/* Accent lines */}
        <div aria-hidden="true" className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
        <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-10">

          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans">
            Private Acquisition
          </p>

          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-light text-brand-text leading-tight">
            Own an instrument
            <br />
            <span className="italic text-brand-gold">built for no one else.</span>
          </h2>

          <p className="text-brand-muted text-base sm:text-lg leading-relaxed max-w-xl">
            These are not instruments built for a market. They are built for a single person —
            the one who was always meant to play them. When one finds its owner, it will
            never be made again.
          </p>

          <p className="font-display text-3xl sm:text-4xl font-light italic text-brand-gold/75">
            Made once. Played for a lifetime.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center flex-wrap">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold bg-brand-gold text-brand-dark hover:bg-brand-gold-light px-8 py-4 text-lg"
            >
              Request Private Acquisition →
            </button>
            <a
              href="#collection"
              className="inline-flex items-center justify-center font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark px-8 py-4 text-lg"
            >
              View the Instruments
            </a>
          </div>

          <p className="text-brand-muted/50 text-xs">
            Each acquisition is handled personally by Daniel.
          </p>

        </div>
      </section>

      <InstrumentsInquiryModal
        isOpen={modalOpen}
        defaultItem="Handcrafted Instrument"
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
