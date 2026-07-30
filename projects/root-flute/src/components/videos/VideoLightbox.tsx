"use client";

import { useEffect } from "react";

export default function VideoLightbox({ src, title, onClose }: { src: string; title: string; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="relative w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
        <video src={src} controls autoPlay playsInline className="w-full h-full bg-black">
          Your browser does not support embedded video.
        </video>
      </div>

      <button
        onClick={onClose}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-white/35 hover:text-white/75 text-[10px] font-sans uppercase tracking-[0.4em] transition-colors duration-200 focus-visible:outline-none"
        aria-label="Close video"
      >
        Close
      </button>
    </div>
  );
}
