// Shared Testimonial types — safe to import from both server and client
// code.
//
// A flat, ordered-by-insertion list — no sub-collections, no reordering.

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  location: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TestimonialItemInput = Omit<TestimonialItem, "id" | "createdAt" | "updatedAt">;
