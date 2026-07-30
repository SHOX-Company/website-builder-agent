import type { Testimonial } from "@/lib/testimonials";

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="break-inside-avoid mb-8 border border-brand-border bg-brand-surface p-8 sm:p-9 flex flex-col gap-6">
      <span
        aria-hidden="true"
        className="font-display text-5xl leading-none text-brand-gold/30"
      >
        “
      </span>

      <p className="font-display italic text-lg sm:text-xl text-brand-text/85 leading-relaxed -mt-4">
        {testimonial.quote}
      </p>

      <div className="pt-4 border-t border-brand-border/60">
        <p className="text-brand-gold text-xs uppercase tracking-[0.25em] font-sans">
          {testimonial.author}
          {testimonial.location && (
            <span className="text-brand-muted/60"> &nbsp;·&nbsp; {testimonial.location}</span>
          )}
        </p>
      </div>
    </div>
  );
}
