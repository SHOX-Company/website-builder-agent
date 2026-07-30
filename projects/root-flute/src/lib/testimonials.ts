export interface Testimonial {
  quote: string;
  author: string;
  location: string | null;
}

export interface TestimonialsCopy {
  heading: string;
  testimonials: Testimonial[];
}
