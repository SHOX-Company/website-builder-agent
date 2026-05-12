import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = "danraasch1@gmail.com";
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ??
  "RootFlute Acquisitions <onboarding@resend.dev>";

function buildEmailText(data: Record<string, string>): string {
  return [
    `New Instrument Acquisition Inquiry`,
    ``,
    `Name:       ${data.name || "—"}`,
    `Email:      ${data.email || "—"}`,
    `Instagram:  ${data.instagram || "—"}`,
    `Instrument: ${data.item || "—"}`,
    ``,
    `Message:`,
    data.message || "(no message)",
  ].join("\n");
}

export async function POST(req: NextRequest) {
  let data: Record<string, string> = {};
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  if (!RESEND_API_KEY) {
    console.log("[instruments-inquiry] No RESEND_API_KEY — logging inquiry:", data);
    return NextResponse.json({ ok: true });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `Instrument Acquisition Inquiry — ${data.item || "Instrument"}`,
      text: buildEmailText(data),
    });
  } catch (err) {
    console.error("[instruments-inquiry] Resend error:", err);
  }

  return NextResponse.json({ ok: true });
}
