import { NextRequest, NextResponse } from "next/server";
import { getInventoryItem, markInventoryItemSold } from "@/lib/inventoryStore";
import { isMadeToOrder } from "@/lib/inventory";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // A permanent made-to-order design is never consumed by a sale, so it has
  // no "Sold" state. To take one off the site, unpublish (Soft Delete) it.
  const existing = await getInventoryItem(id);
  if (existing && isMadeToOrder(existing)) {
    return NextResponse.json(
      { error: "A made-to-order design can't be marked Sold — it stays live for future orders. Use Soft Delete to retire it." },
      { status: 409 }
    );
  }

  const item = await markInventoryItemSold(id);
  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ item });
}
