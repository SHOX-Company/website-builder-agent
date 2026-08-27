// RootFlute — inquiry lead persistence.
//
// Same versioned-write scheme as testimonialStore.ts / inventoryStore.ts (see
// inventoryStore.ts's header comment for why a fixed blob URL isn't safe). A
// flat list, ordered by insertion. This exists purely as a durable backup of
// every inquiry-form submission: written before the notification email is
// attempted, so a Resend outage or misconfiguration never silently loses a
// lead — the email is a notification, this store is the record of truth.
//
// Server-only — never import this from a "use client" component.

import { put, list, del } from "@vercel/blob";
import type { Lead, LeadInput } from "@/lib/lead";

const PREFIX = "data/leads/";
const VERSIONS_TO_KEEP = 2;

async function readAll(): Promise<Lead[]> {
  try {
    const { blobs } = await list({ prefix: PREFIX, limit: 20 });
    if (blobs.length === 0) return [];
    const latest = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];
    const res = await fetch(latest.url, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as Lead[];
  } catch {
    return [];
  }
}

async function writeAll(items: Lead[]): Promise<void> {
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

export async function getLeads(): Promise<Lead[]> {
  return readAll();
}

export async function saveLead(input: LeadInput): Promise<Lead> {
  const items = await readAll();
  const item: Lead = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  items.push(item);
  await writeAll(items);
  return item;
}
