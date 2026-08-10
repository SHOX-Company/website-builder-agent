"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { subscribeCurrentFluteRef, type CurrentFluteRef } from "@/lib/currentFluteRef";
import { startCheckout } from "@/lib/checkoutClient";

export default function StickyBar() {
  const [visible, setVisible] = useState(false);
  const [currentFlute, setCurrentFlute] = useState<CurrentFluteRef>(null);
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "redirecting" | "error">("idle");
  const pathname = usePathname();
  const isFlutes = pathname === "/flutes";
  const isHome = pathname === "/";
  const isJewelry = pathname === "/jewelry";
  const isInstruments = pathname === "/instruments";

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => subscribeCurrentFluteRef(setCurrentFlute), []);

  // Resets a stuck "Redirecting…" button when the customer returns via
  // browser Back and the page is restored from bfcache (no fresh mount).
  useEffect(() => {
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) setCheckoutStatus("idle");
    }
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  async function handleClaimClick() {
    if (!currentFlute || !currentFlute.eligible) {
      document.getElementById("acquire")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (checkoutStatus === "redirecting") return;
    setCheckoutStatus("redirecting");
    const url = await startCheckout(currentFlute.id);
    if (url) {
      window.location.href = url;
    } else {
      setCheckoutStatus("error");
    }
  }

  // No sticky bar on homepage, jewelry, or instruments — those pages have per-item CTAs.
  // RootFlute Studio (/studio) is a separate private app and never shows the public CTA bar.
  if (isHome || isJewelry || isInstruments || pathname.startsWith("/studio")) return null;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed bottom-0 inset-x-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-brand-surface border-t border-brand-border shadow-2xl">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">

          {isFlutes ? (
            <>
              <p className="text-brand-muted text-sm hidden sm:block">
                One instrument available now.{" "}
                <span className="text-brand-gold font-semibold">
                  Ancient materials. Impossible to replicate.
                </span>
              </p>
              <p className="text-brand-gold font-semibold text-sm sm:hidden">
                One instrument available now.
              </p>
              <button
                type="button"
                onClick={handleClaimClick}
                disabled={checkoutStatus === "redirecting"}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold bg-brand-gold text-brand-dark hover:bg-brand-gold-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
              >
                {checkoutStatus === "redirecting"
                  ? "Redirecting…"
                  : checkoutStatus === "error"
                  ? "Try Again →"
                  : "Claim This Instrument →"}
              </button>
            </>
          ) : (
            // /society and any other route
            <>
              <p className="text-brand-muted text-sm hidden sm:block">
                Founding seats are limited.{" "}
                <span className="text-brand-gold font-semibold">
                  Join before they&apos;re gone.
                </span>
              </p>
              <p className="text-brand-gold font-semibold text-sm sm:hidden">
                Founding seats are limited.
              </p>
              <a
                href="https://skool.com/rootflute"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold bg-brand-gold text-brand-dark hover:bg-brand-gold-light transition-colors duration-200 flex-shrink-0"
              >
                Claim Your Seat →
              </a>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
