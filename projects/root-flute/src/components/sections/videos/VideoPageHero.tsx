interface VideoPageHeroProps {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  count: number;
}

export default function VideoPageHero({ eyebrow, title, accent, description, count }: VideoPageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-brand-dark pt-36 sm:pt-44 pb-20 sm:pb-24">
      {/* Ambient depth layers — same atmospheric language as the rest of the site */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(196,151,58,0.06),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(45,74,62,0.18),transparent)] animate-ambient-drift"
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-5">
        <p className="text-brand-gold text-xs uppercase tracking-[0.35em] font-sans">
          {eyebrow}
        </p>

        <h1 className="font-display font-light text-brand-text text-5xl sm:text-6xl md:text-7xl leading-[1.02]">
          {title} <span className="italic text-brand-gold">{accent}</span>
        </h1>

        <div
          aria-hidden="true"
          className="w-10 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent my-2"
        />

        <p className="text-brand-muted text-base leading-relaxed max-w-xl">
          {description}
        </p>

        <p className="text-brand-muted/50 text-xs uppercase tracking-[0.3em] font-sans mt-2">
          {count} {count === 1 ? "video" : "videos"}
        </p>
      </div>
    </section>
  );
}
