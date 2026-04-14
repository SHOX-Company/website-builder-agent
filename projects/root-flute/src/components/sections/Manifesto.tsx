import SectionWrapper from "@/components/ui/SectionWrapper";

export default function Manifesto() {
  return (
    <SectionWrapper tight className="bg-brand-dark">
      <div className="max-w-xl mx-auto text-center flex flex-col items-center">

        <p className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-brand-text leading-snug">
          This is not a lesson platform.
        </p>

        <span aria-hidden="true" className="block w-px h-8 bg-brand-border my-6" />

        <p className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-brand-text leading-snug">
          This is not a content library.
        </p>

        <span aria-hidden="true" className="block w-px h-8 bg-brand-border my-6" />

        <p className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-brand-text leading-snug">
          This is proximity to the practice.
        </p>

      </div>
    </SectionWrapper>
  );
}
