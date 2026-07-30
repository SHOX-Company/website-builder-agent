// RootFlute Studio — Materials Statement persistence.
//
// Same versioned-write scheme as inventoryStore.ts / videoStore.ts (see that
// file's header comment for why a fixed blob URL isn't safe). This document
// is a singleton — there's exactly one Materials Statement — so unlike a
// collection store this has no id-based CRUD, just get/update.
//
// Server-only — never import this from a "use client" component.

import { put, list, del } from "@vercel/blob";
import { DEFAULT_MATERIALS_STATEMENT, type MaterialsStatementContent } from "@/lib/material";

const PREFIX = "data/materials-statement/";
const VERSIONS_TO_KEEP = 2;

export async function getMaterialsStatement(): Promise<MaterialsStatementContent> {
  try {
    const { blobs } = await list({ prefix: PREFIX, limit: 20 });
    if (blobs.length === 0) return DEFAULT_MATERIALS_STATEMENT;
    const latest = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];
    const res = await fetch(latest.url, { cache: "no-store" });
    if (!res.ok) return DEFAULT_MATERIALS_STATEMENT;
    return (await res.json()) as MaterialsStatementContent;
  } catch {
    return DEFAULT_MATERIALS_STATEMENT;
  }
}

export async function saveMaterialsStatement(
  content: MaterialsStatementContent
): Promise<MaterialsStatementContent> {
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

export async function updateMaterialsStatement(statement: string): Promise<MaterialsStatementContent> {
  const next: MaterialsStatementContent = { statement, updatedAt: new Date().toISOString() };
  return saveMaterialsStatement(next);
}
