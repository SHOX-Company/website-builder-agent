import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteMetadata";
import { slugify } from "@/lib/slug";
import { getPublicInventory } from "@/lib/inventoryStore";

// The public, indexable route list — mirrors the path values already
// registered in PAGE_META (src/lib/siteMetadata.ts, the single source of
// truth for this site's canonical URLs). Kept as its own list here rather
// than importing PAGE_META directly, to avoid touching that protected file.
// Studio (/studio/*) and the promoter mirror (/promoter/*) are intentionally
// excluded — both are already noindexed.
const PATHS = [
  "/",
  "/society",
  "/flutes",
  "/instruments",
  "/jewelry",
  "/videos/rootflute-live",
  "/videos/instruments",
  "/videos/lucid-meditation",
  "/music",
  "/press-kit",
  "/about",
  "/materials",
  "/tickets",
  "/testimonials",
  "/contact",
];

// Fixed slug list for the 9 Custom Flute Styles — matches the STYLES map in
// src/app/custom-flutes/[style]/page.tsx.
const CUSTOM_FLUTE_STYLE_PATHS = [
  "/custom-flutes/bell-flutes",
  "/custom-flutes/point-flutes",
  "/custom-flutes/drone-flutes",
  "/custom-flutes/mayan-harmony-flutes",
  "/custom-flutes/triple-mayan-chord-flutes",
  "/custom-flutes/four-chamber-mayan-chord-flutes",
  "/custom-flutes/rack-flutes",
  "/custom-flutes/snake-flutes",
  "/custom-flutes/mammoth-tusk-flutes",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const instruments = await getPublicInventory("instrument");
  const instrumentPaths = instruments.map((item) => `/instruments/${slugify(item.name)}`);

  const paths = [...PATHS, ...CUSTOM_FLUTE_STYLE_PATHS, ...instrumentPaths];

  return paths.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
  }));
}
