import SectionWrapper from "@/components/ui/SectionWrapper";

export default function JewelryPhilosophy() {
  return (
    <SectionWrapper tight className="bg-brand-surface">
      <div className="max-w-2xl mx-auto">

        {/* Top divider with gold accent */}
        <div className="flex items-center gap-4 mb-14">
          <div className="flex-1 h-px bg-brand-border" aria-hidden="true" />
          <span className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans">
            On Making
          </span>
          <div className="flex-1 h-px bg-brand-border" aria-hidden="true" />
        </div>

        {/* Philosophy statements */}
        <div className="flex flex-col gap-10">

          <div className="flex flex-col gap-3">
            <p className="font-display text-2xl sm:text-3xl font-light text-brand-text leading-snug">
              These pieces are not made to complete an outfit.
            </p>
            <p className="text-brand-muted text-sm leading-relaxed">
              They are made to carry something — an intention, a practice, a quality of attention
              that doesn't have a simpler form.
            </p>
          </div>

          <span aria-hidden="true" className="block w-px h-6 bg-brand-border self-center" />

          <div className="flex flex-col gap-3">
            <p className="font-display text-2xl sm:text-3xl font-light text-brand-text leading-snug">
              Each piece is worked once.
            </p>
            <p className="text-brand-muted text-sm leading-relaxed">
              The same material will not be gathered again. The same arrangement of stones
              will not occur again. Handmade means hand-singular — the hand that made this
              piece will never make this piece again.
            </p>
          </div>

          <span aria-hidden="true" className="block w-px h-6 bg-brand-border self-center" />

          <div className="flex flex-col gap-3">
            <p className="font-display text-2xl sm:text-3xl font-light text-brand-text leading-snug">
              The music and the adornment are the same practice.
            </p>
            <p className="text-brand-muted text-sm leading-relaxed">
              Sound passes through the body. Objects rest against it. Both — when made with
              intention — become a way of attending to what is real.
            </p>
          </div>

        </div>

        {/* Signature line */}
        <div className="mt-16 pt-10 border-t border-brand-border text-center">
          <p className="font-display text-xl italic text-brand-text/50">
            — Daniel
          </p>
        </div>

      </div>
    </SectionWrapper>
  );
}
