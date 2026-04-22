import SectionWrapper from "@/components/ui/SectionWrapper";
import Image from "next/image";

const stats = [
  { value: "430k+", label: "Followers" },
  { value: "20+", label: "Years of the Craft" },
  { value: "100+", label: "Flutes Built" },
];

export default function Authority() {
  return (
    <SectionWrapper className="bg-brand-surface-2">
      {/*
        Accent container — relative + overflow-hidden keeps the node network
        strictly inside this section. Positioned in the upper-right negative
        space, above where the right-column text content begins.
      */}
      <div className="relative overflow-hidden">


      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Left: Dan's portrait — premium still image */}
        {/* Outer frame — gradient metallic gold border */}
        <div
          className="relative aspect-[3/4] w-full"
          style={{
            padding: "4px",
            background: "linear-gradient(145deg, rgba(196,151,58,0.90) 0%, rgba(196,151,58,0.35) 35%, rgba(120,90,25,0.55) 65%, rgba(196,151,58,0.80) 100%)",
            boxShadow: "0 0 0 1px rgba(196,151,58,0.18), 0 24px 72px rgba(0,0,0,0.85), 0 0 48px rgba(196,151,58,0.08)",
          }}
        >
          {/* Inner frame — dark inset border + image container */}
          <div
            className="relative w-full h-full overflow-hidden bg-brand-dark"
            style={{ boxShadow: "inset 0 0 0 1px rgba(196,151,58,0.22), inset 0 0 32px rgba(0,0,0,0.5)" }}
          >
            <Image
              src="/images/daniel-portrait.jpg"
              alt="Daniel — flute craftsman and sound healer"
              fill
              unoptimized
              className="object-cover object-[50%_48%]"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={false}
            />
            {/* Warm gold bloom — gives image a ceremonial glow */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_30%,rgba(196,151,58,0.07),transparent)] pointer-events-none"
            />
            {/* Bottom vignette — grounds the subject */}
            <div
              aria-hidden="true"
              className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-dark/60 to-transparent pointer-events-none"
            />
          </div>
        </div>

        {/* Right: story */}
        <div className="flex flex-col gap-6">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans">
            The Craftsman
          </p>

          <h2 className="font-display text-3xl sm:text-4xl font-light text-brand-text leading-snug">
            Daniel doesn&apos;t manufacture flutes. He listens for them.
          </h2>

          <p className="font-display text-xl font-light italic text-brand-text/80 leading-snug">
            Each instrument begins long before the first cut — in the material itself.
          </p>

          <p className="text-brand-muted text-base leading-relaxed">
            Daniel works with ancient Woolly Mammoth tusk and naturally shed elk antler — materials
            that carry time, pressure, and story within them.
            <br /><br />
            Nothing is forced into form. Each flute is shaped slowly, by hand, in response to
            what&apos;s already there — the density, the curve, the internal path the instrument
            wants to become.
            <br /><br />
            No two pieces are ever the same. What emerges isn&apos;t just an instrument, but a
            voice — tuned for depth, resonance, and presence.
          </p>

          {/* Stats */}
          <div className="flex gap-8 pt-4 border-t border-brand-border">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="font-display text-3xl font-light text-brand-gold">
                  {stat.value}
                </span>
                <span className="text-brand-muted text-xs uppercase tracking-widest">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
      </div> {/* end accent container */}
    </SectionWrapper>
  );
}
