import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = "danraasch1@gmail.com";
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "RootFlute Acquisitions <onboarding@resend.dev>";

function buildEmailText(data: {
  name: string;
  email: string;
  instagram: string;
  item: string;
  message: string;
}) {
  return [
    `New flute acquisition inquiry — rootflute.com/flutes`,
    ``,
    `Instrument:  ${data.item || "Woolly Mammoth Tusk Flute"}`,
    ``,
    `Name:        ${data.name}`,
    `Email:       ${data.email}`,
    `Instagram:   ${data.instagram || "—"}`,
    ``,
    `Message:`,
    data.message?.trim() || "(no message provided)",
    ``,
    `—`,
    `Sent from the RootFlute flute acquisition form.`,
  ].join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name = "", email = "", instagram = "", item = "", message = "" } = body;

    if (!name.trim() || !email.trim()) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    if (!RESEND_API_KEY) {
      console.warn("[flute-inquiry] RESEND_API_KEY not configured — inquiry captured but not emailed.");
      console.info("[flute-inquiry]", JSON.stringify({ name, email, item, instagram }));
      return NextResponse.json({ ok: true });
    }

    const resend = new Resend(RESEND_API_KEY);

    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `Flute Acquisition Inquiry — ${item || "Woolly Mammoth Tusk Flute"}`,
      text: buildEmailText({ name, email, instagram, item, message }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[flute-inquiry] Send error:", err);
    return NextResponse.json({ ok: true });
  }
}
