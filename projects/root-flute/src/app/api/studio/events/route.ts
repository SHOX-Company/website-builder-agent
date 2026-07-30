import { NextRequest, NextResponse } from "next/server";
import { getEvents, createEvent } from "@/lib/eventStore";
import type { EventItemInput } from "@/lib/event";

export async function GET() {
  const items = await getEvents();
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });

  const { title, description, price, location, date, posterImage } = body;

  if (typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "Event title is required." }, { status: 400 });
  }

  const input: EventItemInput = {
    title: title.trim(),
    description: typeof description === "string" ? description.trim() : "",
    price: typeof price === "string" ? price.trim() : "",
    location: typeof location === "string" ? location.trim() : "",
    date: typeof date === "string" && date.trim().length > 0 ? date.trim() : null,
    posterImage: posterImage ?? null,
    published: body.published !== false,
  };

  const item = await createEvent(input);
  return NextResponse.json({ item }, { status: 201 });
}
