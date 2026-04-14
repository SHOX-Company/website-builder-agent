import SectionWrapper from "@/components/ui/SectionWrapper";
import Button from "@/components/ui/Button";
import Image from "next/image";

export default function Flutes() {
  return (
    <SectionWrapper className="bg-brand-surface-2">

      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
          Rare Instruments
        </p>
        <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text mb-6">
          Flutes are born, not made.
        </h2>
        <p className="text-brand-muted text-base leading-relaxed max-w-2xl mx-auto">
          Each instrument is handcrafted by Dan — one at a time. They are released as drops,
          not in a permanent shop. When one is ready, it finds its owner. Circle members
          receive access before anyone else.
        </p>
      </div>

      {/* Featured flute — cinematic two-column reveal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 border border-brand-border overflow-hidden">

        {/* Left: media panel — still image with optional video overlay */}
        <div className="relative aspect-[3/4] lg:aspect-auto min-h-[500px] overflow-hidden bg-brand-dark">

          {/*
            PRIMARY: Still image of the flute.
            Drop file: /public/images/flute-obsidian-condor.jpg
            Aspect: portrait (3:4 or taller) — close-up, dramatic, dark background.
          */}
          <Image
            src="/images/flute-obsidian-condor.svg"
            alt="The Obsidian Condor — handcrafted cedar flute by Dan"
            fill
            unoptimized
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={false}
          />

          {/* Subtle dark gradient at bottom edge — blends into the panel seam */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 inset-x-0 z-[2] h-20 bg-gradient-to-t from-brand-surface/60 to-transparent"
          />
        </div>

        {/* Right: story */}
        <div className="bg-brand-surface p-10 lg:p-14 flex flex-col justify-between gap-10">

          <div className="flex flex-col gap-4">
            <p className="text-brand-gold text-xs uppercase tracking-widest font-sans">
              Current Drop
            </p>

            <h3 className="font-display text-4xl sm:text-5xl font-light text-brand-text leading-tight">
              The Obsidian Condor
            </h3>

            <p className="text-brand-muted text-xs uppercase tracking-widest">
              Key of A &nbsp;·&nbsp; Old-Growth Cedar &nbsp;·&nbsp; Low Register
            </p>

            <p className="text-brand-muted text-sm leading-relaxed mt-2">
              Carved from a single piece of 200-year-old cedar, with obsidian inlay at the
              mouthpiece. Its voice sits deep in the chest — meditative, grounding,
              ceremonial. There is one. It will not be re-made.
            </p>

            <p className="text-brand-gold font-semibold text-lg mt-1">
              $15,000 – $22,000
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <span className="inline-block border border-brand-border text-brand-muted text-xs uppercase tracking-widest px-4 py-2 self-start">
              Available to Circle Members First &nbsp;·&nbsp; [Date TBD]
            </span>

            <Button href="#community" variant="secondary" className="self-start">
              Get Early Access Through The Circle →
            </Button>
          </div>

        </div>
      </div>

      {/* Below-fold note */}
      <p className="text-center text-brand-muted text-sm mt-10 max-w-lg mx-auto leading-relaxed">
        Past drops are not available. Future drops are announced to Circle members first.
        Join to be the first to know.
      </p>

    </SectionWrapper>
  );
}
