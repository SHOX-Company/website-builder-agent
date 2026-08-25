import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

// Existing name + price copy, taken verbatim from each section component —
// used only for this route's metadata and breadcrumb, not re-rendered as
// new content (the component itself already renders its own heading/price).
const STYLES = {
  "bell-flutes": {
    name: "Bell Flutes",
    price: "from $1,500 — price based on labor and materials used",
    Component: BellFlutes,
  },
  "point-flutes": {
    name: "Point Flutes",
    price: "from $1,400 — price based on labor and materials used",
    Component: PointFlutes,
  },
  "drone-flutes": {
    name: "Drone Flutes",
    price: "from $2,000 — price based on labor and materials used",
    Component: DroneFlutes,
  },
  "mayan-harmony-flutes": {
    name: "Mayan Harmony Flutes",
    price: "starting at $2,200",
    Component: MayanHarmonyFlutes,
  },
  "triple-mayan-chord-flutes": {
    name: "Triple Mayan Chord Flutes",
    price: "starting at $3,300",
    Component: TripleMayanChord,
  },
  "four-chamber-mayan-chord-flutes": {
    name: "Four Chamber Mayan Chord Flutes",
    price: "starting at $4,200",
    Component: FourChamberMayanChord,
  },
  "rack-flutes": {
    name: "Rack Flutes",
    price: "starting at $6,500",
    Component: RackFlute,
  },
  "snake-flutes": {
    name: "Snake Flutes",
    price: "starting at $2,400",
    Component: SnakeFlutes,
  },
  "mammoth-tusk-flutes": {
    name: "Mammoth Tusk Flute",
    price: "price upon request",
    Component: MammothTuskFlutes,
  },
} as const;

type StyleSlug = keyof typeof STYLES;

export function generateStaticParams() {
  return Object.keys(STYLES).map((style) => ({ style }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ style: string }>;
}): Promise<Metadata> {
  const { style } = await params;
  const entry = STYLES[style as StyleSlug];
  if (!entry) return {};

  const title = `${entry.name} | Custom Flute Styles | RootFlute`;
  const description = `${entry.name} — ${entry.price}. Custom flute style made to order by RootFlute.`;
  const canonicalUrl = `${SITE_URL}/custom-flutes/${style}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
  };
}

export default async function CustomFluteStylePage({
  params,
}: {
  params: Promise<{ style: string }>;
}) {
  const { style } = await params;
  const entry = STYLES[style as StyleSlug];
  if (!entry) notFound();

  const { Component } = entry;

  return (
    <main>
      <section className="relative overflow-hidden bg-brand-dark pt-32 sm:pt-40 pb-6">
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <Link
            href="/custom-flutes"
            className="text-brand-gold/60 text-xs uppercase tracking-[0.4em] font-sans hover:text-brand-gold/90 transition-colors"
          >
            ← All Custom Flute Styles
          </Link>
        </div>
      </section>

      <Component />

      <Footer />
    </main>
  );
}
