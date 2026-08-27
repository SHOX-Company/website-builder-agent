import SectionWrapper from "@/components/ui/SectionWrapper";
import type { MusicCopy } from "@/lib/music";

export default function MusicStory({ copy }: { copy: MusicCopy }) {
  return (
    <SectionWrapper className="bg-brand-surface py-12 !pt-4">
      <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-5">
        <p className="text-brand-gold/70 text-xs uppercase tracking-[0.25em] font-sans">
          {copy.stats}
        </p>

        <h2 className="font-display italic text-2xl sm:text-3xl text-brand-text/90">
          {copy.albumTitle}
        </h2>

        <div className="flex flex-col gap-5">
          {copy.bio.map((paragraph, i) => (
            <p key={i} className="text-brand-muted text-sm sm:text-base leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <a
          href={copy.spotifyLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-surface-2 transition-colors font-sans text-sm uppercase tracking-wider rounded-sm mt-4"
        >
          {copy.spotifyLink.label}
        </a>
      </div>
    </SectionWrapper>
  );
}
