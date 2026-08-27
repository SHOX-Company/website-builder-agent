import Footer from "@/components/sections/Footer";

export default function NotFound() {
  return (
    <>
      <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-32">
        <div className="w-px h-12 bg-brand-gold/40 mb-7" aria-hidden="true" />

        <p className="text-brand-gold text-xs uppercase tracking-[0.35em] font-sans mb-4">
          404
        </p>

        <h1 className="font-display text-4xl sm:text-5xl font-light text-brand-text leading-snug mb-6">
          This page wandered off.
        </h1>

        <p className="text-brand-muted text-sm sm:text-base leading-relaxed max-w-md mb-10">
          The page you&rsquo;re looking for doesn&rsquo;t exist, or has moved. Let&rsquo;s get you back
          to the RootFlute world.
        </p>

        {/* Plain <a>, matching every other internal link on this site — a
            real full-page load, not client-side routing (see Navbar.tsx). */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          className="inline-flex items-center justify-center font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold bg-brand-gold text-brand-dark hover:bg-brand-gold-light px-8 py-4 text-base"
        >
          Return Home →
        </a>
      </main>
      <Footer />
    </>
  );
}
