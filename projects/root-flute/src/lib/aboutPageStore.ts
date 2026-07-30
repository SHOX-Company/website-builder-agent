// RootFlute Studio — About page persistence.
//
// Same versioned-write scheme as materialStore.ts (see inventoryStore.ts's
// header comment for why a fixed blob URL isn't safe). This document is a
// singleton — there's exactly one About page — so unlike a collection store
// this has no id-based CRUD, just get/update.
//
// Server-only — never import this from a "use client" component.

import { put, list, del } from "@vercel/blob";
import { DEFAULT_ABOUT_PAGE, type AboutPageContent } from "@/lib/aboutPage";

const PREFIX = "data/about-page/";
const VERSIONS_TO_KEEP = 2;

export async function getAboutPage(): Promise<AboutPageContent> {
  try {
    const { blobs } = await list({ prefix: PREFIX, limit: 20 });
    if (blobs.length === 0) return DEFAULT_ABOUT_PAGE;
    const latest = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];
    const res = await fetch(latest.url, { cache: "no-store" });
    if (!res.ok) return DEFAULT_ABOUT_PAGE;
    return (await res.json()) as AboutPageContent;
  } catch {
    return DEFAULT_ABOUT_PAGE;
  }
}

export async function saveAboutPage(content: AboutPageContent): Promise<AboutPageContent> {
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

export async function updateAboutPage(patch: Partial<AboutPageContent>): Promise<AboutPageContent> {
  const current = await getAboutPage();
  const next: AboutPageContent = { ...current, ...patch, updatedAt: new Date().toISOString() };
  return saveAboutPage(next);
}
