"use client";

import { useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import ItemBlock from "@/components/inventory/ItemBlock";
import ProductVideos from "@/components/inventory/ProductVideos";
import InstrumentsInquiryModal from "./InstrumentsInquiryModal";
import { inquiryContext, isMadeToOrder, type InventoryItem } from "@/lib/inventory";

// Single-item counterpart to InstrumentsCollection — same ItemBlock card and
// the same inquiry modal, just rendering one instrument instead of the list.
export default function InstrumentDetail({ item }: { item: InventoryItem }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <SectionWrapper className="bg-brand-surface-2">
        <ItemBlock
          item={item}
          noun="Instrument"
          layout="left"
          isLast
          priority
          onAcquire={() => setModalOpen(true)}
        />
        {item.videos && item.videos.length > 0 && <ProductVideos videos={item.videos} />}
      </SectionWrapper>

      <InstrumentsInquiryModal
        isOpen={modalOpen}
        defaultItem={inquiryContext(item)}
        madeToOrder={isMadeToOrder(item)}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
