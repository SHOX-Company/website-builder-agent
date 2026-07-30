import SectionWrapper from "@/components/ui/SectionWrapper";

// Renders immediately beneath the hero image: the "Craftsman" eyebrow and
// "Daniel Hansen" heading — previously overlaid on the hero image itself,
// now rendered as normal page content below it. The intro line that used to
// render here is now the opening paragraph of the Studio-editable About
// Copy, rendered by AboutStory just below this.
export default function AboutIntro({ heading }: { heading: string }) {
  return (
    <SectionWrapper tight className="bg-brand-dark">
      <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
        <p className="text-brand-gold text-xs uppercase tracking-[0.4em] font-sans">
          {heading}
        </p>

        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-light text-brand-text leading-none tracking-tight">
          Daniel Hansen
        </h1>

        <div
          aria-hidden="true"
          className="w-10 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent"
        />
      </div>
    </SectionWrapper>
  );
}
