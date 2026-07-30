"use client";

import { useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import ItemBlock from "@/components/inventory/ItemBlock";
import InstrumentsInquiryModal from "./InstrumentsInquiryModal";
import type { InventoryItem } from "@/lib/inventory";

export default function InstrumentsCollection({ items }: { items: InventoryItem[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState("");

  function openAcquire(instrumentName: string) {
    setSelectedInstrument(instrumentName);
    setModalOpen(true);
  }

  return (
    <>
      <SectionWrapper className="bg-brand-surface-2">
        <div id="collection" className="scroll-mt-20 sm:scroll-mt-24" />

        <div className="text-center mb-14">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
            The Collection
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text mb-6">
            {items.length > 0
              ? `${items.length} instrument${items.length === 1 ? "" : "s"}. ${items.length === 1 ? "One intention" : "Many intentions"}.`
              : "The next instrument is being shaped."}
          </h2>
          <p className="text-brand-muted text-base leading-relaxed max-w-2xl mx-auto">
            Each instrument is made once. There is no restocking, no reordering, no
            reproduction. When it finds its player, it is gone.
          </p>
        </div>

        {items.length > 0 ? (
          <div className="flex flex-col">
            {items.map((item, i) => (
              <ItemBlock
                key={item.id}
                item={item}
                noun="Instrument"
                layout={i % 2 === 0 ? "left" : "right"}
                isLast={i === items.length - 1}
                priority={i === 0}
                onAcquire={openAcquire}
              />
            ))}
          </div>
        ) : (
          <div className="border border-brand-border py-24 px-6 text-center">
            <p className="text-brand-muted text-sm max-w-md mx-auto leading-relaxed">
              There is no instrument currently available. Follow along for word of the next release.
            </p>
          </div>
        )}

        <p className="text-center text-brand-muted text-sm max-w-lg mx-auto leading-relaxed mt-10">
          Past instruments are not available. Each is worked once — and never again.
        </p>
      </SectionWrapper>

      <InstrumentsInquiryModal
        isOpen={modalOpen}
        defaultItem={selectedInstrument}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
