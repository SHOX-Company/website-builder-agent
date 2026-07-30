import { NextRequest, NextResponse } from "next/server";
import { getTestimonialItem, updateTestimonial, deleteTestimonial } from "@/lib/testimonialStore";
import type { TestimonialItemInput } from "@/lib/testimonial";

const PATCHABLE_KEYS: (keyof TestimonialItemInput)[] = ["author", "location", "quote", "published"];

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getTestimonialItem(id);
  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });

  if (typeof body.author === "string" && body.author.trim().length === 0) {
    return NextResponse.json({ error: "Name cannot be empty." }, { status: 400 });
  }
  if (typeof body.quote === "string" && body.quote.trim().length === 0) {
    return NextResponse.json({ error: "Testimonial text cannot be empty." }, { status: 400 });
  }

  const patch: Partial<TestimonialItemInput> = {};
  for (const key of PATCHABLE_KEYS) {
    if (key in body) {
      patch[key] = body[key];
    }
  }
  if (typeof patch.author === "string") patch.author = patch.author.trim();
  if (typeof patch.quote === "string") patch.quote = patch.quote.trim();
  if (typeof patch.location === "string") {
    patch.location = patch.location.trim().length > 0 ? patch.location.trim() : null;
  }

  const item = await updateTestimonial(id, patch);
  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ item });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = await deleteTestimonial(id);
  if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
