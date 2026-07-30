import { NextRequest, NextResponse } from "next/server";
import { markInventoryItemSold } from "@/lib/inventoryStore";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await markInventoryItemSold(id);
  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ item });
}
