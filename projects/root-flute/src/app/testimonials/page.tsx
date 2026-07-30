// PROTECTED SOCIAL METADATA INFRASTRUCTURE — DO NOT MODIFY
// Metadata is managed centrally in src/lib/siteMetadata.ts.
import { buildPageMetadata } from "@/lib/siteMetadata";
import TestimonialCard from "@/components/sections/testimonials/TestimonialCard";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Footer from "@/components/sections/Footer";
import copy from "@/content/testimonials/testimonials.json";
import { getPublicTestimonials } from "@/lib/testimonialStore";

export const metadata = buildPageMetadata("testimonials");
export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const testimonials = await getPublicTestimonials();

  return (
    <main>
      <section className="relative overflow-hidden bg-brand-dark pt-36 sm:pt-44 pb-16 sm:pb-20">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(196,151,58,0.06),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(45,74,62,0.18),transparent)] animate-ambient-drift"
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-5">
          <p className="text-brand-gold text-xs uppercase tracking-[0.35em] font-sans">
            RootFlute
          </p>
          <h1 className="font-display font-light text-brand-text text-5xl sm:text-6xl md:text-7xl leading-[1.02]">
            {copy.heading.charAt(0) + copy.heading.slice(1).toLowerCase()}
          </h1>
          <div
            aria-hidden="true"
            className="w-10 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent my-2"
          />
          <p className="text-brand-muted/50 text-xs uppercase tracking-[0.3em] font-sans">
            {testimonials.length} stories
          </p>
        </div>
      </section>

      <SectionWrapper className="bg-brand-surface-2">
        <div className="max-w-5xl mx-auto columns-1 md:columns-2 gap-8">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard key={i} testimonial={testimonial} />
          ))}
        </div>
      </SectionWrapper>

      <Footer />
    </main>
  );
}
