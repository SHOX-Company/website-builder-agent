"use client";

import { useEffect, useState } from "react";

export default function StickyBar() {
  const [visible, setVisible] = useState(false);

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
        </div>
      </div>
    </div>
  );
}
