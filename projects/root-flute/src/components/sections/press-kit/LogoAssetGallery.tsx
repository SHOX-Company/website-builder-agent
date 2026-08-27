"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDownload } from "@/hooks/useDownload";

type LogoAsset = {
  id: number;
  path: string;
};

const SWIPE_THRESHOLD = 50;

function preload(src: string) {
  if (typeof window === "undefined") return;
  const img = new window.Image();
  img.src = src;
}

function filenameFor(logo: LogoAsset) {
  return `RootFlute-Logo-${logo.id}.png`;
}

export default function LogoAssetGallery({ logos }: { logos: LogoAsset[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { downloadingId, handleDownload } = useDownload();
  const touchStartX = useRef<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const activeLogo = activeIndex !== null ? logos[activeIndex] : null;

  const goTo = useCallback(
    (next: number) => {
      setActiveIndex(((next % logos.length) + logos.length) % logos.length);
    },
    [logos.length]
  );

  const close = useCallback(() => {
    setActiveIndex(null);
    triggerRef.current?.focus();
  }, []);

  // Preload adjacent logos so left/right navigation feels instant
  useEffect(() => {
    if (activeIndex === null || logos.length < 2) return;
    preload(logos[(activeIndex + 1) % logos.length].path);
    preload(logos[(activeIndex - 1 + logos.length) % logos.length].path);
  }, [activeIndex, logos]);

  // Focus the dialog on open
  useEffect(() => {
    if (activeIndex !== null) {
      closeButtonRef.current?.focus();
    }
  }, [activeIndex]);

  // Keyboard: Escape, arrows, and a lightweight focus trap
  useEffect(() => {
    if (activeIndex === null) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key === "ArrowLeft") {
        goTo(activeIndex! - 1);
        return;
      }
      if (e.key === "ArrowRight") {
        goTo(activeIndex! + 1);
        return;
      }
      if (e.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusables = dialog.querySelectorAll<HTMLElement>("button, a[href]");
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, close, goTo]);

  // Lock background scroll while the preview is open
  useEffect(() => {
    if (activeIndex === null) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [activeIndex]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-brand-surface-2 rounded-sm">
        {logos.map((logo, index) => (
          <button
            key={logo.id}
            type="button"
            onClick={(e) => {
              triggerRef.current = e.currentTarget;
              setActiveIndex(index);
            }}
            className="aspect-square bg-brand-surface rounded overflow-hidden flex items-center justify-center hover:bg-brand-surface-2 transition-all group relative cursor-pointer"
            aria-label={`Preview Logo ${logo.id}`}
          >
            <div className="w-full h-full relative flex items-center justify-center p-2">
              <img
                src={logo.path}
                alt={`Root Flute logo variation ${logo.id}`}
                className="object-contain max-w-full max-h-full"
                draggable={false}
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="text-[10px] uppercase tracking-[0.25em] opacity-0 group-hover:opacity-100 transition-opacity text-white">
                Preview
              </span>
            </div>
          </button>
        ))}
      </div>

      {activeLogo && activeIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`Logo preview, ${activeIndex + 1} of ${logos.length}`}
          ref={dialogRef}
        >
          {/* Close */}
          <button
            ref={closeButtonRef}
            onClick={close}
            className="absolute top-3 right-3 sm:top-6 sm:right-6 w-11 h-11 flex items-center justify-center text-white/60 hover:text-white text-2xl transition-colors focus-visible:outline-none z-10"
            aria-label="Close preview"
          >
            ✕
          </button>

          {/* Prev / Next — desktop */}
          {logos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(activeIndex - 1);
                }}
                className="hidden sm:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 text-white/60 hover:text-white transition-colors focus-visible:outline-none z-10"
                aria-label="Previous logo"
              >
                <span
                  className="text-4xl leading-none select-none"
                  style={{ textShadow: "0 0 20px rgba(0,0,0,1)" }}
                >
                  ‹
                </span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(activeIndex + 1);
                }}
                className="hidden sm:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 text-white/60 hover:text-white transition-colors focus-visible:outline-none z-10"
                aria-label="Next logo"
              >
                <span
                  className="text-4xl leading-none select-none"
                  style={{ textShadow: "0 0 20px rgba(0,0,0,1)" }}
                >
                  ›
                </span>
              </button>
            </>
          )}

          {/* Content */}
          <div
            className="relative w-full max-w-md flex flex-col items-center animate-[modal-entry_0.25s_ease-out]"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const delta = e.changedTouches[0].clientX - touchStartX.current;
              if (delta > SWIPE_THRESHOLD) goTo(activeIndex - 1);
              else if (delta < -SWIPE_THRESHOLD) goTo(activeIndex + 1);
              touchStartX.current = null;
            }}
          >
            <p className="text-brand-gold/70 text-[10px] uppercase tracking-[0.35em] mb-4">
              Logo {activeLogo.id} of {logos.length}
            </p>

            {/* Transparency preview canvas — checkerboard is preview-only, never downloaded */}
            <div className="checkerboard-bg w-full max-w-[360px] aspect-[1587/2245] rounded-sm shadow-[0_25px_80px_rgba(0,0,0,0.6)] border border-white/10 flex items-center justify-center p-6 sm:p-8">
              <img
                src={activeLogo.path}
                alt={`Root Flute logo variation ${activeLogo.id}, transparent PNG`}
                className="max-w-full max-h-full object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                draggable={false}
              />
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-6 text-brand-muted text-[11px] uppercase tracking-[0.15em] text-center">
              <span>PNG</span>
              <span className="text-brand-gold/30">•</span>
              <span>Transparent Background</span>
              <span className="text-brand-gold/30">•</span>
              <span>High Resolution</span>
              <span className="text-brand-gold/30">•</span>
              <span>Ready for Print &amp; Digital</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full max-w-xs sm:max-w-none">
              <button
                onClick={() => handleDownload(activeLogo.path, filenameFor(activeLogo))}
                disabled={downloadingId === filenameFor(activeLogo)}
                className="px-6 py-3 bg-brand-gold text-brand-dark text-sm tracking-wide font-medium rounded-sm hover:bg-brand-gold-light transition-colors disabled:opacity-70"
              >
                {downloadingId === filenameFor(activeLogo) ? "Downloading…" : "Download PNG"}
              </button>
              <a
                href={activeLogo.path}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-brand-gold/40 text-brand-gold text-sm tracking-wide rounded-sm hover:border-brand-gold hover:bg-brand-gold/10 transition-colors text-center"
              >
                Open Original File
              </a>
            </div>

            {/* Position indicator */}
            {logos.length > 1 && (
              <div className="flex items-center gap-2 mt-8">
                {logos.map((logo, i) => (
                  <button
                    key={logo.id}
                    onClick={() => goTo(i)}
                    aria-label={`Go to logo ${i + 1}`}
                    className={`block w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                      i === activeIndex ? "bg-brand-gold" : "bg-brand-muted/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
