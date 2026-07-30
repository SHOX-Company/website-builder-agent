import { Pencil } from "lucide-react";
import type { EventItem } from "@/lib/event";

export default function EventListCard({
  event,
  onEdit,
}: {
  event: EventItem;
  onEdit: () => void;
}) {
  return (
    <div className="flex flex-col bg-brand-surface border border-brand-border rounded-lg overflow-hidden">
      <div className="relative aspect-video bg-brand-dark">
        {event.posterImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.posterImage.url} alt={event.posterImage.alt} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="flex flex-col gap-1 p-4">
        <h3 className="text-brand-text text-sm font-medium font-sans truncate">{event.title}</h3>
        {event.date && <p className="text-brand-muted text-xs font-sans truncate">{event.date}</p>}
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
