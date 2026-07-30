"use client";

import { useState } from "react";
import Image from "next/image";

const promotionalPhotos = [
  { src: "/press-kit/photos/IMG_6001.jpg", alt: "Promotional photo 1" },
  { src: "/press-kit/photos/IMG_EBA118AAA523-1.jpeg", alt: "Promotional photo 2" },
  { src: "/press-kit/photos/Screenshot 2025-04-05 at 10.13.58 AM.JPEG", alt: "Promotional photo 3" },
  { src: "/press-kit/photos/22A9089A-3214-4930-A880-D05C1688C053 2.JPG", alt: "Promotional photo 4" },
  { src: "/press-kit/photos/930e787c-fa71-481c-a17a-c426f20ace0b.jpg", alt: "Promotional photo 5" },
  { src: "/press-kit/photos/IMG_5039.jpg", alt: "Promotional photo 6" },
  { src: "/press-kit/photos/ccd15128-af2f-4f44-8c1a-132498d7c1d0 2.JPG", alt: "Promotional photo 7" },
  { src: "/press-kit/photos/View recent photos.PNG", alt: "Promotional photo 8" },
  { src: "/press-kit/photos/View recent photos 2.png", alt: "Promotional photo 9" },
  { src: "/press-kit/photos/View recent photos 3.png", alt: "Promotional photo 10" },
  { src: "/press-kit/photos/View recent photos 4.png", alt: "Promotional photo 11" },
];

export default function PromotionalPhotoGallery() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openGallery = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeGallery = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        (selectedImageIndex + 1) % promotionalPhotos.length
      );
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        (selectedImageIndex - 1 + promotionalPhotos.length) %
          promotionalPhotos.length
      );
    }
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {promotionalPhotos.map((photo, index) => (
          <button
            key={index}
            onClick={() => openGallery(index)}
            className="relative aspect-square overflow-hidden rounded-sm group cursor-pointer"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeGallery}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl hover:text-brand-gold transition-colors z-51"
            onClick={closeGallery}
            aria-label="Close gallery"
          >
            ✕
          </button>
          <div
            className="relative w-full max-w-4xl aspect-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={promotionalPhotos[selectedImageIndex].src}
              alt={promotionalPhotos[selectedImageIndex].alt}
              fill
              className="object-contain"
              priority
            />
          </div>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-brand-gold transition-colors"
            onClick={prevImage}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-brand-gold transition-colors"
            onClick={nextImage}
            aria-label="Next image"
          >
            ›
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {selectedImageIndex + 1} / {promotionalPhotos.length}
          </div>
        </div>
      )}
    </>
  );
}
