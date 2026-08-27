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

// An item only occupies a slot in its category's Display Order sequence
// while it's actually visible on the public site.
function isActive(item: InventoryItem): boolean {
  return item.status === "available" && item.published !== false;
}

// Guarantees every active item has a valid, gapless, 1-based Display Order
// within its category — self-healing on every read regardless of what's
// actually persisted. This is what lets legacy items (created before this
// field existed) and not-yet-reordered categories (Flutes, Instruments)
// "just work": items missing an explicit order fall back to the site's
// original sort (featured first, then newest), so nothing visually changes
// until someone actually reorders that category for the first time. Once a
// category is reordered, real values get persisted via `writeAll` and this
// becomes a no-op for it.
function normalizeOrders(items: InventoryItem[]): InventoryItem[] {
  const byCategory = new Map<InventoryCategory, InventoryItem[]>();
  for (const item of items) {
    if (!isActive(item)) continue;
    const peers = byCategory.get(item.category) ?? [];
    peers.push(item);
    byCategory.set(item.category, peers);
  }

  const resolvedOrder = new Map<string, number>();
  for (const peers of byCategory.values()) {
    const sorted = [...peers].sort((a, b) => {
      const aHas = typeof a.order === "number";
      const bHas = typeof b.order === "number";
      if (aHas && bHas) return a.order - b.order;
      if (aHas !== bHas) return aHas ? -1 : 1;
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    sorted.forEach((item, i) => resolvedOrder.set(item.id, i + 1));
  }

  return items.map((item) => (resolvedOrder.has(item.id) ? { ...item, order: resolvedOrder.get(item.id)! } : item));
}

// Moves `targetId` to `newOrder` (1-based) among its category's active
// items, renumbering everyone else in that category to keep the sequence
// gapless and unique. Category-agnostic by design — this is the one
// function any future category's reordering UI needs to call.
function reorderWithinCategory(items: InventoryItem[], targetId: string, newOrder: number): InventoryItem[] {
  const target = items.find((item) => item.id === targetId);
  if (!target) return items;

  const peers = items
    .filter((item) => isActive(item) && item.category === target.category && item.id !== targetId)
    .sort((a, b) => a.order - b.order);

  const clamped = Math.max(1, Math.min(newOrder, peers.length + 1));
  peers.splice(clamped - 1, 0, target);

  const resolvedOrder = new Map<string, number>();
  peers.forEach((item, i) => resolvedOrder.set(item.id, i + 1));

  return items.map((item) => (resolvedOrder.has(item.id) ? { ...item, order: resolvedOrder.get(item.id)! } : item));
}

async function readAllRaw(): Promise<InventoryItem[]> {
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

async function readAll(): Promise<InventoryItem[]> {
  return normalizeOrders(await readAllRaw());
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
    .filter((item) => isActive(item) && (!category || item.category === category))
    .sort((a, b) => a.order - b.order);
}

export async function createInventoryItem(input: InventoryItemInput): Promise<InventoryItem> {
  const items = await readAll();
  const now = new Date().toISOString();
  const { order: requestedOrder, ...rest } = input;
  const draft: InventoryItem = {
    ...rest,
    id: crypto.randomUUID(),
    status: "available",
    order: 0,
    createdAt: now,
    updatedAt: now,
    soldAt: null,
    stripeCheckoutSessionId: null,
  };

  let nextItems: InventoryItem[];
  if (isActive(draft)) {
    const activePeers = items.filter((item) => isActive(item) && item.category === draft.category).length;
    const targetOrder = typeof requestedOrder === "number" ? requestedOrder : activePeers + 1;
    nextItems = reorderWithinCategory([draft, ...items], draft.id, targetOrder);
  } else {
    nextItems = [draft, ...items];
  }

  await writeAll(nextItems);
  return nextItems.find((item) => item.id === draft.id)!;
}

export async function deleteInventoryItem(id: string): Promise<boolean> {
  const items = await readAll();
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;
  // Closes the gap left behind in the deleted item's category, if it was active.
  await writeAll(normalizeOrders(next));
  return true;
}

export async function updateInventoryItem(
  id: string,
  patch: Partial<InventoryItemInput>
): Promise<InventoryItem | null> {
  const items = await readAll();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const current = items[index];
  const { order: requestedOrder, ...restPatch } = patch;
  const updatedTarget: InventoryItem = { ...current, ...restPatch, updatedAt: new Date().toISOString() };
  const itemsWithTarget = items.map((item, i) => (i === index ? updatedTarget : item));

  const wasActive = isActive(current);
  const stillActive = isActive(updatedTarget);
  const categoryChanged = restPatch.category !== undefined && restPatch.category !== current.category;
  const orderChanged = typeof requestedOrder === "number" && requestedOrder !== current.order;

  let nextItems: InventoryItem[];
  if (stillActive && (categoryChanged || !wasActive || orderChanged)) {
    const activePeers = itemsWithTarget.filter(
      (item) => isActive(item) && item.category === updatedTarget.category && item.id !== id
    ).length;
    const targetOrder = orderChanged ? requestedOrder! : activePeers + 1;
    nextItems = reorderWithinCategory(itemsWithTarget, id, targetOrder);
  } else if (!stillActive && wasActive) {
    // Left the active set (unpublished or marked sold via a direct patch) —
    // close the gap it left behind in its old category.
    nextItems = normalizeOrders(itemsWithTarget);
  } else {
    nextItems = itemsWithTarget;
  }

  await writeAll(nextItems);
  return nextItems.find((item) => item.id === id) ?? updatedTarget;
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
  const nextItems = items.map((item, i) => (i === index ? updated : item));
  // Closes the gap the sold item leaves behind among its category's actives.
  await writeAll(normalizeOrders(nextItems));
  return updated;
}

/**
 * Relists a piece — whether it was Sold, soft-deleted (published: false), or
 * both — restoring it to fully live (available + published) without
 * touching anything else (images, video, story, metadata all untouched), so
 * it immediately reappears on the public site with zero recreation. It
 * re-enters its category's Display Order sequence at the end.
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
  const itemsWithTarget = items.map((item, i) => (i === index ? updated : item));
  const activePeers = itemsWithTarget.filter(
    (item) => isActive(item) && item.category === updated.category && item.id !== id
  ).length;
  const nextItems = reorderWithinCategory(itemsWithTarget, id, activePeers + 1);

  await writeAll(nextItems);
  return nextItems.find((item) => item.id === id) ?? updated;
}
