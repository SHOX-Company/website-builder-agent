"use client";

import { useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import FluteDropPanel from "@/components/inventory/FluteDropPanel";
import FluteInquiryModal from "./FluteInquiryModal";
import type { InventoryItem } from "@/lib/inventory";

export default function CurrentDrop({ items }: { items: InventoryItem[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const current = items[0] ?? null;

  return (
    <>
      <SectionWrapper className="bg-brand-surface-2">
        <div id="current-drop" className="scroll-mt-20 sm:scroll-mt-24" />

        <div className="text-center mb-14">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
            Current Offering
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text mb-6">
            Born from 10,000 years of time.
          </h2>
          <p className="text-brand-muted text-base leading-relaxed max-w-2xl mx-auto">
            Each instrument is carved from ancient Woolly Mammoth tusk — preserved beneath Arctic
            permafrost for millennia. Released one at a time. Each one is the only one that will
            ever exist.
          </p>
        </div>

        {current ? (
          <FluteDropPanel item={current} onAcquire={() => setModalOpen(true)} />
        ) : (
          <div className="border border-brand-border py-24 px-6 text-center">
            <p className="font-display text-2xl font-light text-brand-text mb-3">
              The next drop is being shaped.
            </p>
            <p className="text-brand-muted text-sm max-w-md mx-auto leading-relaxed">
              There is no flute currently available. Follow along for word of the next release.
            </p>
          </div>
        )}
      </SectionWrapper>

      <FluteInquiryModal
        isOpen={modalOpen}
        defaultItem={current?.name ?? ""}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
