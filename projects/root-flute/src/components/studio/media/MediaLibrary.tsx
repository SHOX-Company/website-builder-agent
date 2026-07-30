"use client";

import { useState } from "react";
import { Upload, Images as ImagesIcon, X } from "lucide-react";
import type { MediaAsset } from "@/lib/media";
import PageHeader from "@/components/studio/ui/PageHeader";
import Card from "@/components/studio/ui/Card";
import EmptyState from "@/components/studio/ui/EmptyState";
import StudioButton from "@/components/studio/ui/Button";
import Modal from "@/components/studio/ui/Modal";
import MediaAssetCard from "@/components/studio/media/MediaAssetCard";
import { GenericMediaUploader } from "@/components/studio/inventory/InventoryMediaUploader";

type Filter = "all" | "image" | "video";

export default function MediaLibrary({ initialAssets }: { initialAssets: MediaAsset[] }) {
  const [assets, setAssets] = useState<MediaAsset[]>(initialAssets);
  const [filter, setFilter] = useState<Filter>("all");

  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const filtered = assets.filter((a) => filter === "all" || a.type === filter);

  async function refreshAssets() {
    const res = await fetch("/api/studio/media");
    const data = await res.json().catch(() => null);
    if (res.ok && data?.items) {
      setAssets(data.items as MediaAsset[]);
    }
  }

  function handleUploaded() {
    refreshAssets();
  }

  function handleCopy(asset: MediaAsset) {
    navigator.clipboard.writeText(asset.url).then(() => {
      setCopiedUrl(asset.url);
      setTimeout(() => setCopiedUrl((current) => (current === asset.url ? null : current)), 1500);
    });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/studio/media/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: deleteTarget.url }),
      });
      if (res.ok) {
        setAssets((prev) => prev.filter((a) => a.url !== deleteTarget.url));
      }
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  const FILTERS: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "image", label: "Images" },
    { id: "video", label: "Videos" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Media Library"
        title="Media Library"
        description="Every asset uploaded throughout Studio, in one place."
        actions={
          <StudioButton onClick={() => setUploadOpen(true)} size="lg">
            <Upload className="w-4 h-4" strokeWidth={2} /> Upload Media
          </StudioButton>
        }
      />

      <div className="flex items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`px-3.5 py-2 rounded-md text-xs font-sans border transition-colors duration-150 ${
              filter === f.id
                ? "bg-brand-gold/10 border-brand-gold text-brand-gold"
                : "border-brand-border text-brand-muted hover:text-brand-text"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card padding="none">
          <EmptyState
            icon={ImagesIcon}
            title="No media yet"
            description="Upload the first photo or video to see it appear here — every future upload throughout Studio will show up automatically."
          >
            <StudioButton onClick={() => setUploadOpen(true)} className="mt-2">
              <Upload className="w-4 h-4" strokeWidth={2} /> Upload Media
            </StudioButton>
          </EmptyState>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((asset) => (
            <MediaAssetCard
              key={asset.url}
              asset={asset}
              copied={copiedUrl === asset.url}
              onPreview={() => setPreviewAsset(asset)}
              onCopy={() => handleCopy(asset)}
              onDelete={() => setDeleteTarget(asset)}
            />
          ))}
        </div>
      )}

      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Media">
        <GenericMediaUploader onUploaded={handleUploaded} />
      </Modal>

      {previewAsset && (
        <div
          className="fixed inset-0 z-[110] flex flex-col bg-brand-dark"
          role="dialog"
          aria-modal="true"
          aria-label="Preview"
        >
          <div className="relative z-[100] flex items-center justify-between gap-4 h-14 px-4 sm:px-6 border-b border-brand-border bg-brand-surface flex-shrink-0">
            <span className="text-xs uppercase tracking-widest text-brand-gold font-sans truncate">
              {previewAsset.filename}
            </span>
            <button
              type="button"
              onClick={() => setPreviewAsset(null)}
              className="flex items-center gap-1.5 text-xs font-sans text-brand-muted hover:text-brand-text transition-colors duration-150 flex-shrink-0"
            >
              <X className="w-4 h-4" strokeWidth={1.75} /> Close Preview
            </button>
          </div>
          <div className="flex-1 overflow-auto flex items-center justify-center p-8">
            {previewAsset.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewAsset.url}
                alt={previewAsset.filename}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <video src={previewAsset.url} className="max-w-full max-h-full" controls autoPlay />
            )}
          </div>
        </div>
      )}

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete this file?"
        description={
          deleteTarget
            ? `"${deleteTarget.filename}" will be permanently deleted from storage. If it's currently used anywhere on the website, that image or video will break. This cannot be undone.`
            : undefined
        }
        footer={
          <>
            <StudioButton variant="ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </StudioButton>
            <StudioButton variant="danger" onClick={confirmDelete} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete File"}
            </StudioButton>
          </>
        }
      />
    </div>
  );
}
