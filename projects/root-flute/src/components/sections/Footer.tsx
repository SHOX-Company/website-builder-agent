export default function Footer() {
  return (
    <footer className="bg-brand-surface border-t border-brand-border py-14">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-8 text-center">

        <a href="/" className="font-display text-2xl font-normal text-brand-text hover:text-brand-gold transition-colors duration-200">
          Root<span className="text-brand-gold">Flute</span>
        </a>

        <p className="text-brand-muted text-xs uppercase tracking-widest">
          Resonant Sound &nbsp;·&nbsp; Handcrafted Instruments &nbsp;·&nbsp; Rare Adornment
        </p>

        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 items-center" aria-label="Footer navigation">
          <a
            href="/society"
            className="text-brand-muted hover:text-brand-gold text-sm transition-colors duration-200"
          >
            The Society
          </a>
          <a
            href="/flutes"
            className="text-brand-muted hover:text-brand-gold text-sm transition-colors duration-200"
          >
            Instruments
          </a>
          <a
            href="/jewelry"
            className="text-brand-muted hover:text-brand-gold text-sm transition-colors duration-200"
          >
            Jewelry
          </a>
          <a
            href="https://instagram.com/rootflute"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-muted hover:text-brand-text text-sm transition-colors duration-200"
          >
            Instagram
          </a>
        </nav>

        <p className="text-brand-muted text-xs">
          © 2026 RootFlute. All rights reserved.
        </p>

      </div>
    </footer>
  );
}
