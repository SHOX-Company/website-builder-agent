import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE_URL } from "@/lib/siteMetadata";
import { slugify } from "@/lib/slug";
import Footer from "@/components/sections/Footer";
import InstrumentDetail from "@/components/sections/instruments/InstrumentDetail";
import { getPublicInventory } from "@/lib/inventoryStore";
import type { InventoryItem } from "@/lib/inventory";

// Instruments are one-of-one inventory pieces (sold once, never restocked),
// so — unlike the Custom Flute styles — there's no fixed slug list to
// prerender. This mirrors /instruments/page.tsx: live inventory, fetched
// fresh per request.
export const dynamic = "force-dynamic";

async function findInstrument(slug: string): Promise<InventoryItem | null> {
  const items = await getPublicInventory("instrument");
  return items.find((item) => slugify(item.name) === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await findInstrument(slug);
  if (!item) return {};

  const title = `${item.name} | RootFlute Instruments`;
  const description =
    item.shortDescription || "A one-of-one handcrafted instrument by RootFlute.";
  const canonicalUrl = `${SITE_URL}/instruments/${slug}`;
  const ogImage = item.featuredImage?.url ?? `${SITE_URL}/api/og?page=instruments`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "RootFlute",
      type: "website",
      images: [{ url: ogImage, alt: item.featuredImage?.alt || item.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function InstrumentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await findInstrument(slug);
  if (!item) notFound();

  return (
    <main>
      <section className="relative bg-[#07060B] pt-32 sm:pt-40 pb-6">
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <Link
            href="/instruments"
            className="text-brand-gold/60 text-xs uppercase tracking-[0.4em] font-sans hover:text-brand-gold/90 transition-colors"
          >
            ← All Instruments
          </Link>
        </div>
      </section>

      <InstrumentDetail item={item} />

      <Footer />
    </main>
  );
}
