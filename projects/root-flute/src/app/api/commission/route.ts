import { NextRequest, NextResponse } from "next/server";
import { sendInquiryEmail } from "@/lib/email";
import { checkRateLimit, isHoneypot } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const { allowed } = checkRateLimit(req, "inquiry");
  if (!allowed) {
    return NextResponse.json({ ok: true });
  }

  let body: Record<string, string> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (isHoneypot(body)) {
    return NextResponse.json({ ok: true });
  }

  const {
    name = "",
    email = "",
    phone = "",
    instagram = "",
    budget = "",
    intendedUse = "",
    notes = "",
  } = body;

  if (!name.trim() || !email.trim()) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  if (!budget.trim() || budget === "Select a range") {
    return NextResponse.json({ error: "Budget range is required." }, { status: 400 });
  }

  await sendInquiryEmail({
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    instagram: instagram.trim(),
    message: notes.trim(),
    product: "Custom Commission",
    source: "rootflute.com",
    formType: "Commission Application",
    extraFields: {
      "Budget":       budget.trim(),
      "Intended Use": intendedUse.trim() || "—",
    },
  });

  return NextResponse.json({ ok: true });
}
