import TestimonialsLibrary from "@/components/studio/testimonials/TestimonialsLibrary";
import { getTestimonials } from "@/lib/testimonialStore";

export const dynamic = "force-dynamic";

export default async function StudioTestimonialsPage() {
  const testimonials = await getTestimonials();
  return <TestimonialsLibrary initialTestimonials={testimonials} />;
}
