import { NextRequest, NextResponse } from "next/server";
import { getInventoryItem, updateInventoryItem, deleteInventoryItem } from "@/lib/inventoryStore";
import type { InventoryItemInput } from "@/lib/inventory";

const PATCHABLE_KEYS: (keyof InventoryItemInput)[] = [
  "category",
  "name",
  "price",
  "published",
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

  const patch: Partial<InventoryItemInput> = {};
  for (const key of PATCHABLE_KEYS) {
    if (key in body) {
      patch[key] = body[key];
    }
  }
  if (typeof patch.name === "string") patch.name = patch.name.trim();

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
