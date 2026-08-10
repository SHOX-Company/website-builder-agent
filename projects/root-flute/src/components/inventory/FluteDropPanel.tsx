"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { isCheckoutEligible, type InventoryItem } from "@/lib/inventory";
import { startCheckout } from "@/lib/checkoutClient";
import PriceDisplay from "./PriceDisplay";
import ItemLightbox from "./ItemLightbox";

// The Flutes page shows exactly one instrument at a time ("released one at a
// time") rather than a multi-item grid — this panel is that single-item
// "drop" treatment, now sourced from whichever flute in inventory is the
// current drop instead of a hardcoded object. Also used, unmodified, inside
// the Studio Preview modal.
export default function FluteDropPanel({
  item,
  onAcquire,
}: {
  item: InventoryItem;
  /** Passes the full trusted inventory item (id, price, name) — not just its display name. */
  onAcquire: (item: InventoryItem) => void;
}) {
  const [muted, setMuted] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "redirecting" | "error">("idle");
  const videoRef = useRef<HTMLVideoElement>(null);
  const eligible = isCheckoutEligible(item);
  const gallery = item.featuredImage ? [item.featuredImage, ...item.additionalImages] : item.additionalImages;

  async function handleAcquireClick() {
    if (!eligible) {
      onAcquire(item);
      return;
    }
    if (checkoutStatus === "redirecting") return;
    setCheckoutStatus("redirecting");
    const url = await startCheckout(item.id);
    if (url) {
      window.location.href = url;
    } else {
      setCheckoutStatus("error");
    }
  }

  function handleListen() {
    const v = videoRef.current;
    if (!v) return;
    if (muted) {
      v.currentTime = 0;
      v.muted = false;
      v.volume = 0.6;
      v.play().catch(() => {});
      setMuted(false);
    } else {
      v.muted = true;
      setMuted(true);
    }
  }

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.play().catch(() => {});
    }
  }, [item.video]);

  // Resets a stuck "Redirecting…" button when the customer returns via
  // browser Back and the page is restored from bfcache (no fresh mount).
  useEffect(() => {
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) setCheckoutStatus("idle");
    }
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 border border-brand-border overflow-hidden mb-3">
        {/* Left: media panel */}
        <div className="relative aspect-[3/4] lg:aspect-auto min-h-[500px] overflow-hidden bg-brand-dark">
          {item.featuredImage && (
            <Image
              src={item.featuredImage.url}
              alt={item.featuredImage.alt}
              fill
              unoptimized
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          )}

          {item.video && (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              loop
              preload="auto"
              disablePictureInPicture
              controls={false}
              className="absolute inset-0 w-full h-full object-cover z-[1]"
            >
              <source src={item.video} type="video/mp4" />
            </video>
          )}

          <div
            aria-hidden="true"
            className="absolute inset-0 z-[2] bg-gradient-to-t from-brand-dark/75 via-transparent to-transparent pointer-events-none"
          />

          {item.video && (
            <div className="absolute bottom-0 inset-x-0 z-[3] p-6 flex flex-col items-start gap-2">
              <button
                onClick={handleListen}
                className="border border-brand-gold/70 text-brand-gold text-xs uppercase tracking-[0.3em] font-sans px-5 py-2.5 hover:bg-brand-gold hover:text-brand-dark transition-colors duration-200 bg-brand-dark/40 backdrop-blur-sm"
              >
                {muted ? "Listen to the Flute" : "Mute"}
              </button>
              {muted && <p className="text-brand-muted/60 text-xs font-sans">Tap to hear the instrument</p>}
            </div>
          )}
        </div>

        {/* Right: product panel */}
        <div className="bg-brand-surface p-5 sm:p-10 lg:p-14 flex flex-col justify-between gap-8 sm:gap-10">
          <div className="flex flex-col gap-4">
            <p className="text-brand-gold text-xs uppercase tracking-widest font-sans">Current Drop</p>
            {item.name && (
              <h3 className="font-display text-3xl sm:text-5xl font-light text-brand-text leading-tight">
                {item.name}
              </h3>
            )}
            {item.materials && (
              <p className="text-brand-muted text-xs uppercase tracking-widest">{item.materials}</p>
            )}
            {item.shortDescription && (
              <p className="text-brand-muted/60 text-xs font-sans italic">{item.shortDescription}</p>
            )}
            {item.story && (
              <p className="text-brand-muted text-sm leading-relaxed mt-1">{item.story}</p>
            )}
            {item.specifications && (
              <div className="pt-4 border-t border-brand-border">
                <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans">
                  {item.specifications}
                </p>
              </div>
            )}
            <PriceDisplay price={item.price} />
          </div>

          <div className="flex flex-col gap-4">
            <span className="inline-block border border-brand-border text-brand-muted text-xs uppercase tracking-widest px-4 py-2 text-center sm:text-left sm:self-start">
              Extremely Limited &nbsp;·&nbsp; One Available Now
            </span>
            <button
              type="button"
              onClick={handleAcquireClick}
              disabled={checkoutStatus === "redirecting"}
              className="inline-flex items-center justify-center font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold bg-brand-gold text-brand-dark hover:bg-brand-gold-light disabled:opacity-40 disabled:cursor-not-allowed px-8 py-4 text-base sm:text-lg w-full sm:self-start sm:w-auto"
            >
              {checkoutStatus === "redirecting" ? "Redirecting…" : "Claim This Instrument →"}
            </button>
            {checkoutStatus === "error" && (
              <p className="text-red-400/90 text-xs font-sans text-center sm:text-left">
                Something went wrong starting checkout — please try again.
              </p>
            )}
            <p className="text-brand-muted/60 text-xs font-sans text-center sm:text-left">
              {eligible
                ? "Secure checkout via Stripe"
                : <>Private acquisition inquiry &nbsp;·&nbsp; Handled personally by Daniel</>}
            </p>
          </div>
        </div>
      </div>

      {gallery.length > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10" aria-label="Instrument gallery">
          {gallery.map((image, i) => (
            <button
              key={image.url + i}
              onClick={() => setLightbox(i)}
              className="relative aspect-square overflow-hidden border border-brand-border bg-brand-dark group focus-visible:outline-2 focus-visible:outline-brand-gold"
              aria-label={`View: ${image.alt}`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                unoptimized
                className="object-cover object-center opacity-55 group-hover:opacity-80 transition-opacity duration-300"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 group-hover:bg-brand-gold/5 transition-colors duration-300"
              />
            </button>
          ))}
        </div>
      )}

      <p className="text-center text-brand-muted text-sm max-w-lg mx-auto leading-relaxed">
        Past instruments are not available. Each tusk is worked once — and never again.
      </p>

      {lightbox !== null && (
        <ItemLightbox images={gallery} index={lightbox} onClose={() => setLightbox(null)} onIndexChange={setLightbox} />
      )}
    </>
  );
}
