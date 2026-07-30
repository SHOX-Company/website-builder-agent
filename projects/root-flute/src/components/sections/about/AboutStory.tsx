import SectionWrapper from "@/components/ui/SectionWrapper";

export default function AboutStory({ copy }: { copy: string }) {
  const paragraphs = copy.split("\n\n").filter((p) => p.trim().length > 0);

  return (
    <SectionWrapper className="bg-brand-surface">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        {paragraphs.map((paragraph, i) => (
          <p key={i} className="text-brand-muted text-base leading-relaxed whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>
    </SectionWrapper>
  );
}
