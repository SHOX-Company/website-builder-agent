// RootFlute Studio — Contact page persistence.
//
// Same versioned-write scheme as materialStore.ts / aboutPageStore.ts (see
// inventoryStore.ts's header comment for why a fixed blob URL isn't safe).
// This document is a singleton — there's exactly one Contact page — so
// unlike a collection store this has no id-based CRUD, just get/update.
//
// Server-only — never import this from a "use client" component.

import { put, list, del } from "@vercel/blob";
import { DEFAULT_CONTACT_PAGE, type ContactPageContent } from "@/lib/contactPage";

const PREFIX = "data/contact-page/";
const VERSIONS_TO_KEEP = 2;

export async function getContactPage(): Promise<ContactPageContent> {
  try {
    const { blobs } = await list({ prefix: PREFIX, limit: 20 });
    if (blobs.length === 0) return DEFAULT_CONTACT_PAGE;
    const latest = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];
    const res = await fetch(latest.url, { cache: "no-store" });
    if (!res.ok) return DEFAULT_CONTACT_PAGE;
    return (await res.json()) as ContactPageContent;
  } catch {
    return DEFAULT_CONTACT_PAGE;
  }
}

export async function saveContactPage(content: ContactPageContent): Promise<ContactPageContent> {
  await put(`${PREFIX}${Date.now()}.json`, JSON.stringify(content, null, 2), {
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

  return content;
}

export async function updateContactPage(patch: Partial<ContactPageContent>): Promise<ContactPageContent> {
  const current = await getContactPage();
  const next: ContactPageContent = { ...current, ...patch, updatedAt: new Date().toISOString() };
  return saveContactPage(next);
}
