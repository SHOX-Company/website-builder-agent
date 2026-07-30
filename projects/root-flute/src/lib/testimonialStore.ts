// RootFlute Studio — testimonial persistence.
//
// Same versioned-write scheme as inventoryStore.ts / videoStore.ts (see that
// file's header comment for why a fixed blob URL isn't safe). A flat list,
// ordered by insertion — no sub-collections, no manual reordering.
//
// Server-only — never import this from a "use client" component.

import { put, list, del } from "@vercel/blob";
import type { TestimonialItem, TestimonialItemInput } from "@/lib/testimonial";

const PREFIX = "data/testimonials/";
const VERSIONS_TO_KEEP = 2;

async function readAll(): Promise<TestimonialItem[]> {
  try {
    const { blobs } = await list({ prefix: PREFIX, limit: 20 });
    if (blobs.length === 0) return [];
    const latest = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];
    const res = await fetch(latest.url, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as TestimonialItem[];
  } catch {
    return [];
  }
}

async function writeAll(items: TestimonialItem[]): Promise<void> {
  await put(`${PREFIX}${Date.now()}.json`, JSON.stringify(items, null, 2), {
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
}

export async function getTestimonials(): Promise<TestimonialItem[]> {
  return readAll();
}

export async function getPublicTestimonials(): Promise<TestimonialItem[]> {
  const items = await readAll();
  return items.filter((t) => t.published);
}

export async function getTestimonialItem(id: string): Promise<TestimonialItem | null> {
  const items = await readAll();
  return items.find((t) => t.id === id) ?? null;
}

export async function createTestimonial(input: TestimonialItemInput): Promise<TestimonialItem> {
  const items = await readAll();
  const now = new Date().toISOString();
  const item: TestimonialItem = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
  items.push(item);
  await writeAll(items);
  return item;
}

export async function updateTestimonial(
  id: string,
  patch: Partial<TestimonialItemInput>
): Promise<TestimonialItem | null> {
  const items = await readAll();
  const index = items.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const updated: TestimonialItem = { ...items[index], ...patch, updatedAt: new Date().toISOString() };
  items[index] = updated;
  await writeAll(items);
  return updated;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const items = await readAll();
  const next = items.filter((t) => t.id !== id);
  if (next.length === items.length) return false;
  await writeAll(next);
  return true;
}
