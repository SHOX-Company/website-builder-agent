import { NextRequest, NextResponse } from "next/server";
import { getEventItem, updateEvent, deleteEvent } from "@/lib/eventStore";
import type { EventItemInput } from "@/lib/event";

const PATCHABLE_KEYS: (keyof EventItemInput)[] = [
  "title",
  "description",
  "price",
  "location",
  "date",
  "posterImage",
  "published",
];

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getEventItem(id);
  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });

  if (typeof body.title === "string" && body.title.trim().length === 0) {
    return NextResponse.json({ error: "Event title cannot be empty." }, { status: 400 });
  }

  const patch: Partial<EventItemInput> = {};
  for (const key of PATCHABLE_KEYS) {
    if (key in body) {
      patch[key] = body[key];
    }
  }
  if (typeof patch.title === "string") patch.title = patch.title.trim();
  if (typeof patch.description === "string") patch.description = patch.description.trim();
  if (typeof patch.price === "string") patch.price = patch.price.trim();
  if (typeof patch.location === "string") patch.location = patch.location.trim();
  if (typeof patch.date === "string") {
    patch.date = patch.date.trim().length > 0 ? patch.date.trim() : null;
  }

  const item = await updateEvent(id, patch);
  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ item });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = await deleteEvent(id);
  if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
