import SectionWrapper from "@/components/ui/SectionWrapper";

const testimonials = [
  {
    quote:
      "Linking 'release' with the vortex-like sound of his gong, Daniel gently encouraged me not to get caught up on the particular words. As the sound amplified, I felt waves of heavier breathing from those around me. I cried and something purged from my body. The sonic atmosphere was enveloping — I envisioned a black hole approaching, infinitely vast, capable of taking in whatever I released into it. The flutes were particularly emotive and I was blissfully taken on a journey to an unknown destination. A blend of artistry and wizardry, music and emotional release.",
    name: "Matthew Ecklund, San Francisco",
  },
  {
    quote:
      "What followed was out of myself and out of this world. The sound filled my being and carried me off and away. The rising music lifted me through jungles up to mountains — in moments of reprieve I could fly above it all. I began to see a small version of myself, made of light in the distance. As the music progressed so too did visions, until the figure overlapped my being. I became it. An outer body experience. Sitting back up, I felt unblocked. Tears came. An excellent experience that left me feeling positive and uplifted.",
    name: "Stuart Clayton",
  },
  {
    quote:
      "Daniel's Sound Journey gifted me 2 hours of clarity — a glimpse into my divine purpose here on earth. I felt the essence of my ultimate existence unfolding. In those moments I felt so purely contented, connected, and joyful that I started to cry. I saw myself in the company of loved ones — we were all supporting one another, loving ourselves and our community so purely and deeply. The giving and receiving between us flowed forth abundantly. Lack was no more. We were all at peace, happy, and free.",
    name: "Mia, Tempe AZ",
  },
];

export default function Testimonials() {
  return (
    <SectionWrapper className="bg-brand-surface-2">

      <div className="text-center mb-14">
        <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
          From the Community
        </p>
        <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text">
          What members say.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="bg-brand-surface border border-brand-border p-8 sm:p-10 flex flex-col gap-6"
          >
            <blockquote className="font-display text-lg font-light italic text-brand-text leading-relaxed flex-1">
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            <div className="border-t border-brand-border pt-5">
              <span className="text-brand-muted text-xs uppercase tracking-widest font-sans">{t.name}</span>
            </div>
          </div>
        ))}
      </div>

    </SectionWrapper>
  );
}
