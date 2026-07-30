// Shared Event types — safe to import from both server and client code.
//
// A flat list, ordered by insertion — no sub-collections, no manual
// reordering. Simple event announcements only — no ticket purchasing,
// checkout, or recurrence.

export interface EventImage {
  url: string;
  alt: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  date: string | null;
  posterImage: EventImage | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EventItemInput = Omit<EventItem, "id" | "createdAt" | "updatedAt">;
