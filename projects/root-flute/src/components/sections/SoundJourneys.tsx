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
        src="https://p2pvgplym6odmfbh.public.blob.vercel-storage.com/subhero-flute.mp4"
      />

      {/* === 3. Base overlay + stronger gradient behind text === */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] bg-black/60"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 z-[2] h-[55%] bg-gradient-to-t from-black/80 via-black/40 to-transparent"
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
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">

          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-6">
            What You&apos;re Joining
          </p>

          <p className="text-white font-sans text-base sm:text-lg font-normal leading-[1.85] max-w-xl mb-10">
            Every month, Daniel leads a live sound journey for community members.
            These are not recordings you watch at your convenience. They are moments
            you enter — together, in real time. The flute as guide. Breath as practice.
            Presence as the whole point.
          </p>

          <span aria-hidden="true" className="w-16 border-t border-brand-gold/40 mb-10" />

          <blockquote className="font-display text-xl sm:text-2xl md:text-3xl font-light italic text-white leading-relaxed">
            &ldquo;A sound journey is not a performance. It is an invitation into breath,
            tone, and the silence between notes. Every session is ceremonial, guided by
            intention, shaped by the instrument, held in community.&rdquo;
          </blockquote>

        </div>
      </div>

    </section>
  );
}
