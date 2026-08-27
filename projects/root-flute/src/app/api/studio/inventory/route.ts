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

  // Only a category and a featured image are required to publish — every
  // other field is optional and can be filled in later via edit.
  if (!CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "A valid category is required." }, { status: 400 });
  }
  if (price !== null && price !== undefined && typeof price !== "number") {
    return NextResponse.json({ error: "Price must be a number or null." }, { status: 400 });
  }
  if (!featuredImage || typeof featuredImage.url !== "string" || featuredImage.url.trim().length === 0) {
    return NextResponse.json({ error: "A featured image is required." }, { status: 400 });
  }
  if (body.order !== undefined && (!Number.isInteger(body.order) || body.order < 1)) {
    return NextResponse.json({ error: "Display order must be a positive whole number." }, { status: 400 });
  }

  const input: InventoryItemInput = {
    category,
    name: typeof name === "string" ? name.trim() : "",
    price: price ?? null,
    published: body.published !== false,
    featured: Boolean(body.featured),
    shortDescription: typeof shortDescription === "string" ? shortDescription.trim() : "",
    story: typeof story === "string" ? story.trim() : "",
    materials: typeof materials === "string" ? materials.trim() : "",
    specifications: typeof specifications === "string" ? specifications.trim() : "",
    featuredImage,
    additionalImages: Array.isArray(body.additionalImages) ? body.additionalImages : [],
    video: typeof body.video === "string" && body.video.trim().length > 0 ? body.video : null,
    order: typeof body.order === "number" ? body.order : undefined,
  };

  const item = await createInventoryItem(input);
  return NextResponse.json({ item }, { status: 201 });
}
