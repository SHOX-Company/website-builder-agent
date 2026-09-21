import { NextResponse } from "next/server";
import { getPublicInventory } from "@/lib/inventoryStore";
import { slugify } from "@/lib/slug";

// Feeds the Instruments dropdown in the main navigation. Reads the SAME public
// inventory source as /instruments and /instruments/[slug] (never a separate
// list), so the menu always matches exactly what is live: a design that is
// unpublished disappears, a renamed one follows its new slug, a new one
// appears — with no code change. Cached briefly at the edge so the Navbar
// (which is on every page) doesn't turn into a Blob read per page view.
export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getPublicInventory("instrument");
  const links = items
    .map((item) => ({ name: item.name.trim(), slug: slugify(item.name) }))
    // A record with no name has no URL — it can't be linked to.
    .filter((link) => link.name && link.slug);

  return NextResponse.json(
    { items: links },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
  );
}
