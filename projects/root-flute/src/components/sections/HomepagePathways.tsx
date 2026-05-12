import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";

const PATHWAYS = [
  {
    href: "/society",
    eyebrow: "Community",
    name: "The RuteFlute Society",
    description:
      "A private space for the people who feel the music. Live sound journeys. Real conversation. Founding seats open now.",
    cta: "Join the Society →",
    accent: "Founding seats · $35/month · Live twice monthly",
    imageSrc: "/images/og-community.jpg",
    imageAlt: "Daniel playing ceremonial flute in sacred sound journey",
    variant: "gold" as const,
  },
  {
    href: "/flutes",
    eyebrow: "Instruments",
    name: "Handcrafted Flutes",
    description:
      "One-of-one ceremonial instruments built from ancient materials. Each one carved by hand. None repeated.",
    cta: "View Current Offering →",
    accent: "Rare materials · One of one · Handcarved",
    imageSrc: "/images/og-flutes.jpg",
    imageAlt: "Daniel on dock holding rare antler flute — mountains and lake backdrop",
    variant: "neutral" as const,
  },
  {
    href: "/jewelry",
    eyebrow: "Adornment",
    name: "Ceremonial Jewelry",
    description:
      "Three pieces. Each handcrafted, each unrepeatable. Worn by those who carry the practice into their body.",
    cta: "View the Collection →",
    accent: "Three pieces · Ceremonial · Inquire directly",
    imageSrc: "/images/jewelry/pearl-of-vision-1.png",
    imageAlt: "Pearl of Vision — handcrafted ceremonial adornment",
    variant: "neutral" as const,
  },
  {
    href: "/instruments",
    eyebrow: "Sacred Craft",
    name: "Ceremonial Instruments",
    description:
      "Six handcrafted instruments — each made once, played for a lifetime. Violin. Cello. Lyre. Harp. Guitar. And the singular Shellivarious.",
    cta: "View the Instruments →",
    accent: "Six pieces · Ceremonial · One of one",
    imageSrc: "/images/instruments/instruments-hero.png",
    imageAlt: "RootFlute ceremonial instruments — handcrafted sacred collection",
    variant: "neutral" as const,
  },
];

export default function HomepagePathways() {
  return (
    <SectionWrapper className="bg-brand-dark">
      <div id="pathways" className="scroll-mt-20 sm:scroll-mt-24" />

      {/* Section label */}
      <div className="text-center mb-16">
        <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
          Four Pathways
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
            className={`group relative flex flex-col overflow-hidden border transition-all duration-300 focus-visible:outline-2 focus-visible:outline-brand-gold ${
              p.variant === "gold"
                ? "border-brand-gold/60 hover:border-brand-gold shadow-[0_0_40px_rgba(196,151,58,0.06)] hover:shadow-[0_0_60px_rgba(196,151,58,0.12)]"
                : "border-brand-border hover:border-brand-gold/40"
            }`}
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-brand-surface">
              <Image
                src={p.imageSrc}
                alt={p.imageAlt}
                fill
                unoptimized
                className="object-cover object-center opacity-60 group-hover:opacity-75 transition-opacity duration-500 group-hover:scale-[1.03] transition-transform"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/30 to-transparent"
              />
              {/* Eyebrow on image */}
              <div className="absolute top-5 left-5">
                <span
                  className={`text-xs font-sans uppercase tracking-[0.25em] ${
                    p.variant === "gold" ? "text-brand-gold" : "text-brand-muted"
                  }`}
                >
                  {p.eyebrow}
                </span>
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
                <span
                  className={`text-sm font-semibold transition-colors duration-200 ${
                    p.variant === "gold"
                      ? "text-brand-gold group-hover:text-brand-gold-light"
                      : "text-brand-text/70 group-hover:text-brand-gold"
                  }`}
                >
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
