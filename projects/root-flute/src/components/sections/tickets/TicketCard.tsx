import Image from "next/image";
import type { EventItem } from "@/lib/event";

export default function TicketCard({ event }: { event: EventItem }) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 border border-brand-border bg-brand-surface p-7 sm:p-8">
      {event.posterImage && (
        <div className="relative w-full sm:w-40 aspect-video sm:aspect-square flex-shrink-0 overflow-hidden rounded-sm">
          <Image
            src={event.posterImage.url}
            alt={event.posterImage.alt}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 160px"
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 flex-1">
        <div className="flex flex-col gap-2">
          <p className="text-brand-gold text-xs uppercase tracking-[0.25em] font-sans">
            {[event.date, event.location].filter(Boolean).join("  ·  ")}
          </p>
          <h3 className="font-display text-2xl sm:text-3xl font-light text-brand-text">
            {event.title}
          </h3>
          {event.description && (
            <p className="text-brand-muted text-sm leading-relaxed mt-1 max-w-lg">
              {event.description}
            </p>
          )}
        </div>

        {event.price && (
          <div className="flex flex-col gap-1.5 flex-shrink-0 self-start sm:self-auto">
            <p className="text-brand-muted/40 text-[10px] uppercase tracking-[0.25em] font-sans">
              Cost
            </p>
            <p className="font-display text-2xl font-light text-brand-text">
              {event.price}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
