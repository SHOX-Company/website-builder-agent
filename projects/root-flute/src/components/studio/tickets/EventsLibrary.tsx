"use client";

import { useState } from "react";
import { Plus, Ticket } from "lucide-react";
import type { EventItem } from "@/lib/event";
import PageHeader from "@/components/studio/ui/PageHeader";
import Card from "@/components/studio/ui/Card";
import EmptyState from "@/components/studio/ui/EmptyState";
import StudioButton from "@/components/studio/ui/Button";
import EventListCard from "@/components/studio/tickets/EventListCard";
import EventItemDrawer from "@/components/studio/tickets/EventItemDrawer";

export default function EventsLibrary({ initialEvents }: { initialEvents: EventItem[] }) {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  function openNewEvent() {
    setEditingEvent(null);
    setDrawerOpen(true);
  }

  function openEdit(event: EventItem) {
    setEditingEvent(event);
    setDrawerOpen(true);
  }

  function handleSaved(event: EventItem) {
    setEvents((prev) => {
      const exists = prev.some((e) => e.id === event.id);
      return exists ? prev.map((e) => (e.id === event.id ? event : e)) : [...prev, event];
    });
    setDrawerOpen(false);
  }

  function handleDeleted(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Tickets"
        title="Tickets"
        description="Upcoming performances and events shown on the public Tickets page."
        actions={
          <StudioButton onClick={openNewEvent} size="lg">
            <Plus className="w-4 h-4" strokeWidth={2} /> Add Event
          </StudioButton>
        }
      />

      {events.length === 0 ? (
        <Card padding="none">
          <EmptyState
            icon={Ticket}
            title="No events yet"
            description="Add the first event to see it appear here — and on the public Tickets page once published."
          >
            <StudioButton onClick={openNewEvent} className="mt-2">
              <Plus className="w-4 h-4" strokeWidth={2} /> Add Event
            </StudioButton>
          </EmptyState>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <EventListCard key={event.id} event={event} onEdit={() => openEdit(event)} />
          ))}
        </div>
      )}

      <EventItemDrawer
        open={drawerOpen}
        event={editingEvent}
        onClose={() => setDrawerOpen(false)}
        onSaved={handleSaved}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
