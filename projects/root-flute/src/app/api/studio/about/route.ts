import { NextRequest, NextResponse } from "next/server";
import { getAboutPage, updateAboutPage } from "@/lib/aboutPageStore";
import type { AboutPageContent } from "@/lib/aboutPage";

export async function GET() {
  const content = await getAboutPage();
  return NextResponse.json({ content });
}

const PATCHABLE_KEYS: (keyof AboutPageContent)[] = ["copy", "heroImage"];

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });

  const patch: Partial<AboutPageContent> = {};
  for (const key of PATCHABLE_KEYS) {
    if (key in body) {
      patch[key] = body[key];
    }
  }
  if (typeof patch.copy === "string") patch.copy = patch.copy.trim();

  const content = await updateAboutPage(patch);
  return NextResponse.json({ content });
}
