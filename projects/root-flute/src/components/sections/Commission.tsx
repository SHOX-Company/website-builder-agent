"use client";

import { useState, useRef } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";

const BUDGET_OPTIONS = [
  "Select a range",
  "$3,000 – $6,000",
  "$6,000 – $12,000",
  "$12,000 – $20,000",
  "$20,000+",
];

const STEPS = [
  { number: "01", label: "Apply" },
  { number: "02", label: "Align on vision" },
  { number: "03", label: "Select materials" },
  { number: "04", label: "Build" },
  { number: "05", label: "Delivery" },
];

export default function Commission() {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  function toggleAudio() {
    if (!videoRef.current) return;
    const next = !muted;
    videoRef.current.muted = next;
    if (!next) {
      videoRef.current.volume = 1.0;
      videoRef.current.play();
    }
    setMuted(next);
  }

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    instagram: "",
    budget: BUDGET_OPTIONS[0],
    intendedUse: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email required";
    if (form.budget === BUDGET_OPTIONS[0]) e.budget = "Select a budget range";
    if (!form.intendedUse.trim()) e.intendedUse = "Required";
    return e;
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }
    // In production: POST to an API route or form service
    setSubmitted(true);
  }

  return (
    <SectionWrapper id="commission" className="bg-brand-surface">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="text-center mb-14">
        <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
          Custom Work
        </p>
        <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text mb-6">
          Commission a Flute
        </h2>
        <p className="text-brand-muted text-base leading-relaxed max-w-xl mx-auto mb-5">
          Each instrument is shaped by hand, from ancient materials,
          for a single owner. One-of-one, built personally by Dan
          with intention for ceremonial or personal use.
        </p>
        <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans">
          Only 25 Woolly Mammoth tusks remain for custom commissions.
        </p>
      </div>

      {/* ── Featured Video ─────────────────────────────────────── */}
      <div className="relative w-full aspect-video overflow-hidden bg-brand-surface mb-14">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          src="https://p2pvgplym6odmfbh.public.blob.vercel-storage.com/commission-tusk.mov"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-brand-dark/75 via-transparent to-transparent"
        />
        <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col items-start gap-2">
          <button
            onClick={toggleAudio}
            className="border border-brand-gold/70 text-brand-gold text-xs uppercase tracking-[0.3em] font-sans px-5 py-2.5 hover:bg-brand-gold hover:text-brand-dark transition-colors duration-200 bg-brand-dark/40 backdrop-blur-sm"
          >
            {muted ? "Listen to Daniel" : "Mute"}
          </button>
          {muted && (
            <p className="text-brand-muted/60 text-xs font-sans">
              Tap to hear Daniel
            </p>
          )}
        </div>
      </div>

      {/* ── Process Flow ───────────────────────────────────────── */}
      <div className="mb-14">
        <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans text-center mb-8">
          The Process
        </p>
        <div className="flex flex-col items-center sm:flex-row sm:items-center justify-center gap-0">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center text-center px-6 py-3">
                <span className="text-brand-gold font-sans text-xs tracking-widest mb-2">
                  {step.number}
                </span>
                <span className="text-brand-text font-display text-lg font-light">
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="hidden sm:block text-brand-muted text-xl font-light select-none mx-1"
                >
                  /
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Price Anchor ───────────────────────────────────────── */}
      <div className="text-center mb-14">
        <p className="text-brand-muted text-sm leading-relaxed">
          Commissions typically range from{" "}
          <span className="text-brand-text">$3,000 – $20,000+</span>{" "}
          depending on materials and complexity.
        </p>
      </div>

      {/* ── Application Form ───────────────────────────────────── */}
      <div className="max-w-xl mx-auto">
        <div className="border border-brand-border bg-brand-surface p-8 sm:p-12">

          {submitted ? (
            <div className="text-center py-8">
              <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
                Received
              </p>
              <p className="font-display text-3xl font-light text-brand-text mb-4">
                Thank you.
              </p>
              <p className="text-brand-muted text-sm leading-relaxed">
                Your application has been received. Dan reviews each request
                personally and will be in touch if there is alignment.
              </p>
            </div>
          ) : (
            <>
              <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-8">
                Apply for a Commission
              </p>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

                {/* Name */}
                <Field label="Name" error={errors.name}>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={inputClass(errors.name)}
                  />
                </Field>

                {/* Email */}
                <Field label="Email" error={errors.email}>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={inputClass(errors.email)}
                  />
                </Field>

                {/* Instagram */}
                <Field label="Instagram Handle" hint="Optional">
                  <input
                    type="text"
                    name="instagram"
                    value={form.instagram}
                    onChange={handleChange}
                    placeholder="@handle"
                    className={inputClass()}
                  />
                </Field>

                {/* Budget */}
                <Field label="Budget Range" error={errors.budget}>
                  <select
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className={inputClass(errors.budget) + " appearance-none cursor-pointer"}
                  >
                    {BUDGET_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} disabled={opt === BUDGET_OPTIONS[0]}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* Intended Use */}
                <Field label="Intended Use" error={errors.intendedUse}>
                  <input
                    type="text"
                    name="intendedUse"
                    value={form.intendedUse}
                    onChange={handleChange}
                    placeholder="Ceremony, personal practice, gifting…"
                    className={inputClass(errors.intendedUse)}
                  />
                </Field>

                {/* Notes */}
                <Field label="Notes" hint="Optional">
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Materials, tuning preferences, timeline, or anything else you want Dan to know."
                    rows={4}
                    className={inputClass() + " resize-none"}
                  />
                </Field>

                <button
                  type="submit"
                  className="mt-2 w-full border border-brand-gold text-brand-gold text-xs uppercase tracking-[0.3em] font-sans px-6 py-3 hover:bg-brand-gold hover:text-brand-dark transition-colors duration-200 cursor-pointer"
                >
                  Submit Application
                </button>

              </form>
            </>
          )}
        </div>

        {/* Closing scarcity line */}
        <p className="text-center text-brand-muted text-xs uppercase tracking-widest mt-8 font-sans">
          Each commission is accepted selectively. Availability is limited.
        </p>
      </div>

    </SectionWrapper>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function inputClass(error?: string) {
  return [
    "w-full bg-brand-dark border text-brand-text text-sm px-4 py-3 placeholder:text-brand-muted/50 outline-none",
    "focus:border-brand-gold transition-colors duration-200",
    error ? "border-red-800" : "border-brand-border",
  ]
    .filter(Boolean)
    .join(" ");
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <label className="text-brand-muted text-xs uppercase tracking-widest font-sans">
          {label}
        </label>
        {hint && (
          <span className="text-brand-muted/50 text-xs font-sans">{hint}</span>
        )}
      </div>
      {children}
      {error && (
        <p className="text-red-700 text-xs font-sans">{error}</p>
      )}
    </div>
  );
}
