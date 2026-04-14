import SectionWrapper from "@/components/ui/SectionWrapper";

const statements = [
  "You've followed Dan for years and feel called to go deeper.",
  "You play flute — or are beginning — and want direct feedback and community.",
  "Sound healing is a serious practice for you, not a hobby.",
  "You want access to live sessions, not just recorded content.",
  "You're drawn to the intersection of music, ceremony, and presence.",
  "You take your craft seriously and want to be around others who do too.",
];

export default function WhoIsItFor() {
  return (
    <SectionWrapper className="bg-brand-dark">
      <div className="max-w-2xl mx-auto">

        <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-10 text-center">
          This Is For You If...
        </p>

        <ul className="flex flex-col gap-5">
          {statements.map((statement) => (
            <li
              key={statement}
              className="font-display text-xl sm:text-2xl font-light text-brand-text leading-snug border-l-2 border-brand-gold/30 pl-6"
            >
              {statement}
            </li>
          ))}
        </ul>

      </div>
    </SectionWrapper>
  );
}
