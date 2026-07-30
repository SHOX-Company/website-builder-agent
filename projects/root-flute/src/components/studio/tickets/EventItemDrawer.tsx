"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { EventImage, EventItem, EventItemInput } from "@/lib/event";
import Input from "@/components/studio/ui/Input";
import Textarea from "@/components/studio/ui/Textarea";
import Switch from "@/components/studio/ui/Switch";
import StudioButton from "@/components/studio/ui/Button";
import Modal from "@/components/studio/ui/Modal";
import EditorFooter from "@/components/studio/ui/EditorFooter";
import { FeaturedImageUploader } from "@/components/studio/inventory/InventoryMediaUploader";

interface FormState {
  title: string;
  description: string;
  price: string;
  location: string;
  date: string;
  posterImage: EventImage | null;
  published: boolean;
}

function emptyForm(): FormState {
  return { title: "", description: "", price: "", location: "", date: "", posterImage: null, published: true };
}

function formFromEvent(event: EventItem): FormState {
  return {
    title: event.title,
    description: event.description,
    price: event.price,
    location: event.location,
    date: event.date ?? "",
    posterImage: event.posterImage,
    published: event.published,
  };
}

function isValid(form: FormState): boolean {
  return form.title.trim().length > 0;
}

interface EventItemDrawerProps {
  open: boolean;
  event: EventItem | null;
  onClose: () => void;
  onSaved: (event: EventItem) => void;
  onDeleted?: (id: string) => void;
}

export default function EventItemDrawer({ open, event, onClose, onSaved, onDeleted }: EventItemDrawerProps) {
  const mode = event ? "edit" : "create";
  const [form, setForm] = useState<FormState>(() => (event ? formFromEvent(event) : emptyForm()));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Reset the form on the closed -> open transition (see InventoryItemDrawer
  // for why this happens during render rather than in a useEffect).
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setForm(event ? formFromEvent(event) : emptyForm());
      setError(null);
    }
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!isValid(form)) return;
    setSaving(true);
    setError(null);

    const input: Partial<EventItemInput> = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: form.price.trim(),
      location: form.location.trim(),
      date: form.date.trim().length > 0 ? form.date.trim() : null,
      posterImage: form.posterImage,
      published: form.published,
    };

    try {
      const res = await fetch(mode === "edit" ? `/api/studio/events/${event!.id}` : "/api/studio/events", {
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
      onSaved(data.item as EventItem);
      setSaving(false);
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!event) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/studio/events/${event.id}`, { method: "DELETE" });
      if (res.ok) {
        onDeleted?.(event.id);
        onClose();
      }
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

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
        aria-label={mode === "edit" ? "Edit event" : "New event"}
        className={`absolute inset-y-0 right-0 w-full sm:w-[560px] bg-brand-surface border-l border-brand-border flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-4 px-6 h-16 border-b border-brand-border flex-shrink-0">
          <h2 className="font-display font-light text-brand-text text-xl">
            {mode === "edit" ? "Edit Event" : "New Event"}
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

        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-8">
          <Input
            id="event-title"
            label="Event Title"
            placeholder="e.g. Santa Fe Dual Event"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />

          <Textarea
            id="event-description"
            label="Description"
            rows={4}
            placeholder="A short description of the event (optional)"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />

          <Input
            id="event-price"
            label="Cost / Price"
            placeholder="e.g. $35 or Donation-based"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
          />

          <Input
            id="event-location"
            label="Location"
            placeholder="e.g. Santa Fe, NM"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
          />

          <Input
            id="event-date"
            label="Date (optional)"
            placeholder="e.g. May 20th"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
          />

          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-widest text-brand-muted font-sans">Hero Poster Image</span>
            <FeaturedImageUploader value={form.posterImage} onChange={(img) => update("posterImage", img)} />
          </div>

          <Switch
            checked={form.published}
            onChange={(v) => update("published", v)}
            label="Published"
            description="Live on the public website immediately when on."
          />
        </div>

        <EditorFooter
          onDelete={mode === "edit" ? () => setDeleteOpen(true) : undefined}
          onCancel={onClose}
          cancelDisabled={saving}
          onSave={handleSave}
          saveLabel={saving ? "Saving…" : mode === "edit" ? "Save Changes" : "Add Event"}
          saveDisabled={!isValid(form) || saving}
          error={error}
        />
      </div>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete this event?"
        description={
          event
            ? `"${event.title}" will be permanently removed from Studio and the public website. This cannot be undone.`
            : undefined
        }
        footer={
          <>
            <StudioButton variant="ghost" onClick={() => setDeleteOpen(false)} disabled={deleting}>
              Cancel
            </StudioButton>
            <StudioButton variant="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete"}
            </StudioButton>
          </>
        }
      />
    </div>
  );
}
