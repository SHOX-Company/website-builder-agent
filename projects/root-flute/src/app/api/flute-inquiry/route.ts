import { NextRequest, NextResponse } from "next/server";
import { sendInquiryEmail } from "@/lib/email";
import { checkRateLimit, isHoneypot } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const { allowed } = checkRateLimit(req, "inquiry");
  if (!allowed) {
    return NextResponse.json({ ok: true }); // silently drop rate-limited requests
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

  const { name = "", email = "", phone = "", instagram = "", item = "", message = "" } = body;

  if (!name.trim() || !email.trim()) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  await sendInquiryEmail({
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    instagram: instagram.trim(),
    message: message.trim(),
    product: item.trim() || "Woolly Mammoth Tusk Flute",
    source: "rootflute.com/flutes",
    formType: "Flute Acquisition Inquiry",
  });

  return NextResponse.json({ ok: true });
}
