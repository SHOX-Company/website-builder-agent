import { NextRequest, NextResponse } from "next/server";
import { sendInquiryEmail } from "@/lib/email";
import { checkRateLimit, isHoneypot } from "@/lib/rateLimit";

// Customer-facing acquisition support / return-request intake. This is NOT a
// refund portal — it only routes a message to Daniel and saves a durable
// record. Reuses the existing inquiry infrastructure verbatim:
// sendInquiryEmail() notifies Daniel AND writes a durable lead backup to
// Blob. No Stripe, inventory, refund, or relist action is taken here.
const REQUEST_TYPES = [
  "Return Request",
  "Order Support",
  "Shipping Question",
  "Other",
];

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
    orderReference = "",
    item = "",
    requestType = "",
    message = "",
  } = body;

  if (!name.trim() || !email.trim()) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }
  if (!message.trim()) {
    return NextResponse.json({ error: "A message is required." }, { status: 400 });
  }
  if (!REQUEST_TYPES.includes(requestType)) {
    return NextResponse.json({ error: "Please choose a request type." }, { status: 400 });
  }

  await sendInquiryEmail({
    name: name.trim(),
    email: email.trim(),
    phone: "",
    instagram: "",
    message: message.trim(),
    product: item.trim() || "—",
    source: "rootflute.com/acquisition-support",
    formType: "Acquisition Support",
    extraFields: {
      "Request Type": requestType,
      "Order Reference": orderReference.trim() || "—",
    },
  });

  return NextResponse.json({ ok: true });
}
