import SectionWrapper from "@/components/ui/SectionWrapper";

const reasons = [
  {
    number: "01",
    heading: "Ancient Materials",
    body: "Woolly Mammoth tusk preserved beneath Arctic permafrost for 10,000+ years. No forest. No farm. No factory. A material the world stopped producing when the ice age ended.",
  },
  {
    number: "02",
    heading: "One of One",
    body: "Each flute is carved from a single piece. When it is finished, that piece of tusk is gone forever. There is no second edition. No restock. No replica. There is only this one.",
  },
  {
    number: "03",
    heading: "Hand-Tuned Resonance",
    body: "Daniel spends weeks tuning each instrument by hand — bore, tone holes, mouthpiece — until the voice of the flute is exactly right. Not measured by machine. Felt.",
  },
  {
    number: "04",
    heading: "Twenty Years of Mastery",
    body: "Over two decades and 100+ instruments, Daniel has become more attuned to the material with each build. You are not buying a flute. You are receiving the culmination of a practice.",
  },
  {
    number: "05",
    heading: "Ceremonial Energy",
    body: "These instruments are built with intention. Played in healing circles, ceremonies, and private practices across the world. The energy of that work lives in the object.",
  },
  {
    number: "06",
    heading: "Impossible to Replicate",
    body: "No CNC. No mold. No template. The shape of every piece is determined by the tusk itself. Even Daniel cannot make another one the same. When it finds its owner — it is home.",
  },
];

export default function WhyDifferent() {
  return (
    <SectionWrapper className="bg-brand-surface">

      <div className="text-center mb-16">
        <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
          Why These Are Different
        </p>
        <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text">
          Not instruments.
          <br />
          <span className="italic">Artifacts.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-brand-border">
        {reasons.map((r) => (
          <div key={r.number} className="bg-brand-surface p-10 flex flex-col gap-4">
            <span className="text-brand-gold/50 font-sans text-xs uppercase tracking-widest">
              {r.number}
            </span>
            <h3 className="font-display text-2xl font-light text-brand-text">
              {r.heading}
            </h3>
            <p className="text-brand-muted text-sm leading-relaxed">
              {r.body}
            </p>
          </div>
        ))}
      </div>

    </SectionWrapper>
  );
}
