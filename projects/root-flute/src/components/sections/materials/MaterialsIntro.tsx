import SectionWrapper from "@/components/ui/SectionWrapper";

// Renders immediately beneath the hero image: the ROOTFLUTE label, the
// "Materials" heading, and the introductory copy — previously overlaid on
// the hero image itself, now rendered as normal page content below it.
export default function MaterialsIntro({ intro }: { intro: string }) {
  return (
    <SectionWrapper tight className="bg-brand-dark">
      <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
        <p className="text-brand-gold text-xs uppercase tracking-[0.4em] font-sans">
          RootFlute
        </p>

        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-light text-brand-text leading-none tracking-tight">
          Materials
        </h1>

        <div
          aria-hidden="true"
          className="w-10 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent"
        />

        <p className="text-brand-muted text-base sm:text-lg leading-relaxed max-w-lg">
          {intro}
        </p>
      </div>
    </SectionWrapper>
  );
}
