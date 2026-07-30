"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { InventoryImage } from "@/lib/inventory";

export default function ItemLightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: {
  images: InventoryImage[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + images.length) % images.length);
      else if (e.key === "ArrowRight") onIndexChange((index + 1) % images.length);
      else if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, images.length, onClose, onIndexChange]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
    >
      <div className="relative w-full max-w-lg max-h-[85vh] aspect-[3/4]" onClick={(e) => e.stopPropagation()}>
        <Image
          src={images[index].url}
          alt={images[index].alt}
          fill
          unoptimized
          className="object-contain"
          sizes="512px"
        />
        <button
          onClick={onClose}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 px-5 py-2 whitespace-nowrap text-white/55 text-[10px] font-sans uppercase tracking-[0.5em] bg-black/20 backdrop-blur-sm border border-white/8 transition-all duration-300 hover:text-white/88 hover:bg-black/30 focus-visible:outline-none"
          aria-label="Close gallery"
        >
          Back to Piece
        </button>
      </div>

      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onIndexChange((index - 1 + images.length) % images.length);
          }}
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 text-white/65 hover:text-white/95 transition-colors duration-200 focus-visible:outline-none"
          aria-label="Previous image"
        >
          <span className="text-4xl leading-none select-none" style={{ textShadow: "0 0 20px rgba(0,0,0,1)" }}>
            ‹
          </span>
        </button>
      )}

      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onIndexChange((index + 1) % images.length);
          }}
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 text-white/65 hover:text-white/95 transition-colors duration-200 focus-visible:outline-none"
          aria-label="Next image"
        >
          <span className="text-4xl leading-none select-none" style={{ textShadow: "0 0 20px rgba(0,0,0,1)" }}>
            ›
          </span>
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                onIndexChange(i);
              }}
              aria-label={`Image ${i + 1}`}
              className={`block w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                i === index ? "bg-brand-gold" : "bg-brand-muted/40"
              }`}
            />
          ))}
        </div>
      )}

      <button
        onClick={onClose}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-white/35 hover:text-white/75 text-[10px] font-sans uppercase tracking-[0.4em] transition-colors duration-200 focus-visible:outline-none"
        aria-label="Close gallery"
      >
        Close Gallery
      </button>
    </div>
  );
}
