import { NextRequest, NextResponse } from "next/server";
import { getContactPage, updateContactPage } from "@/lib/contactPageStore";
import type { ContactPageContent } from "@/lib/contactPage";

export async function GET() {
  const content = await getContactPage();
  return NextResponse.json({ content });
}

const PATCHABLE_KEYS: (keyof ContactPageContent)[] = ["email", "phone", "whatsapp"];

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });

  const patch: Partial<ContactPageContent> = {};
  for (const key of PATCHABLE_KEYS) {
    if (key in body && typeof body[key] === "string") {
      patch[key] = body[key].trim();
    }
  }

  const content = await updateContactPage(patch);
  return NextResponse.json({ content });
}
