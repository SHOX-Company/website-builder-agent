import { NextRequest, NextResponse } from "next/server";
import { getVideoItem, updateVideo, deleteVideo } from "@/lib/videoStore";
import { unfeatureFromMusic } from "@/lib/musicFeaturedStore";
import type { VideoItemInput } from "@/lib/video";

const PATCHABLE_KEYS: (keyof VideoItemInput)[] = [
  "collection",
  "title",
  "description",
  "thumbnail",
  "videoUrl",
  "hostedUrl",
  "duration",
  "featured",
  "published",
  "order",
];

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getVideoItem(id);
  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });

  if (typeof body.title === "string" && body.title.trim().length === 0) {
    return NextResponse.json({ error: "Video title cannot be empty." }, { status: 400 });
  }
  if (
    body.thumbnail !== undefined &&
    (!body.thumbnail || typeof body.thumbnail.url !== "string" || body.thumbnail.url.trim().length === 0)
  ) {
    return NextResponse.json({ error: "A thumbnail image is required." }, { status: 400 });
  }

  const patch: Partial<VideoItemInput> = {};
  for (const key of PATCHABLE_KEYS) {
    if (key in body) {
      patch[key] = body[key];
    }
  }
  if (typeof patch.title === "string") patch.title = patch.title.trim();

  const item = await updateVideo(id, patch);
  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ item });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = await deleteVideo(id);
  if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
  await unfeatureFromMusic(id);
  return NextResponse.json({ ok: true });
}
