// RootFlute Studio — Media Library listing.
//
// Never its own storage: every Studio upload (Inventory, Videos, Materials,
// About, Tickets, ...) goes through the same client-direct uploader at the
// same "inventory/" Blob prefix (see InventoryMediaUploader.tsx), so
// listing that one prefix surfaces every asset uploaded anywhere in Studio,
// with zero duplicate storage.
//
// Server-only — never import this from a "use client" component.

import { list } from "@vercel/blob";

const PREFIX = "inventory/";
const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;
const VIDEO_EXT = /\.(mp4|mov|webm)$/i;

export interface MediaAsset {
  url: string;
  pathname: string;
  filename: string;
  size: number;
  uploadedAt: string;
  type: "image" | "video";
}

export async function getMediaAssets(): Promise<MediaAsset[]> {
  const { blobs } = await list({ prefix: PREFIX, limit: 1000 });

  return blobs
    .map((b) => {
      const type: MediaAsset["type"] | null = VIDEO_EXT.test(b.pathname)
        ? "video"
        : IMAGE_EXT.test(b.pathname)
          ? "image"
          : null;
      return type
        ? {
            url: b.url,
            pathname: b.pathname,
            filename: b.pathname.split("/").pop() ?? b.pathname,
            size: b.size,
            uploadedAt: new Date(b.uploadedAt).toISOString(),
            type,
          }
        : null;
    })
    .filter((i): i is MediaAsset => i !== null)
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}
