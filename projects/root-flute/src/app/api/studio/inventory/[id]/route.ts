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
