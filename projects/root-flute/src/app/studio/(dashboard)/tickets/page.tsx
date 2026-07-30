import EventsLibrary from "@/components/studio/tickets/EventsLibrary";
import { getEvents } from "@/lib/eventStore";

export const dynamic = "force-dynamic";

export default async function StudioTicketsPage() {
  const events = await getEvents();
  return <EventsLibrary initialEvents={events} />;
}
