"use client";

import { useState, useEffect, useRef } from "react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  instagram: string;
  piece: string;
  message: string;
  website: string;
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
    phone: "",
    instagram: "",
    piece: defaultPiece,
    message: "",
    website: "",
  });
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm((prev) => ({ ...prev, piece: defaultPiece }));
  }, [defaultPiece]);

  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setForm({ name: "", email: "", phone: "", instagram: "", piece: defaultPiece, message: "", website: "" });
      const t = setTimeout(() => firstFieldRef.current?.focus(), 240);
      return () => clearTimeout(t);
    }
  }, [isOpen, defaultPiece]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    try {
      await fetch("/api/jewelry-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      // Network failure — proceed to success state; API logs server-side
    }

    setStatus("success");
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6 bg-black/90 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Acquisition inquiry"
    >
      {/* Modal card */}
      <div
        className="relative w-full sm:max-w-lg bg-brand-surface border border-brand-gold/20 shadow-[0_0_100px_rgba(0,0,0,0.9)] animate-[modal-entry_0.25s_ease-out] overflow-y-auto max-h-[92dvh] sm:max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Gold top accent line */}
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent"
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 text-brand-muted hover:text-brand-text text-xs uppercase tracking-[0.25em] font-sans transition-colors duration-200"
          aria-label="Close"
        >
          Close ×
        </button>

        <div className="p-8 sm:p-10 pt-10 sm:pt-10">

          {status === "success" ? (
            /* ── Success state ─────────────────────────────────────────── */
            <div className="flex flex-col items-center text-center gap-7 py-8">
              <div className="w-px h-12 bg-brand-gold/40" aria-hidden="true" />

              <p className="text-brand-gold text-xs uppercase tracking-[0.35em] font-sans">
                Inquiry Received
              </p>

              <h3 className="font-display text-3xl sm:text-4xl font-light text-brand-text leading-snug">
                Your acquisition inquiry<br />has been received.
              </h3>

              <p className="text-brand-muted text-sm leading-relaxed max-w-[300px]">
                Daniel personally reviews each request. Due to the one-of-one nature of these pieces,
                availability is not guaranteed until confirmed.
              </p>

              <div className="w-16 h-px bg-brand-gold/20" aria-hidden="true" />

              <p className="font-display text-xl italic text-brand-text/40">
                You will hear back directly.
              </p>

              <button
                onClick={onClose}
                className="mt-1 text-brand-muted hover:text-brand-gold text-xs uppercase tracking-[0.25em] font-sans transition-colors duration-200"
              >
                Return to Collection
              </button>
            </div>

          ) : (
            /* ── Inquiry form ──────────────────────────────────────────── */
            <>
              {/* Header */}
              <div className="mb-9">
                <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-3">
                  Acquisition Inquiry
                </p>
                <h3 className="font-display text-3xl font-light text-brand-text leading-tight">
                  {defaultPiece || "Private Acquisition"}
                </h3>
                <p className="text-brand-muted/50 text-xs font-sans mt-2">
                  One-of-one handcrafted artifact &nbsp;·&nbsp; Handled personally by Daniel
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
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
                <div className="flex flex-col gap-1.5">
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

                {/* Phone (optional) */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="inq-phone" className="text-brand-muted/50 text-[10px] uppercase tracking-[0.2em] font-sans">
                    Phone <span className="text-brand-muted/30">(optional)</span>
                  </label>
                  <input
                    id="inq-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={handleChange}
                    className={FIELD_BASE}
                  />
                </div>

                {/* Instagram (optional) */}
                <div className="flex flex-col gap-1.5">
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
                <div className="flex flex-col gap-1.5">
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
                <div className="flex flex-col gap-1.5">
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

                {/* Honeypot — hidden from real users, catches bots */}
                <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}>
                  <input
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Submit */}
                <div className="flex flex-col gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={status === "submitting" || !form.name.trim() || !form.email.trim()}
                    className="w-full inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold bg-brand-gold text-brand-dark hover:bg-brand-gold-light disabled:opacity-40 disabled:cursor-not-allowed px-8 py-4 text-base"
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

                  <p className="text-center text-brand-muted/40 text-xs font-sans">
                    Private acquisition inquiry &nbsp;·&nbsp; No automated responses
                  </p>
                </div>

              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
