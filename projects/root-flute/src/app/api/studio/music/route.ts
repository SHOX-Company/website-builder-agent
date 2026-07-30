import { NextRequest, NextResponse } from "next/server";
import { getMusicFeaturedVideos, addMusicFeaturedVideo } from "@/lib/musicFeaturedStore";

export async function GET() {
  const items = await getMusicFeaturedVideos();
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.id !== "string" || body.id.trim().length === 0) {
    return NextResponse.json({ error: "A video id is required." }, { status: 400 });
  }

  const items = await addMusicFeaturedVideo(body.id);
  return NextResponse.json({ items });
}
