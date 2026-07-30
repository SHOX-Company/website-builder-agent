"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { VideoCollectionId, VideoImage, VideoItem, VideoItemInput } from "@/lib/video";
import Input from "@/components/studio/ui/Input";
import Textarea from "@/components/studio/ui/Textarea";
import Modal from "@/components/studio/ui/Modal";
import StudioButton from "@/components/studio/ui/Button";
import { FeaturedImageUploader, VideoUploader } from "@/components/studio/inventory/InventoryMediaUploader";

interface FormState {
  collection: VideoCollectionId;
  title: string;
  description: string;
  thumbnail: VideoImage | null;
  sourceMode: "upload" | "hosted";
  videoUrl: string | null;
  hostedUrl: string;
  duration: string;
  featured: boolean;
  published: boolean;
  order: string;
}

function emptyForm(defaultCollection: VideoCollectionId): FormState {
  return {
    collection: defaultCollection,
    title: "",
    description: "",
    thumbnail: null,
    sourceMode: "hosted",
    videoUrl: null,
    hostedUrl: "",
    duration: "",
    featured: false,
    published: true,
    order: "",
  };
}

function formFromVideo(video: VideoItem): FormState {
  return {
    collection: video.collection,
    title: video.title,
    description: video.description,
    thumbnail: video.thumbnail,
    sourceMode: video.videoUrl ? "upload" : "hosted",
    videoUrl: video.videoUrl,
    hostedUrl: video.hostedUrl ?? "",
    duration: video.duration,
    featured: video.featured,
    published: video.published,
    order: String(video.order),
  };
}

// Edit mode never touches the video source, collection, duration, featured
// flag, published flag, or display order — those are either fixed at
// creation time or invisible pass-throughs resent as-is on Save Changes. New
// Video creation still needs a source, since that's the only way to attach
// footage to a listing in the first place.
function isValid(form: FormState, mode: "edit" | "create"): boolean {
  const base = form.title.trim().length > 0 && form.thumbnail !== null;
  if (mode === "create") {
    const hasSource = form.sourceMode === "upload" ? Boolean(form.videoUrl) : form.hostedUrl.trim().length > 0;
    return base && hasSource;
  }
  return base;
}

interface VideoItemDrawerProps {
  open: boolean;
  video: VideoItem | null;
  defaultCollection: VideoCollectionId;
  onClose: () => void;
  onSaved: (video: VideoItem) => void;
  onUpdated?: (video: VideoItem) => void;
  onDeleted?: (id: string) => void;
}

export default function VideoItemDrawer({
  open,
  video,
  defaultCollection,
  onClose,
  onSaved,
  onUpdated,
  onDeleted,
}: VideoItemDrawerProps) {
  const mode = video ? "edit" : "create";
  const [form, setForm] = useState<FormState>(() => (video ? formFromVideo(video) : emptyForm(defaultCollection)));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionPending, setActionPending] = useState<"republish" | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<"soft" | "hard" | null>(null);

  // Reset the form on the closed -> open transition (see InventoryItemDrawer
  // for why this happens during render rather than in a useEffect).
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setForm(video ? formFromVideo(video) : emptyForm(defaultCollection));
      setError(null);
    }
  }

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!isValid(form, mode)) return;
    setSaving(true);
    setError(null);

    const input: Partial<VideoItemInput> = {
      collection: form.collection,
      title: form.title.trim(),
      description: form.description.trim(),
      thumbnail: form.thumbnail,
      videoUrl: form.sourceMode === "upload" ? form.videoUrl : null,
      hostedUrl: form.sourceMode === "hosted" ? form.hostedUrl.trim() : null,
      duration: form.duration.trim(),
      featured: form.featured,
      published: form.published,
    };
    // Only send an explicit order when editing (to preserve the existing
    // position) — omitting it on create lets the server auto-append to the
    // end of the collection.
    if (mode === "edit") {
      input.order = video!.order;
    }

    try {
      const res = await fetch(mode === "edit" ? `/api/studio/videos/${video!.id}` : "/api/studio/videos", {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        setSaving(false);
        return;
      }
      onSaved(data.item as VideoItem);
      setSaving(false);
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  }

  async function handleRepublish() {
    if (!video) return;
    setActionPending("republish");
    try {
      const res = await fetch(`/api/studio/videos/${video.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: true }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.item) {
        // Stay open, same reasoning as Inventory's Mark as Sold / Relist —
        // the gallery shows no badges, so this is the only place Daniel can
        // confirm the video is live again.
        onUpdated?.(data.item as VideoItem);
      }
    } finally {
      setActionPending(null);
    }
  }

  async function handleSoftDelete() {
    if (!video) return;
    setDeleting("soft");
    try {
      const res = await fetch(`/api/studio/videos/${video.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: false }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.item) {
        onSaved(data.item as VideoItem);
      }
    } finally {
      setDeleting(null);
      setDeleteOpen(false);
    }
  }

  async function handleHardDelete() {
    if (!video) return;
    setDeleting("hard");
    try {
      const res = await fetch(`/api/studio/videos/${video.id}`, { method: "DELETE" });
      if (res.ok) {
        onDeleted?.(video.id);
        onClose();
      }
    } finally {
      setDeleting(null);
      setDeleteOpen(false);
    }
  }

  const isRepublishable = video ? !video.published : false;

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[90] transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div onClick={onClose} className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={mode === "edit" ? "Edit video" : "New video"}
        className={`absolute inset-y-0 right-0 w-full sm:w-[560px] bg-brand-surface border-l border-brand-border flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-4 px-6 h-16 border-b border-brand-border flex-shrink-0">
          <h2 className="font-display font-light text-brand-text text-xl">
            {mode === "edit" ? "Edit Video" : "New Video"}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="p-1.5 text-brand-muted hover:text-brand-text transition-colors duration-150"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Body — thumbnail first, then title, then description. Nothing
            else appears above these three fields. */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-widest text-brand-muted font-sans">Thumbnail Image</span>
            <FeaturedImageUploader value={form.thumbnail} onChange={(img) => update("thumbnail", img)} />
          </div>

          <Input
            id="title"
            label="Video Title"
            placeholder="e.g. Landjuweel Festival 2024 with RootFlute"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />

          <Textarea
            id="description"
            label="Description"
            rows={4}
            placeholder="A short description shown alongside the video (optional)"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />

          {/* Video source only needs to be set once, at creation — editing
              an existing video only ever touches its thumbnail/title/
              description here. */}
          {mode === "create" && (
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-widest text-brand-muted font-sans">Video Source</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => update("sourceMode", "hosted")}
                  className={`px-3 py-2.5 rounded-md text-sm font-sans border transition-colors duration-150 ${
                    form.sourceMode === "hosted"
                      ? "bg-brand-gold/10 border-brand-gold text-brand-gold"
                      : "border-brand-border text-brand-muted hover:text-brand-text"
                  }`}
                >
                  Hosted URL
                </button>
                <button
                  type="button"
                  onClick={() => update("sourceMode", "upload")}
                  className={`px-3 py-2.5 rounded-md text-sm font-sans border transition-colors duration-150 ${
                    form.sourceMode === "upload"
                      ? "bg-brand-gold/10 border-brand-gold text-brand-gold"
                      : "border-brand-border text-brand-muted hover:text-brand-text"
                  }`}
                >
                  Upload Video
                </button>
              </div>

              {form.sourceMode === "hosted" ? (
                <Input
                  id="hostedUrl"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={form.hostedUrl}
                  onChange={(e) => update("hostedUrl", e.target.value)}
                />
              ) : (
                <VideoUploader value={form.videoUrl} onChange={(v) => update("videoUrl", v)} />
              )}
            </div>
          )}

          {mode === "edit" && video && !video.published && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-brand-surface-2 border border-brand-border">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-muted flex-shrink-0" />
              <p className="text-xs font-sans text-brand-muted">
                This video is <span className="text-brand-text font-medium">unpublished</span> — hidden from the
                public site, safely kept here.
              </p>
            </div>
          )}
        </div>

        {/* Footer — every action for this video lives here, and only here.
            Fixed order: Delete, Repost Video, Save Changes last as the
            final, primary CTA — matching the finalized Inventory editor. */}
        <div
          className="flex-shrink-0 border-t border-brand-border px-6 pt-4 flex flex-col gap-2.5"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          {error && <p className="text-xs text-red-400/90">{error}</p>}

          {mode === "edit" && video && (
            <>
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="w-full text-center py-2 text-xs sm:text-sm font-sans font-medium text-red-400/90 hover:text-red-400 transition-colors duration-150"
              >
                Delete
              </button>

              <StudioButton
                variant="secondary"
                onClick={handleRepublish}
                disabled={actionPending !== null || !isRepublishable}
                className="w-full"
              >
                {actionPending === "republish" ? "Reposting…" : "Repost Video"}
              </StudioButton>
            </>
          )}

          <StudioButton onClick={handleSave} disabled={!isValid(form, mode) || saving} className="w-full">
            {saving ? "Saving…" : mode === "edit" ? "Save Changes" : "Publish Video"}
          </StudioButton>
        </div>
      </div>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete this video?"
        description="Choose how you would like to delete this video."
        footer={
          <>
            <StudioButton variant="ghost" onClick={() => setDeleteOpen(false)} disabled={deleting !== null}>
              Cancel
            </StudioButton>
            <StudioButton variant="danger" onClick={handleHardDelete} disabled={deleting !== null}>
              {deleting === "hard" ? "Deleting…" : "Hard Delete"}
            </StudioButton>
            <StudioButton variant="secondary" onClick={handleSoftDelete} disabled={deleting !== null}>
              {deleting === "soft" ? "Removing…" : "Soft Delete"}
            </StudioButton>
          </>
        }
      >
        <div className="flex flex-col gap-4 -mt-1 mb-1">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-brand-text font-medium font-sans">
              Soft Delete <span className="text-brand-gold text-xs font-normal">— Recommended</span>
            </p>
            <p className="text-xs text-brand-muted leading-relaxed">
              Removes this video from the public website but keeps it safely inside RootFlute Studio, with all
              metadata preserved. It can be restored any time with Repost Video.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-red-400 font-medium font-sans">Hard Delete</p>
            <p className="text-xs text-brand-muted leading-relaxed">
              Permanently deletes this video from both RootFlute Studio and the public website. This action
              cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
