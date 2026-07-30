import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.url !== "string" || body.url.trim().length === 0) {
    return NextResponse.json({ error: "A file url is required." }, { status: 400 });
  }

  await del(body.url);
  return NextResponse.json({ ok: true });
}
