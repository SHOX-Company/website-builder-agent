// RootFlute Studio — event persistence.
//
// Same versioned-write scheme as testimonialStore.ts / inventoryStore.ts
// (see inventoryStore.ts's header comment for why a fixed blob URL isn't
// safe). A flat list, ordered by insertion — no sub-collections, no manual
// reordering.
//
// Server-only — never import this from a "use client" component.

import { put, list, del } from "@vercel/blob";
import type { EventItem, EventItemInput } from "@/lib/event";

const PREFIX = "data/events/";
const VERSIONS_TO_KEEP = 2;

async function readAll(): Promise<EventItem[]> {
  try {
    const { blobs } = await list({ prefix: PREFIX, limit: 20 });
    if (blobs.length === 0) return [];
    const latest = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];
    const res = await fetch(latest.url, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as EventItem[];
  } catch {
    return [];
  }
}

async function writeAll(items: EventItem[]): Promise<void> {
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

export async function getEvents(): Promise<EventItem[]> {
  return readAll();
}

export async function getPublicEvents(): Promise<EventItem[]> {
  const items = await readAll();
  return items.filter((e) => e.published);
}

export async function getEventItem(id: string): Promise<EventItem | null> {
  const items = await readAll();
  return items.find((e) => e.id === id) ?? null;
}

export async function createEvent(input: EventItemInput): Promise<EventItem> {
  const items = await readAll();
  const now = new Date().toISOString();
  const item: EventItem = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
  items.push(item);
  await writeAll(items);
  return item;
}

export async function updateEvent(id: string, patch: Partial<EventItemInput>): Promise<EventItem | null> {
  const items = await readAll();
  const index = items.findIndex((e) => e.id === id);
  if (index === -1) return null;

  const updated: EventItem = { ...items[index], ...patch, updatedAt: new Date().toISOString() };
  items[index] = updated;
  await writeAll(items);
  return updated;
}

export async function deleteEvent(id: string): Promise<boolean> {
  const items = await readAll();
  const next = items.filter((e) => e.id !== id);
  if (next.length === items.length) return false;
  await writeAll(next);
  return true;
}
