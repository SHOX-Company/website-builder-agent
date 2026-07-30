"use client";

import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { useState } from "react";

export default function PastEvents() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const events = Array.from({ length: 13 }, (_, i) => ({
    id: i + 1,
    src: `/images/past-events/event-${String(i + 1).padStart(2, "0")}.jpg`,
    alt: `Past event ${i + 1}`,
  }));

  return (
    <SectionWrapper className="bg-brand-surface py-12">
      <div className="mb-8">
        <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-3 text-center">
          Events
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-light text-brand-text text-center mb-2">
          Past Events
        </h2>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {events.map((event) => (
          <button
            key={event.id}
            onClick={() => setSelectedImage(event.id)}
            className="aspect-square relative overflow-hidden rounded-sm group cursor-pointer"
          >
            <Image
              src={event.src}
              alt={event.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl hover:text-brand-gold transition-colors z-51"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
          <div
            className="relative w-full max-w-4xl aspect-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={events[selectedImage - 1].src}
              alt={events[selectedImage - 1].alt}
              fill
              className="object-contain"
              priority
            />
          </div>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-brand-gold transition-colors"
            onClick={() =>
              setSelectedImage(selectedImage === 1 ? 13 : selectedImage - 1)
            }
          >
            ‹
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-brand-gold transition-colors"
            onClick={() =>
              setSelectedImage(selectedImage === 13 ? 1 : selectedImage + 1)
            }
          >
            ›
          </button>
        </div>
      )}
    </SectionWrapper>
  );
}
