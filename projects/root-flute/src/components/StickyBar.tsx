"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function StickyBar() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const isFlutes = pathname === "/flutes";

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            </>
          ) : (
            <>
              <p className="text-brand-muted text-sm hidden sm:block">
                Founding seats are limited.{" "}
                <span className="text-brand-gold font-semibold">
                  350 total — join before they&apos;re gone.
                </span>
              </p>
              <p className="text-brand-gold font-semibold text-sm sm:hidden">
                Founding seats are limited.
              </p>
              <a
                href="#community"
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
