"use client";

import { useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import ItemBlock from "@/components/inventory/ItemBlock";
import JewelryInquiryModal from "./JewelryInquiryModal";
import { inquiryContext, type InventoryItem } from "@/lib/inventory";

// Single-item counterpart to JewelryCollection — same ItemBlock card and the
// same inquiry modal, just rendering one piece instead of the list. Modeled
// on InstrumentDetail.tsx.
export default function JewelryDetail({ item }: { item: InventoryItem }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <SectionWrapper className="bg-brand-surface-2">
        <ItemBlock
          item={item}
          noun="Piece"
          layout="left"
          isLast
          priority
          onAcquire={() => setModalOpen(true)}
        />
      </SectionWrapper>

      <JewelryInquiryModal
        isOpen={modalOpen}
        defaultPiece={inquiryContext(item)}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
