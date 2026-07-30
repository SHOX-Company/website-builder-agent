import { Pencil } from "lucide-react";
import type { TestimonialItem } from "@/lib/testimonial";

export default function TestimonialListCard({
  testimonial,
  onEdit,
}: {
  testimonial: TestimonialItem;
  onEdit: () => void;
}) {
  return (
    <div className="flex flex-col bg-brand-surface border border-brand-border rounded-lg overflow-hidden">
      <div className="flex flex-col gap-3 p-5">
        <div className="flex flex-col gap-0.5 min-w-0">
          <h3 className="text-brand-text text-sm font-medium font-sans truncate">{testimonial.author}</h3>
          {testimonial.location && (
            <p className="text-brand-muted text-xs font-sans truncate">{testimonial.location}</p>
          )}
        </div>
        <p className="text-brand-muted text-sm leading-relaxed line-clamp-3">{testimonial.quote}</p>
      </div>

      <div className="border-t border-brand-border mt-auto">
        <button
          type="button"
          onClick={onEdit}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-sans text-brand-muted hover:text-brand-gold hover:bg-brand-surface-2 transition-colors duration-150"
        >
          <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} /> Edit
        </button>
      </div>
    </div>
  );
}
