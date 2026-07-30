import { NextRequest, NextResponse } from "next/server";
import { relistInventoryItem } from "@/lib/inventoryStore";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await relistInventoryItem(id);
  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ item });
}
