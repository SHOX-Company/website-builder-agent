import { NextRequest, NextResponse } from "next/server";
import { getInventoryItem, updateInventoryItem, deleteInventoryItem } from "@/lib/inventoryStore";
import { canBeMadeToOrder, type InventoryItemInput } from "@/lib/inventory";

const PATCHABLE_KEYS: (keyof InventoryItemInput)[] = [
  "category",
  "name",
  "price",
  "published",
  "showcase",
  "madeToOrder",
  "configurations",
  "inclusions",
  "videos",
  "featured",
  "shortDescription",
  "story",
  "materials",
  "specifications",
  "featuredImage",
  "additionalImages",
  "video",
  "order",
];

// Sizes/configurations: each with its own whole-dollar full price. These are
// the ONLY prices a checkout for the design may use (see resolveCheckoutSelection).
function validateConfigurations(value: unknown): string | null {
  if (!Array.isArray(value) || value.length > 6) return "Configurations must be a list of up to 6 sizes.";
  const seen = new Set<string>();
  for (const c of value) {
    if (!c || typeof c !== "object") return "Each configuration must be an object.";
    const { id, label, price } = c as Record<string, unknown>;
    if (typeof id !== "string" || !/^[a-z0-9-]{1,32}$/.test(id)) return "Configuration id must be 1-32 lowercase letters, digits or hyphens.";
    if (seen.has(id)) return "Configuration ids must be unique.";
    seen.add(id);
    if (typeof label !== "string" || label.trim().length === 0 || label.length > 40) return "Configuration label must be 1-40 characters.";
    if (typeof price !== "number" || !Number.isInteger(price) || price < 1 || price > 1_000_000) return "Configuration price must be a whole dollar amount.";
  }
  return null;
}

function validateVideos(value: unknown): string | null {
  if (!Array.isArray(value) || value.length > 6) return "Videos must be a list of up to 6 items.";
  for (const v of value) {
    if (!v || typeof v !== "object") return "Each video must be an object.";
    const { url, title, poster } = v as Record<string, unknown>;
    const okUrl = (u: unknown) => typeof u === "string" && (u.startsWith("https://") || u.startsWith("/"));
    if (!okUrl(url)) return "Video url must be an https:// or site-relative URL.";
    if (typeof title !== "string" || title.trim().length === 0 || title.length > 120) return "Video title must be 1-120 characters.";
    if (poster !== undefined && !okUrl(poster)) return "Video poster must be an https:// or site-relative URL.";
  }
  return null;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getInventoryItem(id);
  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });

  if (
    body.featuredImage !== undefined &&
    (!body.featuredImage || typeof body.featuredImage.url !== "string" || body.featuredImage.url.trim().length === 0)
  ) {
    return NextResponse.json({ error: "A featured image is required." }, { status: 400 });
  }
  if (body.order !== undefined && (!Number.isInteger(body.order) || body.order < 1)) {
    return NextResponse.json({ error: "Display order must be a positive whole number." }, { status: 400 });
  }
  if (body.showcase !== undefined && typeof body.showcase !== "boolean") {
    return NextResponse.json({ error: "Showcase must be true or false." }, { status: 400 });
  }
  if (body.madeToOrder !== undefined && typeof body.madeToOrder !== "boolean") {
    return NextResponse.json({ error: "Made to order must be true or false." }, { status: 400 });
  }
  if (body.configurations !== undefined) {
    const err = validateConfigurations(body.configurations);
    if (err) return NextResponse.json({ error: err }, { status: 400 });
  }
  if (body.videos !== undefined) {
    const err = validateVideos(body.videos);
    if (err) return NextResponse.json({ error: err }, { status: 400 });
  }
  if (body.inclusions !== undefined && (typeof body.inclusions !== "string" || body.inclusions.length > 300)) {
    return NextResponse.json({ error: "Inclusions must be text of at most 300 characters." }, { status: 400 });
  }

  const patch: Partial<InventoryItemInput> = {};
  for (const key of PATCHABLE_KEYS) {
    if (key in body) {
      patch[key] = body[key];
    }
  }
  if (typeof patch.name === "string") patch.name = patch.name.trim();

  // A permanent made-to-order design must be an Instrument or Flute and can't also be a
  // (non-purchasable) showcase example. Validated against the record AS IT
  // WOULD BE after this patch, so a partial patch can't create a bad combo.
  const current = await getInventoryItem(id);
  if (!current) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const merged = { ...current, ...patch };
  if (merged.madeToOrder === true && !canBeMadeToOrder(merged.category)) {
    return NextResponse.json({ error: "Only Instruments and Flutes can be made-to-order designs." }, { status: 400 });
  }
  if (merged.madeToOrder === true && merged.showcase === true) {
    return NextResponse.json({ error: "A piece can't be both a made-to-order design and a showcase example." }, { status: 400 });
  }

  const item = await updateInventoryItem(id, patch);
  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ item });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = await deleteInventoryItem(id);
  if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
