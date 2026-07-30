"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { TestimonialItem, TestimonialItemInput } from "@/lib/testimonial";
import Input from "@/components/studio/ui/Input";
import Textarea from "@/components/studio/ui/Textarea";
import Switch from "@/components/studio/ui/Switch";
import StudioButton from "@/components/studio/ui/Button";
import Modal from "@/components/studio/ui/Modal";
import EditorFooter from "@/components/studio/ui/EditorFooter";

interface FormState {
  author: string;
  location: string;
  quote: string;
  published: boolean;
}

function emptyForm(): FormState {
  return { author: "", location: "", quote: "", published: true };
}

function formFromTestimonial(testimonial: TestimonialItem): FormState {
  return {
    author: testimonial.author,
    location: testimonial.location ?? "",
    quote: testimonial.quote,
    published: testimonial.published,
  };
}

function isValid(form: FormState): boolean {
  return form.author.trim().length > 0 && form.quote.trim().length > 0;
}

interface TestimonialItemDrawerProps {
  open: boolean;
  testimonial: TestimonialItem | null;
  onClose: () => void;
  onSaved: (testimonial: TestimonialItem) => void;
  onDeleted?: (id: string) => void;
}

export default function TestimonialItemDrawer({
  open,
  testimonial,
  onClose,
  onSaved,
  onDeleted,
}: TestimonialItemDrawerProps) {
  const mode = testimonial ? "edit" : "create";
  const [form, setForm] = useState<FormState>(() =>
    testimonial ? formFromTestimonial(testimonial) : emptyForm()
  );
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
      setForm(testimonial ? formFromTestimonial(testimonial) : emptyForm());
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

    const input: Partial<TestimonialItemInput> = {
      author: form.author.trim(),
      location: form.location.trim().length > 0 ? form.location.trim() : null,
      quote: form.quote.trim(),
      published: form.published,
    };

    try {
      const res = await fetch(
        mode === "edit" ? `/api/studio/testimonials/${testimonial!.id}` : "/api/studio/testimonials",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        }
      );
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        setSaving(false);
        return;
      }
      onSaved(data.item as TestimonialItem);
      setSaving(false);
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!testimonial) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/studio/testimonials/${testimonial.id}`, { method: "DELETE" });
      if (res.ok) {
        onDeleted?.(testimonial.id);
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
        aria-label={mode === "edit" ? "Edit testimonial" : "New testimonial"}
        className={`absolute inset-y-0 right-0 w-full sm:w-[560px] bg-brand-surface border-l border-brand-border flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-4 px-6 h-16 border-b border-brand-border flex-shrink-0">
          <h2 className="font-display font-light text-brand-text text-xl">
            {mode === "edit" ? "Edit Testimonial" : "New Testimonial"}
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
            id="author"
            label="Name"
            placeholder="e.g. Mia"
            value={form.author}
            onChange={(e) => update("author", e.target.value)}
          />

          <Input
            id="location"
            label="Location (optional)"
            placeholder="e.g. Tempe, AZ"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
          />

          <Textarea
            id="quote"
            label="Full Testimonial"
            rows={10}
            placeholder="The full testimonial text"
            value={form.quote}
            onChange={(e) => update("quote", e.target.value)}
          />

          <Switch
            checked={form.published}
            onChange={(v) => update("published", v)}
            label="Published"
            description="Live on the public Testimonials page immediately when on."
          />
        </div>

        <EditorFooter
          onDelete={mode === "edit" ? () => setDeleteOpen(true) : undefined}
          onCancel={onClose}
          cancelDisabled={saving}
          onSave={handleSave}
          saveLabel={saving ? "Saving…" : mode === "edit" ? "Save Changes" : "Add Testimonial"}
          saveDisabled={!isValid(form) || saving}
          error={error}
        />
      </div>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete this testimonial?"
        description={
          testimonial
            ? `"${testimonial.author}"'s testimonial will be permanently removed from Studio and the public website. This cannot be undone.`
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
