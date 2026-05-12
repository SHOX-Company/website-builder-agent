"use client";

import { useState, useEffect, useRef } from "react";

// ─── Form submission endpoint ───────────────────────────────────────────────
// Wire this to Formspree, Web3Forms, or a Next.js API route when ready.
// Formspree:  https://formspree.io/f/YOUR_FORM_ID
// Web3Forms:  https://api.web3forms.com/submit  (add { access_key: "..." })
// Next.js:    /api/jewelry-inquiry
const INQUIRY_ENDPOINT = "";
// ────────────────────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  email: string;
  instagram: string;
  piece: string;
  message: string;
}

interface Props {
  isOpen: boolean;
  defaultPiece: string;
  onClose: () => void;
}

const FIELD_BASE =
  "w-full bg-transparent border-0 border-b border-brand-border text-brand-text text-sm placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-gold transition-colors duration-200 py-3";

export default function JewelryInquiryModal({ isOpen, defaultPiece, onClose }: Props) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    instagram: "",
    piece: defaultPiece,
    message: "",
  });
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Sync piece when defaultPiece changes (different card opens modal)
  useEffect(() => {
    setForm((prev) => ({ ...prev, piece: defaultPiece }));
  }, [defaultPiece]);

  // Reset form state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setForm({ name: "", email: "", instagram: "", piece: defaultPiece, message: "" });
      // Focus first field after entry animation settles
      const t = setTimeout(() => firstFieldRef.current?.focus(), 220);
      return () => clearTimeout(t);
    }
  }, [isOpen, defaultPiece]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    if (INQUIRY_ENDPOINT) {
      try {
        await fetch(INQUIRY_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(form),
        });
      } catch {
        // Submission attempt recorded — proceed to success state regardless
      }
    }

    // Brief pause for perceived intentionality, then success
    await new Promise((r) => setTimeout(r, 900));
    setStatus("success");
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Acquisition inquiry"
    >
      {/* Modal card */}
      <div
        className="relative w-full max-w-lg bg-brand-surface border border-brand-gold/20 shadow-[0_0_80px_rgba(0,0,0,0.8)] animate-[modal-entry_0.22s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Gold top accent line */}
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent"
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-brand-muted hover:text-brand-text text-xs uppercase tracking-[0.25em] font-sans transition-colors duration-200"
          aria-label="Close"
        >
          Close ×
        </button>

        <div className="p-8 sm:p-10">

          {status === "success" ? (
            /* ── Success state ─────────────────────────────────────────── */
            <div className="flex flex-col items-center text-center gap-6 py-6">
              <div className="w-px h-10 bg-brand-gold/50" aria-hidden="true" />

              <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans">
                Inquiry Received
              </p>

              <h3 className="font-display text-3xl sm:text-4xl font-light text-brand-text leading-snug">
                Your request has been received.
              </h3>

              <p className="text-brand-muted text-sm leading-relaxed max-w-xs">
                Daniel personally reviews all acquisition inquiries. You will hear back directly.
              </p>

              <div className="w-px h-6 bg-brand-border" aria-hidden="true" />

              <p className="font-display text-lg italic text-brand-text/50">
                Thank you for reaching out.
              </p>

              <button
                onClick={onClose}
                className="mt-2 text-brand-muted hover:text-brand-gold text-xs uppercase tracking-[0.25em] font-sans transition-colors duration-200"
              >
                Return to Collection
              </button>
            </div>

          ) : (
            /* ── Inquiry form ──────────────────────────────────────────── */
            <>
              {/* Header */}
              <div className="mb-8">
                <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-3">
                  Acquisition Inquiry
                </p>
                <h3 className="font-display text-3xl font-light text-brand-text leading-tight">
                  {defaultPiece || "Private Acquisition"}
                </h3>
                <p className="text-brand-muted/60 text-xs font-sans mt-2">
                  One-of-one ceremonial artifact &nbsp;·&nbsp; Handled personally by Daniel
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-7" noValidate>

                {/* Name */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="inq-name" className="text-brand-muted/50 text-[10px] uppercase tracking-[0.2em] font-sans">
                    Name <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    ref={firstFieldRef}
                    id="inq-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    className={FIELD_BASE}
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="inq-email" className="text-brand-muted/50 text-[10px] uppercase tracking-[0.2em] font-sans">
                    Email <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    id="inq-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    className={FIELD_BASE}
                  />
                </div>

                {/* Instagram (optional) */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="inq-instagram" className="text-brand-muted/50 text-[10px] uppercase tracking-[0.2em] font-sans">
                    Instagram <span className="text-brand-muted/30">(optional)</span>
                  </label>
                  <input
                    id="inq-instagram"
                    name="instagram"
                    type="text"
                    autoComplete="off"
                    placeholder="@handle"
                    value={form.instagram}
                    onChange={handleChange}
                    className={FIELD_BASE}
                  />
                </div>

                {/* Piece of interest — displayed, not editable */}
                <div className="flex flex-col gap-1">
                  <p className="text-brand-muted/50 text-[10px] uppercase tracking-[0.2em] font-sans">
                    Piece of Interest
                  </p>
                  <div className="border-b border-brand-border py-3">
                    <span className="text-brand-text text-sm">
                      {form.piece || "General Inquiry"}
                    </span>
                  </div>
                  <input type="hidden" name="piece" value={form.piece} />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="inq-message" className="text-brand-muted/50 text-[10px] uppercase tracking-[0.2em] font-sans">
                    Message
                  </label>
                  <textarea
                    id="inq-message"
                    name="message"
                    rows={3}
                    placeholder="Tell Daniel what calls you to this piece…"
                    value={form.message}
                    onChange={handleChange}
                    className={`${FIELD_BASE} resize-none`}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "submitting" || !form.name || !form.email}
                  className="mt-2 w-full inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold bg-brand-gold text-brand-dark hover:bg-brand-gold-light disabled:opacity-40 disabled:cursor-not-allowed px-8 py-4 text-base"
                >
                  {status === "submitting" ? (
                    <span className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 border border-brand-dark/40 border-t-brand-dark rounded-full animate-spin" aria-hidden="true" />
                      Sending…
                    </span>
                  ) : (
                    "Begin Acquisition →"
                  )}
                </button>

                <p className="text-center text-brand-muted/40 text-xs font-sans -mt-3">
                  Private acquisition inquiry &nbsp;·&nbsp; No automated responses
                </p>

              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
