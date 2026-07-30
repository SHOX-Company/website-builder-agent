"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { InventoryCategory, InventoryImage, InventoryItem, InventoryItemInput } from "@/lib/inventory";
import { CATEGORY_LABELS } from "@/lib/inventory";
import Input from "@/components/studio/ui/Input";
import Textarea from "@/components/studio/ui/Textarea";
import Switch from "@/components/studio/ui/Switch";
import Modal from "@/components/studio/ui/Modal";
import StudioButton from "@/components/studio/ui/Button";
import {
  FeaturedImageUploader,
  AdditionalImagesUploader,
  VideoUploader,
} from "@/components/studio/inventory/InventoryMediaUploader";

const CATEGORIES: InventoryCategory[] = ["flute", "instrument", "jewelry"];

interface FormState {
  category: InventoryCategory;
  name: string;
  priceOnInquiry: boolean;
  price: string;
  published: boolean;
  featured: boolean;
  shortDescription: string;
  story: string;
  materials: string;
  specifications: string;
  featuredImage: InventoryImage | null;
  additionalImages: InventoryImage[];
  video: string | null;
}

function emptyForm(defaultCategory: InventoryCategory = "flute"): FormState {
  return {
    category: defaultCategory,
    name: "",
    priceOnInquiry: false,
    price: "",
    published: true,
    featured: false,
    shortDescription: "",
    story: "",
    materials: "",
    specifications: "",
    featuredImage: null,
    additionalImages: [],
    video: null,
  };
}

function formFromItem(item: InventoryItem): FormState {
  return {
    category: item.category,
    name: item.name,
    priceOnInquiry: item.price === null,
    price: item.price === null ? "" : String(item.price),
    published: item.published,
    featured: item.featured,
    shortDescription: item.shortDescription,
    story: item.story,
    materials: item.materials,
    specifications: item.specifications,
    featuredImage: item.featuredImage,
    additionalImages: item.additionalImages,
    video: item.video,
  };
}

function isValid(form: FormState): boolean {
  return (
    form.name.trim().length > 0 &&
    form.shortDescription.trim().length > 0 &&
    form.story.trim().length > 0 &&
    form.materials.trim().length > 0 &&
    form.featuredImage !== null &&
    (form.priceOnInquiry || form.price.trim().length > 0)
  );
}

interface InventoryItemDrawerProps {
  open: boolean;
  item: InventoryItem | null;
  defaultCategory?: InventoryCategory;
  onClose: () => void;
  onSaved: (item: InventoryItem) => void;
  onUpdated?: (item: InventoryItem) => void;
  onDeleted?: (id: string) => void;
}

export default function InventoryItemDrawer({
  open,
  item,
  defaultCategory,
  onClose,
  onSaved,
  onUpdated,
  onDeleted,
}: InventoryItemDrawerProps) {
  const mode = item ? "edit" : "create";
  const [form, setForm] = useState<FormState>(() => (item ? formFromItem(item) : emptyForm(defaultCategory)));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionPending, setActionPending] = useState<"sold" | "relist" | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<"soft" | "hard" | null>(null);

  // Reset the form whenever the drawer transitions from closed -> open,
  // following React's guidance for adjusting state during render rather than
  // in an effect (avoids an extra commit + the lint rule against setState
  // inside effect bodies).
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setForm(item ? formFromItem(item) : emptyForm(defaultCategory));
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
    if (!isValid(form)) return;
    setSaving(true);
    setError(null);

    const input: InventoryItemInput = {
      category: form.category,
      name: form.name.trim(),
      price: form.priceOnInquiry ? null : Number(form.price),
      published: form.published,
      featured: form.featured,
      shortDescription: form.shortDescription.trim(),
      story: form.story.trim(),
      materials: form.materials.trim(),
      specifications: form.specifications.trim(),
      featuredImage: form.featuredImage,
      additionalImages: form.additionalImages,
      video: form.video,
    };

    try {
      const res = await fetch(mode === "edit" ? `/api/studio/inventory/${item!.id}` : "/api/studio/inventory", {
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
      onSaved(data.item as InventoryItem);
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  }

  async function handleMarkSold() {
    if (!item) return;
    setActionPending("sold");
    try {
      const res = await fetch(`/api/studio/inventory/${item.id}/mark-sold`, { method: "POST" });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.item) {
        // Stay open: the gallery shows no badges, so this is the only place
        // Daniel can see the action actually took effect (Sold indicator +
        // the Mark as Sold button flipping to Relist).
        onUpdated?.(data.item as InventoryItem);
      }
    } finally {
      setActionPending(null);
    }
  }

  async function handleRelist() {
    if (!item) return;
    setActionPending("relist");
    try {
      const res = await fetch(`/api/studio/inventory/${item.id}/relist`, { method: "POST" });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.item) {
        onUpdated?.(data.item as InventoryItem);
      }
    } finally {
      setActionPending(null);
    }
  }

  async function handleSoftDelete() {
    if (!item) return;
    setDeleting("soft");
    try {
      const res = await fetch(`/api/studio/inventory/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: false }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.item) {
        onSaved(data.item as InventoryItem);
      }
    } finally {
      setDeleting(null);
      setDeleteOpen(false);
    }
  }

  async function handleHardDelete() {
    if (!item) return;
    setDeleting("hard");
    try {
      const res = await fetch(`/api/studio/inventory/${item.id}`, { method: "DELETE" });
      if (res.ok) {
        onDeleted?.(item.id);
        onClose();
      }
    } finally {
      setDeleting(null);
      setDeleteOpen(false);
    }
  }

  const isRelistable = item ? item.status === "sold" || !item.published : false;

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
        aria-label={mode === "edit" ? "Edit piece" : "New piece"}
        className={`absolute inset-y-0 right-0 w-full sm:w-[560px] bg-brand-surface border-l border-brand-border flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 h-16 border-b border-brand-border flex-shrink-0">
          <h2 className="font-display font-light text-brand-text text-xl">
            {mode === "edit" ? "Edit Piece" : "New Piece"}
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-8">
          {mode === "edit" && item && (item.status === "sold" || !item.published) && (
            <div className="flex flex-col gap-2">
              {item.status === "sold" && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-brand-surface-2 border border-brand-border">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold flex-shrink-0" />
                  <p className="text-xs font-sans text-brand-muted">
                    This piece is marked <span className="text-brand-text font-medium">Sold</span>.
                  </p>
                </div>
              )}
              {!item.published && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-brand-surface-2 border border-brand-border">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-muted flex-shrink-0" />
                  <p className="text-xs font-sans text-brand-muted">
                    This piece is <span className="text-brand-text font-medium">soft-deleted</span> — hidden from
                    the public site, safely kept here.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Category */}
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-widest text-brand-muted font-sans">Category</span>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => update("category", cat)}
                  className={`px-3 py-2.5 rounded-md text-sm font-sans border transition-colors duration-150 ${
                    form.category === cat
                      ? "bg-brand-gold/10 border-brand-gold text-brand-gold"
                      : "border-brand-border text-brand-muted hover:text-brand-text"
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          <Input
            id="name"
            label="Product Name"
            placeholder="e.g. Woolly Mammoth Tusk Flute"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />

          {/* Price */}
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-widest text-brand-muted font-sans">Price</span>
            {!form.priceOnInquiry && (
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder="4600"
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                  className="w-full bg-brand-dark border border-brand-border rounded-md pl-8 pr-4 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors duration-150"
                />
              </div>
            )}
            <label className="flex items-center gap-2 text-xs text-brand-muted font-sans cursor-pointer mt-1">
              <input
                type="checkbox"
                checked={form.priceOnInquiry}
                onChange={(e) => update("priceOnInquiry", e.target.checked)}
                className="w-3.5 h-3.5 accent-[#C4973A]"
              />
              Price on inquiry (no set price shown)
            </label>
          </div>

          <Switch
            checked={form.featured}
            onChange={(v) => update("featured", v)}
            label="Featured Item"
            description="Shown first in its category on the public site."
          />

          <Input
            id="shortDescription"
            label="Short Description"
            placeholder="A one-line hook, e.g. 'A luminous presence held close.'"
            value={form.shortDescription}
            onChange={(e) => update("shortDescription", e.target.value)}
          />

          <Textarea
            id="story"
            label="Story / Background"
            rows={5}
            placeholder="The longer narrative shown on the product page."
            value={form.story}
            onChange={(e) => update("story", e.target.value)}
          />

          <Input
            id="materials"
            label="Materials"
            placeholder="e.g. Natural pearl · Handcrafted setting · One of one"
            value={form.materials}
            onChange={(e) => update("materials", e.target.value)}
          />

          <Input
            id="specifications"
            label="Specifications"
            placeholder="A short rarity or spec note shown near the price"
            value={form.specifications}
            onChange={(e) => update("specifications", e.target.value)}
          />

          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-widest text-brand-muted font-sans">Featured Image</span>
            <FeaturedImageUploader value={form.featuredImage} onChange={(img) => update("featuredImage", img)} />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-widest text-brand-muted font-sans">Additional Images</span>
            <AdditionalImagesUploader
              value={form.additionalImages}
              onChange={(imgs) => update("additionalImages", imgs)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-widest text-brand-muted font-sans">Video (optional)</span>
            <VideoUploader value={form.video} onChange={(v) => update("video", v)} />
          </div>
        </div>

        {/* Footer — every action for this piece lives here, and only here.
            Fixed order on every item, every category: Mark as Sold, Relist,
            Delete, then Save Changes last as the final, primary CTA. Both
            Mark as Sold and Relist always render (never conditionally
            hidden) — the inapplicable one is simply disabled — so the
            workflow reads identically no matter what state the item is in. */}
        <div
          className="flex-shrink-0 border-t border-brand-border px-6 pt-4 flex flex-col gap-2.5"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          {error && <p className="text-xs text-red-400/90">{error}</p>}

          {mode === "edit" && item && (
            <>
              <StudioButton
                variant="secondary"
                onClick={handleMarkSold}
                disabled={actionPending !== null || item.status === "sold"}
                className="w-full"
              >
                {actionPending === "sold" ? "Marking Sold…" : "Mark as Sold"}
              </StudioButton>

              <StudioButton
                variant="secondary"
                onClick={handleRelist}
                disabled={actionPending !== null || !isRelistable}
                className="w-full"
              >
                {actionPending === "relist" ? "Relisting…" : "Relist"}
              </StudioButton>

              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="w-full text-center py-2 text-xs sm:text-sm font-sans font-medium text-red-400/90 hover:text-red-400 transition-colors duration-150"
              >
                Delete
              </button>
            </>
          )}

          <StudioButton onClick={handleSave} disabled={!isValid(form) || saving} className="w-full">
            {saving ? "Saving…" : mode === "edit" ? "Save Changes" : "Publish Piece"}
          </StudioButton>
        </div>
      </div>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete this inventory item?"
        description="Choose how you would like to delete this item."
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
              Removes this item from the public website but keeps the entire listing safely inside RootFlute
              Studio. Everything remains available for future editing and one-click relisting.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-red-400 font-medium font-sans">Hard Delete</p>
            <p className="text-xs text-brand-muted leading-relaxed">
              Permanently deletes this inventory item from both RootFlute Studio and the public website. This
              action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
