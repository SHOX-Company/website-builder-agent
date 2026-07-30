import { NextRequest, NextResponse } from "next/server";
import { getVideos, getVideosByCollection, createVideo } from "@/lib/videoStore";
import { VIDEO_COLLECTIONS, type VideoCollectionId, type VideoItemInput } from "@/lib/video";

const COLLECTIONS: VideoCollectionId[] = VIDEO_COLLECTIONS.map((c) => c.id);

export async function GET(req: NextRequest) {
  const collection = req.nextUrl.searchParams.get("collection") as VideoCollectionId | null;
  const items =
    collection && COLLECTIONS.includes(collection) ? await getVideosByCollection(collection) : await getVideos();
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });

  const { collection, title, description, thumbnail, videoUrl, hostedUrl, duration } = body;

  if (!COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: "A valid collection is required." }, { status: 400 });
  }
  if (typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "Video title is required." }, { status: 400 });
  }
  if (!thumbnail || typeof thumbnail.url !== "string" || thumbnail.url.trim().length === 0) {
    return NextResponse.json({ error: "A thumbnail image is required." }, { status: 400 });
  }
  const hasVideoUrl = typeof videoUrl === "string" && videoUrl.trim().length > 0;
  const hasHostedUrl = typeof hostedUrl === "string" && hostedUrl.trim().length > 0;
  if (!hasVideoUrl && !hasHostedUrl) {
    return NextResponse.json({ error: "Upload a video or provide a hosted video URL." }, { status: 400 });
  }

  const existing = await getVideosByCollection(collection);
  const order =
    typeof body.order === "number" ? body.order : existing.length === 0 ? 0 : existing[existing.length - 1].order + 1;

  const input: VideoItemInput = {
    collection,
    title: title.trim(),
    description: typeof description === "string" ? description.trim() : "",
    thumbnail,
    videoUrl: hasVideoUrl ? videoUrl : null,
    hostedUrl: hasHostedUrl ? hostedUrl : null,
    duration: typeof duration === "string" ? duration.trim() : "",
    featured: Boolean(body.featured),
    published: body.published !== false,
    order,
  };

  const item = await createVideo(input);
  return NextResponse.json({ item }, { status: 201 });
}
