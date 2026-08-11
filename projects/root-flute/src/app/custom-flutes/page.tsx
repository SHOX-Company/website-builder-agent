import type { Metadata } from "next";
import Footer from "@/components/sections/Footer";
import BellFlutes from "@/components/sections/custom-flutes/BellFlutes";
import PointFlutes from "@/components/sections/custom-flutes/PointFlutes";

// Local metadata (not routed through the protected siteMetadata.ts registry)
// — this page doesn't need bespoke OG/social card treatment yet.
export const metadata: Metadata = {
  title: "Custom Flute Styles | RootFlute",
  description: "Custom flute styles made to order by RootFlute.",
};

export default function CustomFlutesPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-brand-dark pt-36 sm:pt-44 pb-16 sm:pb-20">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(196,151,58,0.06),transparent_70%)]"
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-5">
          <p className="text-brand-gold text-xs uppercase tracking-[0.35em] font-sans">
            Custom Flute Styles
          </p>
          <h1 className="font-display font-light text-brand-text text-5xl sm:text-6xl md:text-7xl leading-[1.02]">
            Made to <span className="italic text-brand-gold">Order.</span>
          </h1>
          <div
            aria-hidden="true"
            className="w-10 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent my-2"
          />
        </div>
      </section>

      <BellFlutes />
      <PointFlutes />

      <Footer />
    </main>
  );
}
