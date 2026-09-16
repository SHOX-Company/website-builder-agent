// RootFlute — completed-purchase order persistence.
//
// Same versioned-write scheme as leadStore.ts / testimonialStore.ts (see
// inventoryStore.ts's header comment for why a fixed blob URL isn't safe):
// every write creates a brand-new timestamped blob and reads discover the
// current one via `list()`. Superseded versions are pruned after each write;
// the latest blob always holds the full order list.
//
// This store exists so the post-purchase customer email has a durable,
// retry-safe delivery-state record — the "item is Sold" flag alone is not a
// sufficient email-dedup mechanism. It never has transaction authority.
//
// Server-only — never import this from a "use client" component.

import { put, list, del } from "@vercel/blob";
import type { Order, OrderInput } from "@/lib/order";

const PREFIX = "data/orders/";
const VERSIONS_TO_KEEP = 2;

async function readAll(): Promise<Order[]> {
  try {
    const { blobs } = await list({ prefix: PREFIX, limit: 20 });
    if (blobs.length === 0) return [];
    const latest = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];
    const res = await fetch(latest.url, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as Order[];
  } catch {
    return [];
  }
}

async function writeAll(items: Order[]): Promise<void> {
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

export async function getOrders(): Promise<Order[]> {
  return readAll();
}

export async function getOrderBySession(sessionId: string): Promise<Order | null> {
  const orders = await readAll();
  return orders.find((o) => o.stripeCheckoutSessionId === sessionId) ?? null;
}

/**
 * Idempotent create-or-fetch, keyed by Stripe Checkout Session ID. A webhook
 * retry for the same session returns the existing record untouched (so its
 * `confirmationEmailSent` flag and timestamps are preserved), never a
 * duplicate.
 */
export async function ensureOrder(input: OrderInput): Promise<Order> {
  const orders = await readAll();
  const existing = orders.find(
    (o) => o.stripeCheckoutSessionId === input.stripeCheckoutSessionId
  );
  if (existing) return existing;

  const now = new Date().toISOString();
  const order: Order = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    confirmationEmailSent: false,
    confirmationEmailSentAt: null,
    internalNotificationSent: false,
    internalNotificationSentAt: null,
  };
  orders.push(order);
  await writeAll(orders);
  return order;
}

/**
 * Marks whichever notification(s) actually succeeded for this session in a
 * single read-modify-write. A no-op per-flag if the order is missing or that
 * flag is already set — safe to call on retries.
 *
 * Deliberately one combined write rather than two separate ones: this store
 * discovers "the current record" via `list()` (see the header comment on
 * this file's versioned-blob scheme), and two independent writeAll() calls
 * issued back-to-back for the *same* order — e.g. one right after the
 * customer confirmation succeeds, another moments later when the internal
 * notification succeeds — can race against that listing's consistency
 * window, with the second write silently reading a not-yet-updated "latest"
 * blob and clobbering the first write's flag. Collapsing both flag updates
 * into one write removes that window entirely for this call site.
 */
export async function markOrderNotificationsSent(
  sessionId: string,
  updates: { confirmationEmailSent?: boolean; internalNotificationSent?: boolean }
): Promise<void> {
  const orders = await readAll();
  const index = orders.findIndex((o) => o.stripeCheckoutSessionId === sessionId);
  if (index === -1) return;

  const current = orders[index];
  const now = new Date().toISOString();
  const next = { ...current };
  let changed = false;

  if (updates.confirmationEmailSent && !current.confirmationEmailSent) {
    next.confirmationEmailSent = true;
    next.confirmationEmailSentAt = now;
    changed = true;
  }
  if (updates.internalNotificationSent && !current.internalNotificationSent) {
    next.internalNotificationSent = true;
    next.internalNotificationSentAt = now;
    changed = true;
  }

  if (!changed) return;
  orders[index] = next;
  await writeAll(orders);
}
