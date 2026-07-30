// RootFlute Studio — video persistence.
//
// Same versioned-write scheme as src/lib/inventoryStore.ts (see that file's
// header comment for why): every write creates a brand-new, never-before-
// cached blob, and reads discover the current one via `list()`, which hits
// Vercel's control-plane API rather than the CDN-cached edge and is always
// fresh. Superseded versions are pruned after each write.
//
// Server-only — never import this from a "use client" component.

import { put, list, del } from "@vercel/blob";
import type { VideoCollectionId, VideoItem, VideoItemInput } from "@/lib/video";

const VIDEOS_PREFIX = "data/videos/";
const VERSIONS_TO_KEEP = 2;

async function readAll(): Promise<VideoItem[]> {
  try {
    const { blobs } = await list({ prefix: VIDEOS_PREFIX, limit: 20 });
    if (blobs.length === 0) return [];
    const latest = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];
    const res = await fetch(latest.url, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as VideoItem[];
  } catch {
    return [];
  }
}

async function writeAll(items: VideoItem[]): Promise<void> {
  await put(`${VIDEOS_PREFIX}${Date.now()}.json`, JSON.stringify(items, null, 2), {
    access: "public",
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });

  const { blobs } = await list({ prefix: VIDEOS_PREFIX, limit: 50 });
  const stale = [...blobs]
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(VERSIONS_TO_KEEP);
  if (stale.length > 0) {
    await del(stale.map((b) => b.url)).catch(() => {});
  }
}

export async function getVideos(): Promise<VideoItem[]> {
  return readAll();
}

export async function getVideosByCollection(collection: VideoCollectionId): Promise<VideoItem[]> {
  const items = await readAll();
  return items.filter((v) => v.collection === collection).sort((a, b) => a.order - b.order);
}

export async function getPublicVideos(collection: VideoCollectionId): Promise<VideoItem[]> {
  const items = await getVideosByCollection(collection);
  return items.filter((v) => v.published);
}

export async function getVideoItem(id: string): Promise<VideoItem | null> {
  const items = await readAll();
  return items.find((v) => v.id === id) ?? null;
}

export async function createVideo(input: VideoItemInput): Promise<VideoItem> {
  const items = await readAll();
  const now = new Date().toISOString();
  const item: VideoItem = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
  items.push(item);
  await writeAll(items);
  return item;
}

export async function updateVideo(id: string, patch: Partial<VideoItemInput>): Promise<VideoItem | null> {
  const items = await readAll();
  const index = items.findIndex((v) => v.id === id);
  if (index === -1) return null;

  const updated: VideoItem = { ...items[index], ...patch, updatedAt: new Date().toISOString() };
  items[index] = updated;
  await writeAll(items);
  return updated;
}

export async function deleteVideo(id: string): Promise<boolean> {
  const items = await readAll();
  const next = items.filter((v) => v.id !== id);
  if (next.length === items.length) return false;
  await writeAll(next);
  return true;
}
