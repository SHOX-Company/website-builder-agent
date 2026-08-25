import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/siteMetadata";
import Footer from "@/components/sections/Footer";
import BellFlutes from "@/components/sections/custom-flutes/BellFlutes";
import PointFlutes from "@/components/sections/custom-flutes/PointFlutes";
import DroneFlutes from "@/components/sections/custom-flutes/DroneFlutes";
import MayanHarmonyFlutes from "@/components/sections/custom-flutes/MayanHarmonyFlutes";
import TripleMayanChord from "@/components/sections/custom-flutes/TripleMayanChord";
import FourChamberMayanChord from "@/components/sections/custom-flutes/FourChamberMayanChord";
import RackFlute from "@/components/sections/custom-flutes/RackFlute";
import SnakeFlutes from "@/components/sections/custom-flutes/SnakeFlutes";
import MammothTuskFlutes from "@/components/sections/custom-flutes/MammothTuskFlutes";

// Tasteful per-style CTA into that style's dedicated, directly shareable
// route — reuses the same underline-link treatment already established in
// HeroInstruments's "View the Instruments" link.
function ViewStyleLink({ slug, name }: { slug: string; name: string }) {
  return (
    <div className="bg-brand-surface-2 flex justify-center pb-14 sm:pb-16">
      <Link
        href={`/custom-flutes/${slug}`}
        className="group inline-block text-brand-gold/60 text-[11px] uppercase tracking-[0.4em] font-sans transition-colors duration-300 hover:text-brand-gold/90"
      >
        <span className="border-b border-brand-gold/18 pb-[2px] transition-colors duration-300 group-hover:border-brand-gold/45">
          View &amp; Share {name} →
        </span>
      </Link>
    </div>
  );
}

// Local metadata (not routed through the protected siteMetadata.ts registry)
// — this page doesn't need bespoke OG/social card treatment yet. The explicit
// canonical is required: without `alternates`, Next falls back to the root
// layout's metadataBase alone, which rendered this page's canonical as the
// homepage and told crawlers the entire Custom Flute Styles catalog was a
// duplicate of "/". Every page built through buildPageMetadata() already sets
// a self-referencing canonical the same way.
export const metadata: Metadata = {
  title: "Custom Flute Styles | RootFlute",
  description: "Custom flute styles made to order by RootFlute.",
  alternates: { canonical: `${SITE_URL}/custom-flutes` },
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
      <ViewStyleLink slug="bell-flutes" name="Bell Flutes" />

      <PointFlutes />
      <ViewStyleLink slug="point-flutes" name="Point Flutes" />

      <DroneFlutes />
      <ViewStyleLink slug="drone-flutes" name="Drone Flutes" />

      <MayanHarmonyFlutes />
      <ViewStyleLink slug="mayan-harmony-flutes" name="Mayan Harmony Flutes" />

      <TripleMayanChord />
      <ViewStyleLink slug="triple-mayan-chord-flutes" name="Triple Mayan Chord Flutes" />

      <FourChamberMayanChord />
      <ViewStyleLink slug="four-chamber-mayan-chord-flutes" name="Four Chamber Mayan Chord Flutes" />

      <RackFlute />
      <ViewStyleLink slug="rack-flutes" name="Rack Flutes" />

      <SnakeFlutes />
      <ViewStyleLink slug="snake-flutes" name="Snake Flutes" />

      <MammothTuskFlutes />
      <ViewStyleLink slug="mammoth-tusk-flutes" name="Mammoth Tusk Flute" />

      <Footer />
    </main>
  );
}
