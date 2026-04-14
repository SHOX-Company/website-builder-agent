export default function SoundJourneys() {
  return (
    /*
      Raw <section> — SectionWrapper can't host a full-bleed video background
      because its inner div would cover it. Padding/container replicated manually.

      Video: /public/video/journey.mp4
        Ideal footage: slow nature ritual, hands on flute, smoke, water, forest.
        poster="/images/journey-poster.jpg" shows before playback begins.
    */
    <section className="relative overflow-hidden py-32">

      {/* === 1. Atmospheric base — shown while video loads === */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-brand-dark"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(45,74,62,0.25),transparent)] animate-ambient-drift"
      />

      {/* === 2. Looping ceremony video === */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/images/journey-poster.jpg"
        aria-hidden="true"
        className="absolute inset-0 z-[1] w-full h-full object-cover"
        src="/video/hero-web.mp4"
      />

      {/* === 3. Heavy overlay — content legibility over video === */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] bg-black/65"
      />

      {/* === 4. Top + bottom fades for seamless section blending === */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 z-[3] h-24 bg-gradient-to-b from-brand-dark to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 z-[3] h-24 bg-gradient-to-t from-brand-surface-2 to-transparent"
      />

      {/* === 5. Content === */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-10">

          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans">
            What You&apos;re Joining
          </p>

          <blockquote className="font-display text-xl sm:text-2xl md:text-3xl font-light italic text-brand-text leading-relaxed">
            &ldquo;A sound journey is not a performance. It is an invitation — into breath,
            tone, and the silence between notes. Every session is ceremonial: guided by
            intention, shaped by the instrument, held in community.&rdquo;
          </blockquote>

          <span aria-hidden="true" className="w-16 border-t border-brand-gold/40" />

          <p className="text-brand-muted text-base leading-relaxed max-w-xl">
            Every month, Dan leads a live sound journey for community members. These are not
            recordings you watch at your convenience. They are moments you enter — together,
            in real time. The flute as guide. Breath as practice. Presence as the whole point.
          </p>

        </div>
      </div>

    </section>
  );
}
