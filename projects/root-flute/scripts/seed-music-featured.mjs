// One-time bootstrap for the Music-featured cross-reference document.
// Cross-references the old static src/content/music/music-videos.json
// against the videos already migrated into the Video library
// (scripts/seed-videos.mjs) by YouTube ID, and seeds videoIds with whichever
// ones already exist there — never duplicating or moving video data, just
// recording which existing videos are featured on Music.
// Run with `node --env-file=.env.local scripts/seed-music-featured.mjs`.
// Safe to re-run — it overwrites the same document, but will stomp any real
// featuring/reordering done in Studio since this was first run.

import { put, list, del } from "@vercel/blob";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const musicVideos = JSON.parse(
  readFileSync(join(root, "src/content/music/music-videos.json"), "utf-8")
);

// Read the current Video library the same way videoStore.ts does.
const VIDEOS_PREFIX = "data/videos/";
const { blobs: videoBlobs } = await list({ prefix: VIDEOS_PREFIX, limit: 20 });
let libraryVideos = [];
if (videoBlobs.length > 0) {
  const latest = [...videoBlobs].sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  )[0];
  libraryVideos = await fetch(latest.url).then((r) => r.json());
}

const byYouTubeId = new Map();
for (const v of libraryVideos) {
  const match = v.hostedUrl?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (match) byYouTubeId.set(match[1], v.id);
}

const videoIds = musicVideos.map((entry) => byYouTubeId.get(entry.videoId)).filter(Boolean);

console.log(`Matched ${videoIds.length} of ${musicVideos.length} music-videos.json entries to the Video library.`);

const content = { videoIds, updatedAt: new Date().toISOString() };

const PREFIX = "data/music-featured/";
const blob = await put(`${PREFIX}${Date.now()}.json`, JSON.stringify(content, null, 2), {
  access: "public",
  contentType: "application/json",
  cacheControlMaxAge: 60,
});

const { blobs } = await list({ prefix: PREFIX, limit: 50 });
const stale = [...blobs]
  .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
  .slice(2);
if (stale.length > 0) await del(stale.map((b) => b.url));

console.log("Seeded Music-featured content.");
console.log("Blob URL:", blob.url);
console.log("Pruned", stale.length, "old version(s).");
