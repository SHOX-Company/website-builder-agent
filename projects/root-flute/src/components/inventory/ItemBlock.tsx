"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { isCheckoutEligible, type InventoryItem } from "@/lib/inventory";
import { startCheckout } from "@/lib/checkoutClient";
import PriceDisplay from "./PriceDisplay";
import ItemLightbox from "./ItemLightbox";

interface ItemBlockProps {
  item: InventoryItem;
  /** Used in copy: "Acquire This {noun} →" */
  noun: string;
  layout: "left" | "right";
  isLast?: boolean;
  priority?: boolean;
  /** Passes the full trusted inventory item (id, price, name) — not just its display name. */
  onAcquire: (item: InventoryItem) => void;
  /** Optional dedicated single-item route (e.g. "/instruments/harp"). Omit to hide the link — categories without a detail route (Jewelry) simply don't pass it. */
  detailHref?: string;
}

// Shared editorial "collection" layout for Jewelry and Instruments — a single
// full-bleed panel per piece, alternating image/copy sides, with a gold-frame
// image treatment and inline lightbox gallery. Also used, unmodified, inside
// the Studio Preview modal so the preview is pixel-identical to what
// publishes. Sold items never reach this component — the public pages and
// the Preview modal both only ever render "available" pieces.
export default function ItemBlock({ item, noun, layout, isLast = false, priority = false, onAcquire, detailHref }: ItemBlockProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "redirecting" | "error">("idle");
  const isRight = layout === "right";
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
    <div id={item.id} className="scroll-mt-24">
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 border border-brand-border overflow-hidden ${
          isRight ? "lg:[direction:rtl]" : ""
        }`}
      >
        {/* Image panel — gold frame */}
        <div
          className={`relative w-full max-h-[55vw] lg:max-h-none aspect-[4/3] lg:aspect-[3/4] lg:min-h-[500px] cursor-pointer group focus-visible:outline-2 focus-visible:outline-brand-gold ${
            isRight ? "lg:[direction:ltr]" : ""
          }`}
          onClick={() => setLightbox(0)}
          role="button"
          aria-label={item.name ? `View full image of ${item.name}` : "View full image"}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setLightbox(0)}
          style={{
            background:
              "linear-gradient(145deg, rgba(196,151,58,0.92) 0%, rgba(196,151,58,0.62) 50%, rgba(196,151,58,0.86) 100%)",
          }}
        >
          <div
            className="absolute inset-[4px] overflow-hidden bg-brand-dark"
            style={{ boxShadow: "inset 0 0 0 1px rgba(196,151,58,0.22), inset 0 0 32px rgba(0,0,0,0.5)" }}
          >
            {gallery[0] && (
              <>
                <Image
                  src={gallery[0].url}
                  alt=""
                  aria-hidden="true"
                  fill
                  unoptimized
                  className="lg:hidden object-cover object-center scale-110 pointer-events-none"
                  style={{ filter: "blur(18px) brightness(0.45) saturate(0.55)" }}
                  sizes="(max-width: 1024px) 100vw"
                />
                <div
                  className="absolute inset-0 z-10 lg:[mask-image:none] lg:[-webkit-mask-image:none]"
                  style={{
                    maskImage:
                      "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 7%, rgba(0,0,0,0.35) 14%, rgba(0,0,0,0.72) 21%, black 29%, black 71%, rgba(0,0,0,0.72) 79%, rgba(0,0,0,0.35) 86%, rgba(0,0,0,0.08) 93%, transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 7%, rgba(0,0,0,0.35) 14%, rgba(0,0,0,0.72) 21%, black 29%, black 71%, rgba(0,0,0,0.72) 79%, rgba(0,0,0,0.35) 86%, rgba(0,0,0,0.08) 93%, transparent 100%)",
                  }}
                >
                  <Image
                    src={gallery[0].url}
                    alt={gallery[0].alt}
                    fill
                    unoptimized
                    priority={priority}
                    className="object-contain lg:object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </>
            )}
            <div
              aria-hidden="true"
              className="absolute inset-0 z-20 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent pointer-events-none"
            />
            {gallery.length > 1 && (
              <div className="absolute bottom-5 right-5 z-30 transition-opacity duration-300 opacity-35 group-hover:opacity-90">
                <span className="text-white text-[10px] font-sans uppercase tracking-[0.35em]">View Gallery</span>
              </div>
            )}
          </div>
        </div>

        {/* Product panel */}
        <div
          className={`bg-brand-surface p-10 lg:p-14 flex flex-col justify-between gap-10 ${
            isRight ? "lg:[direction:ltr]" : ""
          }`}
        >
          <div className="flex flex-col gap-4">
            {item.name && (
              <>
                <p className="text-brand-gold text-xs uppercase tracking-widest font-sans">{item.name}</p>
                <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text leading-tight">
                  {item.name}
                </h2>
              </>
            )}
            {item.materials && (
              <p className="text-brand-muted text-xs uppercase tracking-widest">{item.materials}</p>
            )}
            {item.shortDescription && (
              <p className="font-display text-xl italic text-brand-text/60">{item.shortDescription}</p>
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
            <span className="inline-block border border-brand-border text-brand-muted text-xs uppercase tracking-widest px-4 py-2 self-start">
              Available Now &nbsp;·&nbsp; One of One
            </span>
            <button
              type="button"
              onClick={handleAcquireClick}
              disabled={checkoutStatus === "redirecting"}
              className="inline-flex items-center justify-center font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold bg-brand-gold text-brand-dark hover:bg-brand-gold-light disabled:opacity-40 disabled:cursor-not-allowed px-8 py-4 text-lg self-start"
            >
              {checkoutStatus === "redirecting" ? "Redirecting…" : `Acquire This ${noun} →`}
            </button>
            {checkoutStatus === "error" && (
              <p className="text-red-400/90 text-xs font-sans">
                Something went wrong starting checkout — please try again.
              </p>
            )}
            <p className="text-brand-muted/60 text-xs font-sans">
              {eligible
                ? "Secure checkout via Stripe"
                : <>Private acquisition inquiry &nbsp;·&nbsp; Handled personally by Daniel</>}
            </p>
            {detailHref && (
              <Link
                href={detailHref}
                className="group self-start inline-block text-brand-gold/60 text-[11px] uppercase tracking-[0.4em] font-sans transition-colors duration-300 hover:text-brand-gold/90"
              >
                <span className="border-b border-brand-gold/18 pb-[2px] transition-colors duration-300 group-hover:border-brand-gold/45">
                  View &amp; Share This {noun} →
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {!isLast && (
        <div aria-hidden="true" className="pt-16 sm:pt-20 pb-16 sm:pb-20 flex items-center gap-5">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brand-gold/15 to-transparent" />
          <div className="w-1 h-1 rounded-full bg-brand-gold/25" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-brand-gold/15 to-transparent" />
        </div>
      )}

      {lightbox !== null && gallery.length > 0 && (
        <ItemLightbox images={gallery} index={lightbox} onClose={() => setLightbox(null)} onIndexChange={setLightbox} />
      )}
    </div>
  );
}
