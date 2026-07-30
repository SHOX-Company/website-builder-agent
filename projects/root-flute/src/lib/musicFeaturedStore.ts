// RootFlute Studio — Music-featured cross-reference persistence.
//
// Same versioned-write scheme as videoStore.ts / materialStore.ts (see
// inventoryStore.ts's header comment for why a fixed blob URL isn't safe).
// This document is a singleton — an ordered list of video IDs — resolved
// against the shared Video library (videoStore.ts) on every read, so there
// is exactly one source of truth for video content.
//
// Server-only — never import this from a "use client" component.

import { put, list, del } from "@vercel/blob";
import { DEFAULT_MUSIC_FEATURED, type MusicFeaturedContent } from "@/lib/musicFeatured";
import { getVideos } from "@/lib/videoStore";
import type { VideoItem } from "@/lib/video";

const PREFIX = "data/music-featured/";
const VERSIONS_TO_KEEP = 2;

async function getMusicFeatured(): Promise<MusicFeaturedContent> {
  try {
    const { blobs } = await list({ prefix: PREFIX, limit: 20 });
    if (blobs.length === 0) return DEFAULT_MUSIC_FEATURED;
    const latest = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];
    const res = await fetch(latest.url, { cache: "no-store" });
    if (!res.ok) return DEFAULT_MUSIC_FEATURED;
    return (await res.json()) as MusicFeaturedContent;
  } catch {
    return DEFAULT_MUSIC_FEATURED;
  }
}

async function saveMusicFeatured(content: MusicFeaturedContent): Promise<MusicFeaturedContent> {
  await put(`${PREFIX}${Date.now()}.json`, JSON.stringify(content, null, 2), {
    access: "public",
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });

  const { blobs } = await list({ prefix: PREFIX, limit: 50 });
  const stale = [...blobs]
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(VERSIONS_TO_KEEP);
  if (stale.length > 0) {
    await del(stale.map((b) => b.url)).catch(() => {});
  }

  return content;
}

/** Resolves the ordered ID list against the live Video library, dropping any ID that no longer exists. */
export async function getMusicFeaturedVideos(): Promise<VideoItem[]> {
  const [{ videoIds }, allVideos] = await Promise.all([getMusicFeatured(), getVideos()]);
  const byId = new Map(allVideos.map((v) => [v.id, v]));
  return videoIds.map((id) => byId.get(id)).filter((v): v is VideoItem => Boolean(v));
}

/** Same as getMusicFeaturedVideos, filtered to what's actually published — used by the public Music page. */
export async function getPublicMusicFeaturedVideos(): Promise<VideoItem[]> {
  const videos = await getMusicFeaturedVideos();
  return videos.filter((v) => v.published);
}

export async function addMusicFeaturedVideo(id: string): Promise<VideoItem[]> {
  const current = await getMusicFeatured();
  if (!current.videoIds.includes(id)) {
    await saveMusicFeatured({ videoIds: [...current.videoIds, id], updatedAt: new Date().toISOString() });
  }
  return getMusicFeaturedVideos();
}

/**
 * Removes a video's id from the Music reference list only — used as a
 * cleanup step when the underlying video record is permanently deleted
 * (see the video DELETE route), so no stale id lingers in this list.
 * Never deletes the video itself; that's videoStore.ts's job.
 */
export async function unfeatureFromMusic(id: string): Promise<void> {
  const current = await getMusicFeatured();
  if (!current.videoIds.includes(id)) return;
  await saveMusicFeatured({
    videoIds: current.videoIds.filter((v) => v !== id),
    updatedAt: new Date().toISOString(),
  });
}
