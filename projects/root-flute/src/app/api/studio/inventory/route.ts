import { NextRequest, NextResponse } from "next/server";
import { getInventory, createInventoryItem } from "@/lib/inventoryStore";
import type { InventoryCategory, InventoryItemInput } from "@/lib/inventory";

const CATEGORIES: InventoryCategory[] = ["flute", "instrument", "jewelry"];

export async function GET() {
  const items = await getInventory();
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });

  const { category, name, price, shortDescription, story, materials, specifications, featuredImage } = body;

  if (!CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "A valid category is required." }, { status: 400 });
  }
  if (typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Product name is required." }, { status: 400 });
  }
  if (price !== null && typeof price !== "number") {
    return NextResponse.json({ error: "Price must be a number or null." }, { status: 400 });
  }
  if (typeof shortDescription !== "string" || shortDescription.trim().length === 0) {
    return NextResponse.json({ error: "Short description is required." }, { status: 400 });
  }
  if (typeof story !== "string" || story.trim().length === 0) {
    return NextResponse.json({ error: "Story / background is required." }, { status: 400 });
  }
  if (typeof materials !== "string" || materials.trim().length === 0) {
    return NextResponse.json({ error: "Materials is required." }, { status: 400 });
  }
  if (!featuredImage || typeof featuredImage.url !== "string" || featuredImage.url.trim().length === 0) {
    return NextResponse.json({ error: "A featured image is required." }, { status: 400 });
  }

  const input: InventoryItemInput = {
    category,
    name: name.trim(),
    price,
    published: body.published !== false,
    featured: Boolean(body.featured),
    shortDescription: shortDescription.trim(),
    story: story.trim(),
    materials: materials.trim(),
    specifications: typeof specifications === "string" ? specifications.trim() : "",
    featuredImage,
    additionalImages: Array.isArray(body.additionalImages) ? body.additionalImages : [],
    video: typeof body.video === "string" && body.video.trim().length > 0 ? body.video : null,
  };

  const item = await createInventoryItem(input);
  return NextResponse.json({ item }, { status: 201 });
}
