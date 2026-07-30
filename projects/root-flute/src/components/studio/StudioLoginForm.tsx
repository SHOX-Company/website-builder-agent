"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export default function StudioLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/studio/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      const next = searchParams.get("next");
      router.replace(next && next.startsWith("/studio") ? next : "/studio");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full max-w-sm">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(196,151,58,0.08),transparent_70%)]"
      />

      <div className="flex flex-col items-center gap-2 mb-10 text-center">
        <span className="font-display text-3xl font-normal text-brand-text">
          Root<span className="text-brand-gold">Flute</span>
        </span>
        <p className="text-brand-muted text-xs uppercase tracking-[0.35em] font-sans">
          Studio
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 bg-brand-surface border border-brand-border rounded-lg p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-xs uppercase tracking-widest text-brand-muted font-sans">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" strokeWidth={1.75} />
            <input
              id="password"
              type="password"
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-dark border border-brand-border rounded-md pl-10 pr-4 py-3 text-sm text-brand-text placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors duration-150"
              placeholder="Enter your password"
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-400/90 -mt-1">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || password.length === 0}
          className="inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-dark font-semibold text-sm py-3 rounded-md hover:bg-brand-gold-light transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-brand-muted/70 font-sans">
        Private access only. Contact the owner if you need access.
      </p>
    </div>
  );
}
