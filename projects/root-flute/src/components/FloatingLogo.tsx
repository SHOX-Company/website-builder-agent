"use client";

import { useEffect, useState } from "react";

export default function FloatingLogo() {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setPastHero(window.scrollY > window.innerHeight * 0.9);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#"
      aria-label="RootFlute — scroll to top"
      className={`fixed top-0 left-0 z-50 p-6 transition-opacity duration-500 ${
        pastHero ? "opacity-100" : "opacity-100 sm:opacity-100"
      }`}
    >
      <span className="font-display text-brand-text text-3xl sm:text-4xl font-normal [text-shadow:0_2px_10px_rgba(0,0,0,0.75)]">
        Root<span className="text-brand-gold">Flute</span>
      </span>
    </a>
  );
}
