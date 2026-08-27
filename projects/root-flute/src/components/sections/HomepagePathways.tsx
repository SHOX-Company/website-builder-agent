import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";

const PATHWAYS = [
  {
    href: "/society",
    eyebrow: "Community",
    name: "The RuteFlute Society",
    description:
      "Immersive sound journeys, conscious gathering, and guided experiences designed to reconnect you with presence, clarity, and emotional release.",
    cta: "Join the Society",
    accent: "Founding seats · $35/month · Live twice monthly",
    imageSrc: "/images/homepage-society.png",
    imageAlt: "Daniel playing handcrafted flute in an immersive sound journey",
    variant: "gold" as const,
    watermarkLine: "Gather in Resonance",
    imageObjectPosition: "center",
  },

  {
    href: "/music",
    eyebrow: "Music",
    name: "Live Sound Sessions",
    description:
      "Original songs, live looping sessions, and celestial soundscapes crafted to move the body and still the mind.",
    cta: "Listen to the Sessions",
    accent: "Original sessions · Studio & live · Streaming everywhere",
    imageSrc: "/images/homepage-music-2.png",
    imageAlt: "Daniel in the studio, headphones on, surrounded by handcrafted flutes and instruments",
    variant: "neutral" as const,
    watermarkLine: "Rhythm • Resonance • Release",
    imageObjectPosition: "center",
  },

  // Phase 2 (remaining): Available Now inserts here, before Flutes. The grid
  // below reflows automatically from array order/count, so no layout change
  // is needed to add it — just splice its object in at this position.

  {
    href: "/flutes",
    eyebrow: "Flutes",
    name: "Handcrafted Flutes",
    description:
      "Handcrafted, purpose-built flutes created to carry emotion, stillness, and the living spirit of sound.",
    cta: "View Current Offering",
    accent: "Rare materials · One of one · Handcarved",
    imageSrc: "/images/homepage-flutes.jpg",
    imageAlt: "Daniel on dock holding rare antler flute — mountains and lake backdrop",
    variant: "neutral" as const,
    watermarkLine: "Breath • Resonance • Craft",
    imageObjectPosition: "center",
  },
  {
    href: "/instruments",
    eyebrow: "Instruments",
    name: "Handcrafted Instruments",
    description:
      "Immersive handcrafted instruments designed for deep listening, movement, meditation, and sonic exploration.",
    cta: "View the Instruments",
    accent: "Six pieces · Handcrafted · One of one",
    imageSrc: "/images/instruments/instruments-hero.png",
    imageAlt: "RootFlute handcrafted instruments — rare one-of-one collection",
    variant: "neutral" as const,
    watermarkLine: "Sound • Ritual • Presence",
    imageObjectPosition: "center",
  },
  {
    href: "/jewelry",
    eyebrow: "Talismans",
    name: "Handcrafted Talismans",
    description:
      "Timeless, intentional pieces crafted from natural materials to embody beauty, symbolism, and intentional living.",
    cta: "View the Collection",
    accent: "Three pieces · Handcrafted · Inquire directly",
    imageSrc: "/images/homepage-talismans.png",
    imageAlt: "Pearl of Vision — handcrafted intentional adornment",
    variant: "neutral" as const,
    watermarkLine: "Rare Talismans",
    imageObjectPosition: "center",
  },
];

export default function HomepagePathways() {
  return (
    <SectionWrapper className="bg-brand-dark">
      <div id="pathways" className="scroll-mt-20 sm:scroll-mt-24" />

      {/* Section label */}
      <div className="text-center mb-16">
        <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
          Begin Your Journey
        </p>
        <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text">
          Where do you begin?
        </h2>
      </div>

      {/* Pathway cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PATHWAYS.map((p) => (
          <a
            key={p.href}
            href={p.href}
            className="group relative flex flex-col overflow-hidden border border-brand-gold/60 hover:border-brand-gold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-brand-gold shadow-[0_0_40px_rgba(196,151,58,0.06)] hover:shadow-[0_0_60px_rgba(196,151,58,0.12)]"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-brand-surface">
              <Image
                src={p.imageSrc}
                alt={p.imageAlt}
                fill
                className="object-cover opacity-72 group-hover:opacity-86 transition-opacity duration-500 group-hover:scale-[1.03] transition-transform"
                style={{ objectPosition: p.imageObjectPosition }}
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              {/* Bottom depth gradient */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-brand-dark/12 to-transparent pointer-events-none"
              />
              {/* Eyebrow on image */}
              <div className="absolute top-5 left-5 z-10">
                <span className="text-xs font-sans uppercase tracking-[0.25em] text-brand-gold">
                  {p.eyebrow}
                </span>
              </div>
              {/* Branded watermark — blur backdrop, one instance per card */}
              <div
                aria-hidden="true"
                className="absolute bottom-5 left-5 z-10 pointer-events-none"
              >
                <div className="absolute inset-[-12px] bg-black/30 blur-xl rounded-md" />
                <div className="relative flex flex-col gap-[3px]">
                  <span className="font-display text-[1.2rem] font-light leading-none text-white/62">
                    Root<span className="text-brand-gold/78">Flute</span>
                  </span>
                  <span className="text-[7.5px] font-sans uppercase tracking-[0.32em] text-white/50">
                    {p.watermarkLine}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 gap-5 p-8 bg-brand-surface">
              <h3 className="font-display text-3xl font-light text-brand-text leading-tight">
                {p.name}
              </h3>

              <p className="text-brand-muted text-sm leading-relaxed flex-1">
                {p.description}
              </p>

              <div className="flex flex-col gap-3 pt-2 border-t border-brand-border">
                <p className="text-brand-muted/50 text-xs font-sans uppercase tracking-widest">
                  {p.accent}
                </p>
                <span className="text-sm font-semibold transition-colors duration-200 text-brand-gold group-hover:text-brand-gold-light">
                  {p.cta}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Closing line */}
      <p className="text-center font-display text-2xl sm:text-3xl font-light italic text-brand-text/40 tracking-wide mt-20 max-w-2xl mx-auto leading-snug">
        Sound passes through the body. Objects rest against it.
        <br />
        Both — made with intention — become a practice.
      </p>

    </SectionWrapper>
  );
}
