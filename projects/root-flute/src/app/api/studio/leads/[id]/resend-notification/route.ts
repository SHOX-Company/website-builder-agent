import { NextRequest, NextResponse } from "next/server";
import { getLeads } from "@/lib/leadStore";
import { sendInternalInquiryNotification, formatInquiryTimestamp } from "@/lib/email";

// Studio-authenticated recovery mechanism — protected by the existing
// /api/studio/* middleware guard (STUDIO_SESSION_SECRET-verified cookie), so
// this introduces no new authentication surface and is never reachable
// without a Studio session. Redelivers the internal RootFlute notification
// for an EXISTING lead exactly as it would have looked on arrival, rendered
// with the lead's ORIGINAL submission time rather than "now". Deliberately
// touches lead storage in no way at all — no new lead is created, and the
// lead being redelivered is never mutated. There is no public route that
// accepts an arbitrary lead id; this is the only caller of
// sendInternalInquiryNotification outside sendInquiryEmail itself.
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const leads = await getLeads();
  const lead = leads.find((l) => l.id === id);
  if (!lead) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (!lead.name.trim() || !lead.email.trim()) {
    return NextResponse.json({ error: "This lead has no name/email on record — refusing to send." }, { status: 400 });
  }

  const result = await sendInternalInquiryNotification(
    {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      instagram: lead.instagram,
      message: lead.message,
      product: lead.product,
      source: lead.source,
      formType: lead.formType,
      extraFields: lead.extraFields ?? undefined,
    },
    { timestamp: formatInquiryTimestamp(lead.createdAt) }
  );

  if (!result.ok) {
    return NextResponse.json(
      { error: `Notification not sent (${result.reason ?? "unknown error"}).` },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true, id: result.id });
}
