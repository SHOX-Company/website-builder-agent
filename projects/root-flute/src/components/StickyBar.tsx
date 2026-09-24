"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// The eight non-Mammoth Custom Flute Style acquisition routes (2026-09-23
// Operation Bulletproof all-flute acquisition UX pass). Mammoth's own
// authoritative page (/flutes) already suppresses this bar below via
// `isFlutes`; the legacy /custom-flutes/mammoth-tusk-flutes page and the
// /custom-flutes index are deliberately NOT in this list — this task named
// only /flutes and these eight routes as acquisition pages needing a single,
// undivided intent.
const FLUTE_ACQUISITION_ROUTES = new Set([
  "/custom-flutes/bell-flutes",
  "/custom-flutes/point-flutes",
  "/custom-flutes/drone-flutes",
  "/custom-flutes/mayan-harmony-flutes",
  "/custom-flutes/triple-mayan-chord-flutes",
  "/custom-flutes/four-chamber-mayan-chord-flutes",
  "/custom-flutes/rack-flutes",
  "/custom-flutes/snake-flutes",
]);

export default function StickyBar() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const isFlutes = pathname === "/flutes";
  const isHome = pathname === "/";
  const isJewelry = pathname === "/jewelry";
  const isInstruments = pathname === "/instruments";
  const isFluteAcquisition = FLUTE_ACQUISITION_ROUTES.has(pathname ?? "");

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // No sticky bar on homepage, jewelry, instruments, flutes, or any of the
  // eight Custom Flute Style acquisition pages — a visitor evaluating/ordering
  // a flute should not simultaneously receive a competing Society-membership
  // sales CTA. Those pages have their own per-item acquisition CTAs (the
  // Flutes page renders its own sticky bar from its server-provided item, so
  // its copy is correct on the very first server render). RootFlute Studio
  // (/studio) is a separate private app and never shows the public CTA bar.
  if (isHome || isJewelry || isInstruments || isFlutes || isFluteAcquisition || pathname.startsWith("/studio")) return null;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed bottom-0 inset-x-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-brand-surface border-t border-brand-border shadow-2xl">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">

          {/* /society and any other route */}
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

        </div>
      </div>
    </div>
  );
}
