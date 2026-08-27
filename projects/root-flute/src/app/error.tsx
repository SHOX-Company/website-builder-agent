"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-32">
      <div className="w-px h-12 bg-brand-gold/40 mb-7" aria-hidden="true" />

      <p className="text-brand-gold text-xs uppercase tracking-[0.35em] font-sans mb-4">
        Something went wrong
      </p>

      <h1 className="font-display text-4xl sm:text-5xl font-light text-brand-text leading-snug mb-6">
        A moment of static.
      </h1>

      <p className="text-brand-muted text-sm sm:text-base leading-relaxed max-w-md mb-10">
        Something unexpected happened on our end. You can try again, or head back to the
        RootFlute world.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold bg-brand-gold text-brand-dark hover:bg-brand-gold-light px-8 py-4 text-base"
        >
          Try Again
        </button>
        {/* Plain <a>, matching every other internal link on this site — a
            real full-page load, not client-side routing (see Navbar.tsx). */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          className="inline-flex items-center justify-center font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold border border-brand-border text-brand-text hover:border-brand-gold px-8 py-4 text-base"
        >
          Return Home
        </a>
      </div>
    </main>
  );
}
