// RootFlute Studio — inventory persistence.
//
// The inventory is a single JSON document stored in Vercel Blob (the same
// storage already provisioned for this project's media). This is a
// deliberately simple "database" — appropriate for a solo operator managing
// dozens of one-of-a-kind pieces, not thousands of concurrent SKUs.
//
// IMPORTANT: this does NOT overwrite one fixed blob URL. Vercel's public
// Blob CDN caches each URL per-edge for at least 60s (the platform minimum)
// with no reliable client-side bust — repeated overwrites of the same URL
// were observed serving stale reads unpredictably, which is unacceptable for
// "Mark Sold" (must remove the piece from the public site immediately).
// Instead every write creates a brand-new, never-before-seen blob (so its
// first read is always a guaranteed cache MISS), and reads discover the
// current one via `list()`, which hits Vercel's control-plane API rather
// than the cached CDN edge and is always fresh. Superseded versions are
// pruned after each write so storage doesn't grow unbounded.
//
// Server-only — never import this from a "use client" component.

import { put, list, del } from "@vercel/blob";
import type { InventoryCategory, InventoryItem, InventoryItemInput } from "@/lib/inventory";

const INVENTORY_PREFIX = "data/inventory/";
const VERSIONS_TO_KEEP = 2;

async function readAll(): Promise<InventoryItem[]> {
  try {
    const { blobs } = await list({ prefix: INVENTORY_PREFIX, limit: 20 });
    if (blobs.length === 0) return [];
    const latest = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];
    const res = await fetch(latest.url, { cache: "no-store" });
    if (!res.ok) return [];
    const items = (await res.json()) as InventoryItem[];
    // Items seeded before "published" existed have no such field at all —
    // normalize to a real boolean here so every consumer (Studio UI and the
    // public site alike) sees the same thing, instead of `undefined` reading
    // as falsy in some places and truthy in others.
    return items.map((item) => ({
      ...item,
      published: item.published !== false,
      stripeCheckoutSessionId: item.stripeCheckoutSessionId ?? null,
    }));
  } catch {
    return [];
  }
}

async function writeAll(items: InventoryItem[]): Promise<void> {
  await put(`${INVENTORY_PREFIX}${Date.now()}.json`, JSON.stringify(items, null, 2), {
    access: "public",
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });

  const { blobs } = await list({ prefix: INVENTORY_PREFIX, limit: 50 });
  const stale = [...blobs]
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(VERSIONS_TO_KEEP);
  if (stale.length > 0) {
    await del(stale.map((b) => b.url)).catch(() => {});
  }
}

export async function getInventory(): Promise<InventoryItem[]> {
  return readAll();
}

export async function getInventoryItem(id: string): Promise<InventoryItem | null> {
  const items = await readAll();
  return items.find((item) => item.id === id) ?? null;
}

export async function getPublicInventory(category?: InventoryCategory): Promise<InventoryItem[]> {
  const items = await readAll();
  return items
    .filter(
      (item) =>
        item.status === "available" && item.published !== false && (!category || item.category === category)
    )
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

export async function createInventoryItem(input: InventoryItemInput): Promise<InventoryItem> {
  const items = await readAll();
  const now = new Date().toISOString();
  const item: InventoryItem = {
    ...input,
    id: crypto.randomUUID(),
    status: "available",
    createdAt: now,
    updatedAt: now,
    soldAt: null,
    stripeCheckoutSessionId: null,
  };
  items.unshift(item);
  await writeAll(items);
  return item;
}

export async function deleteInventoryItem(id: string): Promise<boolean> {
  const items = await readAll();
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;
  await writeAll(next);
  return true;
}

export async function updateInventoryItem(
  id: string,
  patch: Partial<InventoryItemInput>
): Promise<InventoryItem | null> {
  const items = await readAll();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const updated: InventoryItem = {
    ...items[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  items[index] = updated;
  await writeAll(items);
  return updated;
}

export async function markInventoryItemSold(
  id: string,
  stripeCheckoutSessionId: string | null = null
): Promise<InventoryItem | null> {
  const items = await readAll();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const updated: InventoryItem = {
    ...items[index],
    status: "sold",
    soldAt: now,
    updatedAt: now,
    stripeCheckoutSessionId,
  };
  items[index] = updated;
  await writeAll(items);
  return updated;
}

/**
 * Relists a piece — whether it was Sold, soft-deleted (published: false), or
 * both — restoring it to fully live (available + published) without
 * touching anything else (images, video, story, order, metadata all
 * untouched), so it immediately reappears on the public site with zero
 * recreation.
 */
export async function relistInventoryItem(id: string): Promise<InventoryItem | null> {
  const items = await readAll();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const updated: InventoryItem = {
    ...items[index],
    status: "available",
    soldAt: null,
    published: true,
    stripeCheckoutSessionId: null,
    updatedAt: new Date().toISOString(),
  };
  items[index] = updated;
  await writeAll(items);
  return updated;
}
