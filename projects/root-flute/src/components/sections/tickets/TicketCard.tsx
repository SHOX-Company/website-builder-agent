import Button from "@/components/ui/Button";
import type { TicketEvent } from "@/lib/tickets";

export default function TicketCard({ event }: { event: TicketEvent }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border border-brand-border bg-brand-surface p-7 sm:p-8">
      <div className="flex flex-col gap-2">
        <p className="text-brand-gold text-xs uppercase tracking-[0.25em] font-sans">
          {event.date} &nbsp;·&nbsp; {event.type}
        </p>
        <h3 className="font-display text-2xl sm:text-3xl font-light text-brand-text">
          {event.location}
        </h3>
        {event.description && (
          <p className="text-brand-muted text-sm leading-relaxed mt-1 max-w-lg">
            {event.description}
          </p>
        )}
      </div>

      {event.ticketUrl && (
        <Button
          href={event.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          size="sm"
          className="flex-shrink-0 self-start sm:self-auto"
        >
          Get Tickets →
        </Button>
      )}
    </div>
  );
}
