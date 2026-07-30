import { NextRequest, NextResponse } from "next/server";
import { getTestimonials, createTestimonial } from "@/lib/testimonialStore";
import type { TestimonialItemInput } from "@/lib/testimonial";

export async function GET() {
  const items = await getTestimonials();
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });

  const { author, location, quote } = body;

  if (typeof author !== "string" || author.trim().length === 0) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (typeof quote !== "string" || quote.trim().length === 0) {
    return NextResponse.json({ error: "Testimonial text is required." }, { status: 400 });
  }

  const input: TestimonialItemInput = {
    author: author.trim(),
    location: typeof location === "string" && location.trim().length > 0 ? location.trim() : null,
    quote: quote.trim(),
    published: body.published !== false,
  };

  const item = await createTestimonial(input);
  return NextResponse.json({ item }, { status: 201 });
}
