"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * One gallery entry. An entry without `type` is an image (every existing
 * caller passes plain `{ url, alt }` images, so nothing else changes). A
 * `video` entry plays an already-hosted MP4 with native controls; `alt` is its
 * accessible title and `poster` its still frame.
 */
export interface GalleryMedia {
  url: string;
  alt: string;
  type?: "image" | "video";
  poster?: string;
}

export function isVideoMedia(media: GalleryMedia): boolean {
  return media.type === "video";
}

// The player for a video gallery entry. It is only ever mounted while its
// entry is the current one (see the `key` at the call site), so:
//  - it never autoplays and never starts by merely navigating to it — the
//    visitor presses the native Play control;
//  - navigating away (or closing the gallery) unmounts it, and the cleanup
//    below explicitly pauses first, so hidden playback can't continue.
function LightboxVideo({ media }: { media: GalleryMedia }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    return () => {
      v?.pause();
    };
  }, []);
  return (
    <video
      ref={ref}
      controls
      playsInline
      preload="metadata"
      poster={media.poster}
      title={media.alt}
      aria-label={media.alt}
      className="h-[72vh] w-auto max-w-full aspect-[9/16] bg-black object-contain"
    >
      <source src={media.url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

export default function ItemLightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: {
  images: GalleryMedia[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // With a video focused, the arrow keys belong to the player (seeking).
      if (e.target instanceof HTMLVideoElement && e.key !== "Escape") return;
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + images.length) % images.length);
      else if (e.key === "ArrowRight") onIndexChange((index + 1) % images.length);
      else if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, images.length, onClose, onIndexChange]);

  const current = images[index];
  const video = isVideoMedia(current);
  // Label each dot by kind and position within that kind: Video 1, Video 2, Image 1, Image 2.
  const dotLabels = images.map((m, i) => {
    const kind = isVideoMedia(m) ? "Video" : "Image";
    const n = images.slice(0, i + 1).filter((x) => isVideoMedia(x) === isVideoMedia(m)).length;
    return `${kind} ${n}`;
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Gallery"
    >
      {video ? (
        <div className="relative flex justify-center w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
          <LightboxVideo key={`${index}-${current.url}`} media={current} />
        </div>
      ) : (
        <div className="relative w-full max-w-lg max-h-[85vh] aspect-[3/4]" onClick={(e) => e.stopPropagation()}>
          <Image
            src={current.url}
            alt={current.alt}
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
      )}

      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onIndexChange((index - 1 + images.length) % images.length);
          }}
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 text-white/65 hover:text-white/95 transition-colors duration-200 focus-visible:outline-none"
          aria-label="Previous"
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
          aria-label="Next"
        >
          <span className="text-4xl leading-none select-none" style={{ textShadow: "0 0 20px rgba(0,0,0,1)" }}>
            ›
          </span>
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {images.map((m, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                onIndexChange(i);
              }}
              aria-label={dotLabels[i]}
              aria-current={i === index}
              className={`block w-1.5 h-1.5 transition-colors duration-200 ${isVideoMedia(m) ? "rotate-45" : "rounded-full"} ${
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
