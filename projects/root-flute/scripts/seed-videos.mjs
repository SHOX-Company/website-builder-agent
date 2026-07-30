// One-time migration: seeds the Blob-backed video store with the videos
// that were previously hardcoded directly in the three video content JSON
// files (src/content/videos/*.json). Run once with
// `node scripts/seed-videos.mjs` (requires BLOB_READ_WRITE_TOKEN in the
// environment). Safe to re-run — overwrites the store (no duplicates), but
// will stomp any real edits made in Studio since this was first run, so
// treat it as a bootstrap-only tool. Does NOT touch src/content/music/
// (the Music page is out of scope for the Videos CMS).

import { put, list, del } from "@vercel/blob";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentDir = join(__dirname, "..", "src", "content", "videos");

const SOURCES = [
  { file: "rootflute-live.json", collection: "rootflute-live" },
  { file: "instruments.json", collection: "instruments" },
  { file: "lucid-meditation.json", collection: "lucid-meditation" },
];

const now = new Date().toISOString();
const items = [];

for (const { file, collection } of SOURCES) {
  const raw = JSON.parse(readFileSync(join(contentDir, file), "utf-8"));
  raw.forEach((entry, index) => {
    items.push({
      id: crypto.randomUUID(),
      collection,
      title: entry.title,
      description: "",
      thumbnail: { url: entry.thumbnail, alt: entry.title },
      videoUrl: null,
      hostedUrl: entry.youtubeUrl,
      duration: "",
      featured: false,
      published: true,
      order: index,
      createdAt: now,
      updatedAt: now,
    });
  });
}

const PREFIX = "data/videos/";

const blob = await put(`${PREFIX}${Date.now()}.json`, JSON.stringify(items, null, 2), {
  access: "public",
  contentType: "application/json",
  cacheControlMaxAge: 60,
});

const { blobs } = await list({ prefix: PREFIX, limit: 50 });
const stale = [...blobs]
  .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
  .slice(2);
if (stale.length > 0) await del(stale.map((b) => b.url));

console.log("Seeded", items.length, "videos across", SOURCES.length, "collections.");
console.log("Blob URL:", blob.url);
console.log("Pruned", stale.length, "old version(s).");
