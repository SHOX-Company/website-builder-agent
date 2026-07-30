// One-time migration: seeds the Blob-backed testimonial store with the
// testimonials that were previously hardcoded in
// src/content/testimonials/testimonials.json. Run once with
// `node --env-file=.env.local scripts/seed-testimonials.mjs`. Safe to
// re-run, but will stomp any real testimonial edits made in Studio since
// this was first run, so treat it as a bootstrap-only tool.

import { put, list, del } from "@vercel/blob";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const copy = JSON.parse(readFileSync(join(root, "src/content/testimonials/testimonials.json"), "utf-8"));

const now = new Date().toISOString();

const items = copy.testimonials.map((t) => ({
  id: crypto.randomUUID(),
  quote: t.quote,
  author: t.author,
  location: t.location,
  published: true,
  createdAt: now,
  updatedAt: now,
}));

const PREFIX = "data/testimonials/";
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

console.log("Seeded", items.length, "testimonials.");
console.log("Blob URL:", blob.url);
console.log("Pruned", stale.length, "old version(s).");
