import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

// ─── Email configuration ────────────────────────────────────────────────────
//
// SETUP (one-time, ~5 minutes):
//
// 1. Sign up at https://resend.com  (free — 100 emails/day)
// 2. Copy your API key from the Resend dashboard
// 3. Vercel: Settings → Environment Variables → add RESEND_API_KEY
//
// Optional — branded sender address (instead of onboarding@resend.dev):
// 4. In Resend: add and verify rootflute.com
// 5. Set RESEND_FROM_EMAIL in Vercel env vars, e.g.:
//    "RootFlute Acquisitions <acquisitions@rootflute.com>"
//
// ────────────────────────────────────────────────────────────────────────────

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = "danraasch1@gmail.com";
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "RootFlute Acquisitions <onboarding@resend.dev>";

function buildEmailText(data: {
  name: string;
  email: string;
  instagram: string;
  piece: string;
  message: string;
}) {
  return [
    `New acquisition inquiry — rootflute.com/jewelry`,
    ``,
    `Piece:      ${data.piece || "General Inquiry"}`,
    ``,
    `Name:       ${data.name}`,
    `Email:      ${data.email}`,
    `Instagram:  ${data.instagram || "—"}`,
    ``,
    `Message:`,
    data.message?.trim() || "(no message provided)",
    ``,
    `—`,
    `Sent from the RootFlute jewelry acquisition form.`,
  ].join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name = "", email = "", instagram = "", piece = "", message = "" } = body;

    if (!name.trim() || !email.trim()) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    if (!RESEND_API_KEY) {
      // Graceful degradation — log inquiry server-side, return success to client.
      // The form UX is not blocked. Add RESEND_API_KEY to Vercel env vars to activate email.
      console.warn("[jewelry-inquiry] RESEND_API_KEY not configured — inquiry captured but not emailed.");
      console.info("[jewelry-inquiry]", JSON.stringify({ name, email, piece, instagram }));
      return NextResponse.json({ ok: true });
    }

    const resend = new Resend(RESEND_API_KEY);

    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `Jewelry Acquisition Inquiry — ${piece || "General"}`,
      text: buildEmailText({ name, email, instagram, piece, message }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Log internally but return success — never block the buyer's form UX on a send failure
    console.error("[jewelry-inquiry] Send error:", err);
    return NextResponse.json({ ok: true });
  }
}
