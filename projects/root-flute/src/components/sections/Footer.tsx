export default function Footer() {
  return (
    <footer className="bg-brand-surface border-t border-brand-border py-14">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-6 text-center">

        <span className="font-display text-xl font-light text-brand-text">
          RootFlute
        </span>

        <p className="text-brand-muted text-xs uppercase tracking-widest">
          Sacred Sound. Handcrafted Instruments. Community.
        </p>

        <nav className="flex gap-8 items-center" aria-label="Footer navigation">
          <a
            href="https://instagram.com/rootflute"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-muted hover:text-brand-text text-sm transition-colors duration-200"
          >
            Instagram
          </a>
          <a
            href="#community"
            className="text-brand-muted hover:text-brand-gold text-sm transition-colors duration-200"
          >
            Join the Community
          </a>
        </nav>

        <p className="text-brand-muted text-xs">
          © 2026 RootFlute. All rights reserved.
        </p>

      </div>
    </footer>
  );
}
