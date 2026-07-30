import { NextResponse } from "next/server";
import { getMediaAssets } from "@/lib/media";

export async function GET() {
  const items = await getMediaAssets();
  return NextResponse.json({ items });
}
