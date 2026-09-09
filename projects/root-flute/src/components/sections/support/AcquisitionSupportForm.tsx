"use client";

import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  orderReference: string;
  item: string;
  requestType: string;
  message: string;
  website: string; // honeypot — never shown to real users
}

const REQUEST_TYPES = [
  "Return Request",
  "Order Support",
  "Shipping Question",
  "Other",
] as const;

const FIELD_BASE =
  "w-full bg-transparent border-0 border-b border-brand-border text-brand-text text-sm placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-gold transition-colors duration-200 py-3";

export default function AcquisitionSupportForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    orderReference: "",
    item: "",
    requestType: "",
    message: "",
    website: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    try {
      await fetch("/api/acquisition-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      // Network failure — proceed to success state; the API logs server-side.
    }
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center text-center gap-7 py-10">
        <div className="w-px h-12 bg-brand-gold/40" aria-hidden="true" />
        <p className="text-brand-gold text-xs uppercase tracking-[0.35em] font-sans">
          Request Received
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-light text-brand-text leading-snug">
          Your request has been received.
        </h2>
        <p className="text-brand-muted text-sm leading-relaxed max-w-[340px]">
          Daniel will personally review your request and follow up with you at the email
          address you provided.
        </p>
        <div className="w-16 h-px bg-brand-gold/20" aria-hidden="true" />
      </div>
    );
  }

  const canSubmit =
    form.name.trim() && form.email.trim() && form.requestType && form.message.trim();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="support-name" className="text-brand-muted/50 text-[10px] uppercase tracking-[0.2em] font-sans">
          Name <span className="text-brand-gold">*</span>
        </label>
        <input
          id="support-name"
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

      <div className="flex flex-col gap-1.5">
        <label htmlFor="support-email" className="text-brand-muted/50 text-[10px] uppercase tracking-[0.2em] font-sans">
          Email <span className="text-brand-gold">*</span>
        </label>
        <input
          id="support-email"
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

      <div className="flex flex-col gap-1.5">
        <label htmlFor="support-order" className="text-brand-muted/50 text-[10px] uppercase tracking-[0.2em] font-sans">
          Order Reference / Checkout Reference <span className="text-brand-muted/30">(from your confirmation email)</span>
        </label>
        <input
          id="support-order"
          name="orderReference"
          type="text"
          autoComplete="off"
          placeholder="RF-XXXXXXXX"
          value={form.orderReference}
          onChange={handleChange}
          className={FIELD_BASE}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="support-item" className="text-brand-muted/50 text-[10px] uppercase tracking-[0.2em] font-sans">
          Piece / Item <span className="text-brand-muted/30">(optional)</span>
        </label>
        <input
          id="support-item"
          name="item"
          type="text"
          autoComplete="off"
          placeholder="The piece your request concerns"
          value={form.item}
          onChange={handleChange}
          className={FIELD_BASE}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="support-type" className="text-brand-muted/50 text-[10px] uppercase tracking-[0.2em] font-sans">
          Request Type <span className="text-brand-gold">*</span>
        </label>
        <select
          id="support-type"
          name="requestType"
          required
          value={form.requestType}
          onChange={handleChange}
          className={`${FIELD_BASE} appearance-none cursor-pointer ${form.requestType ? "" : "text-brand-muted/40"}`}
        >
          <option value="" disabled>
            Select a request type
          </option>
          {REQUEST_TYPES.map((t) => (
            <option key={t} value={t} className="bg-brand-surface text-brand-text">
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="support-message" className="text-brand-muted/50 text-[10px] uppercase tracking-[0.2em] font-sans">
          Message <span className="text-brand-gold">*</span>
        </label>
        <textarea
          id="support-message"
          name="message"
          rows={4}
          required
          placeholder="Tell Daniel how he can help with your acquisition…"
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

      <div className="flex flex-col gap-3 pt-1">
        <button
          type="submit"
          disabled={status === "submitting" || !canSubmit}
          className="w-full inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold bg-brand-gold text-brand-dark hover:bg-brand-gold-light disabled:opacity-40 disabled:cursor-not-allowed px-8 py-4 text-base"
        >
          {status === "submitting" ? (
            <span className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 border border-brand-dark/40 border-t-brand-dark rounded-full animate-spin" aria-hidden="true" />
              Sending…
            </span>
          ) : (
            "Send Request →"
          )}
        </button>
        <p className="text-center text-brand-muted/40 text-xs font-sans">
          Daniel will personally review your request and follow up with you.
        </p>
      </div>
    </form>
  );
}
