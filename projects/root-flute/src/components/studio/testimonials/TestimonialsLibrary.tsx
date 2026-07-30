"use client";

import { useState } from "react";
import { Plus, Quote } from "lucide-react";
import type { TestimonialItem } from "@/lib/testimonial";
import PageHeader from "@/components/studio/ui/PageHeader";
import Card from "@/components/studio/ui/Card";
import EmptyState from "@/components/studio/ui/EmptyState";
import StudioButton from "@/components/studio/ui/Button";
import TestimonialListCard from "@/components/studio/testimonials/TestimonialListCard";
import TestimonialItemDrawer from "@/components/studio/testimonials/TestimonialItemDrawer";

export default function TestimonialsLibrary({ initialTestimonials }: { initialTestimonials: TestimonialItem[] }) {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);

  function openNewTestimonial() {
    setEditingTestimonial(null);
    setDrawerOpen(true);
  }

  function openEdit(testimonial: TestimonialItem) {
    setEditingTestimonial(testimonial);
    setDrawerOpen(true);
  }

  function handleSaved(testimonial: TestimonialItem) {
    setTestimonials((prev) => {
      const exists = prev.some((t) => t.id === testimonial.id);
      return exists ? prev.map((t) => (t.id === testimonial.id ? testimonial : t)) : [...prev, testimonial];
    });
    setDrawerOpen(false);
  }

  function handleDeleted(id: string) {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Testimonials"
        title="Testimonials"
        description="Every testimonial shown on the public Testimonials page."
        actions={
          <StudioButton onClick={openNewTestimonial} size="lg">
            <Plus className="w-4 h-4" strokeWidth={2} /> Add Testimonial
          </StudioButton>
        }
      />

      {testimonials.length === 0 ? (
        <Card padding="none">
          <EmptyState
            icon={Quote}
            title="No testimonials yet"
            description="Add the first testimonial to see it appear here — and on the public Testimonials page once published."
          >
            <StudioButton onClick={openNewTestimonial} className="mt-2">
              <Plus className="w-4 h-4" strokeWidth={2} /> Add Testimonial
            </StudioButton>
          </EmptyState>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((testimonial) => (
            <TestimonialListCard
              key={testimonial.id}
              testimonial={testimonial}
              onEdit={() => openEdit(testimonial)}
            />
          ))}
        </div>
      )}

      <TestimonialItemDrawer
        open={drawerOpen}
        testimonial={editingTestimonial}
        onClose={() => setDrawerOpen(false)}
        onSaved={handleSaved}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
