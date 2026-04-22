import SectionWrapper from "@/components/ui/SectionWrapper";
import Button from "@/components/ui/Button";
import Image from "next/image";

const stats = [
  { value: "430k+", label: "Followers" },
  { value: "20+", label: "Years of Guidance" },
  { value: "Countless", label: "Lives Touched" },
];

const pullQuotes = [
  {
    quote: "I was gifted two hours of clarity — a glimpse into my divine purpose here on earth.",
    name: "Mia, Tempe AZ",
  },
  {
    quote: "I cried and something purged from my body. The sonic atmosphere was enveloping.",
    name: "Matthew Ecklund, San Francisco",
  },
  {
    quote: "An incredible blend of artistry and emotional release. I felt completely unblocked.",
    name: "Stuart Clayton",
  },
];

export default function Authority() {
  return (
    <SectionWrapper className="bg-brand-surface-2">
      <div className="relative overflow-hidden">

        {/* ── Two-column grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">

          {/* LEFT: Daniel's portrait — gold frame treatment preserved */}
          <div
            className="relative aspect-[3/4] w-full"
            style={{
              padding: "4px",
              background:
                "linear-gradient(145deg, rgba(196,151,58,0.90) 0%, rgba(196,151,58,0.35) 35%, rgba(120,90,25,0.55) 65%, rgba(196,151,58,0.80) 100%)",
              boxShadow:
                "0 0 0 1px rgba(196,151,58,0.18), 0 24px 72px rgba(0,0,0,0.85), 0 0 48px rgba(196,151,58,0.08)",
            }}
          >
            <div
              className="relative w-full h-full overflow-hidden bg-brand-dark"
              style={{
                boxShadow:
                  "inset 0 0 0 1px rgba(196,151,58,0.22), inset 0 0 32px rgba(0,0,0,0.5)",
              }}
            >
              <Image
                src="/images/daniel-portrait.jpg"
                alt="Daniel — sound healer and community guide"
                fill
                unoptimized
                className="object-cover object-[50%_48%]"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={false}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_30%,rgba(196,151,58,0.07),transparent)] pointer-events-none"
              />
              <div
                aria-hidden="true"
                className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-dark/60 to-transparent pointer-events-none"
              />
            </div>
          </div>

          {/* RIGHT: Community conversion copy */}
          <div className="flex flex-col gap-6 md:pt-4">

            <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans">
              The Experience
            </p>

            <h2 className="font-display text-3xl sm:text-4xl font-light text-brand-text leading-snug">
              People don&apos;t just attend.
              <br />
              They leave changed.
            </h2>

            <p className="font-display text-xl font-light italic text-brand-text/80 leading-snug">
              Thousands have experienced Daniel&apos;s sound journeys as moments of
              clarity, emotional release, healing, presence, and deep reconnection.
            </p>

            <div className="flex flex-col gap-4 text-brand-muted text-base leading-relaxed">
              <p>
                Members enter a private space where sound becomes medicine, stillness
                becomes guidance, and community becomes part of the healing.
              </p>
              <p>
                Every month, Daniel hosts live sound journeys and live Q&amp;A
                sessions designed to help members reset, reconnect, and go deeper
                into the practice.
              </p>
              <p className="font-display text-lg font-light italic text-brand-text/70">
                This is not passive content.
                <br />
                It is a living experience.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 pt-4 border-t border-brand-border">
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

        {/* ── Pull quotes strip ────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          {pullQuotes.map((pq) => (
            <div
              key={pq.name}
              className="bg-brand-surface border border-brand-border p-7 flex flex-col gap-4"
            >
              <blockquote className="font-display text-base font-light italic text-brand-text/85 leading-relaxed flex-1">
                &ldquo;{pq.quote}&rdquo;
              </blockquote>
              <span className="text-brand-gold text-xs uppercase tracking-widest font-sans border-t border-brand-border/50 pt-4">
                — {pq.name}
              </span>
            </div>
          ))}
        </div>

        {/* ── Section CTA ─────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-4">
          <Button href="#community" variant="primary" size="lg">
            Join the Community →
          </Button>
          <p className="text-brand-muted text-xs uppercase tracking-widest">
            Founding member pricing is limited.
          </p>
        </div>

      </div>
    </SectionWrapper>
  );
}
