// One-time bootstrap for the Music page document. Cross-references the old
// static src/content/music/music-videos.json against the videos already
// migrated into the Video library (scripts/seed-videos.mjs) by YouTube ID,
// and seeds featuredVideoIds with whichever ones already exist there —
// preserving "one source of truth" rather than duplicating video data.
// Videos with no match in the library are skipped (Daniel can add them to a
// collection in Studio, then feature them here). Safe to re-run, but will
// overwrite any real edits made in Studio since this was first run.

import { put, list, del } from "@vercel/blob";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const musicVideos = JSON.parse(
  readFileSync(join(root, "src/content/music/music-videos.json"), "utf-8")
);
const musicCopy = JSON.parse(readFileSync(join(root, "src/content/music/music-copy.json"), "utf-8"));

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

const featuredVideoIds = musicVideos
  .map((entry) => byYouTubeId.get(entry.videoId))
  .filter(Boolean);

console.log(
  `Matched ${featuredVideoIds.length} of ${musicVideos.length} music-videos.json entries to the Video library.`
);

const content = {
  hero: {
    image: null,
    headline: "Music",
    supportingCopy: musicCopy.intro ?? "",
  },
  featuredVideoIds,
  spotify: {
    url: musicCopy.spotifyLink?.url ?? "",
    heading: "Listen on Spotify",
    supportingCopy: "Stream RootFlute's sound meditation album.",
  },
  cta: {
    headline: "Bring This Sound Into Your Space",
    supportingCopy: "See upcoming sound journeys, lucid meditations, and live looping performances.",
    buttonText: "See Upcoming Events",
    buttonHref: "/tickets",
  },
  seo: {
    title: "",
    description: "",
    ogImage: null,
  },
  updatedAt: new Date().toISOString(),
};

const PREFIX = "data/music-page/";
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

console.log("Seeded Music page content.");
console.log("Blob URL:", blob.url);
console.log("Pruned", stale.length, "old version(s).");
