import { Resend } from "resend";
import { saveLead } from "@/lib/leadStore";
import { SITE_URL } from "@/lib/siteMetadata";

export interface InquiryPayload {
  name: string;
  email: string;
  phone?: string;
  instagram?: string;
  message?: string;
  product: string;
  source: string;
  formType: string;
  extraFields?: Record<string, string>;
}

const TO_EMAIL = "danraasch1@gmail.com";
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "RootFlute Acquisitions <onboarding@resend.dev>";

function formatTimestamp(): string {
  return new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "full",
    timeStyle: "short",
  });
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildEmailHtml(payload: InquiryPayload, timestamp: string): string {
  const rows: [string, string][] = [
    ["Product / Item", payload.product || "—"],
    ["Full Name", payload.name],
    ["Email", payload.email],
    ["Phone", payload.phone || "—"],
    ["Instagram", payload.instagram ? `@${payload.instagram.replace(/^@/, "")}` : "—"],
    ...(payload.extraFields ? (Object.entries(payload.extraFields) as [string, string][]) : []),
    ["Source", payload.source],
    ["Submitted", timestamp],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:8px 16px 8px 0;color:#9a8a6a;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;white-space:nowrap;vertical-align:top;font-family:Arial,sans-serif;">${esc(label)}</td>
        <td style="padding:8px 0;color:#e8e0d0;font-size:14px;vertical-align:top;font-family:Georgia,serif;">${esc(value)}</td>
      </tr>`
    )
    .join("");

  const messageBlock = payload.message?.trim()
    ? `
    <tr>
      <td colspan="2" style="padding:20px 0 0;">
        <p style="margin:0 0 8px;color:#9a8a6a;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;font-family:Arial,sans-serif;">Message</p>
        <p style="margin:0;color:#e8e0d0;font-size:14px;line-height:1.7;white-space:pre-wrap;font-family:Georgia,serif;">${esc(payload.message.trim())}</p>
      </td>
    </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0d0d0b;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0d0d0b;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background:#141410;border:1px solid #2a2820;">
        <tr><td style="height:2px;background:linear-gradient(90deg,transparent,#c8a45a,transparent);font-size:0;">&nbsp;</td></tr>
        <tr>
          <td style="padding:32px 32px 24px;border-bottom:1px solid #2a2820;">
            <p style="margin:0 0 10px;color:#c8a45a;font-size:10px;text-transform:uppercase;letter-spacing:0.3em;font-family:Arial,sans-serif;">${esc(payload.formType)}</p>
            <p style="margin:0;color:#e8e0d0;font-size:22px;font-weight:300;font-family:Georgia,serif;">${esc(payload.name)}</p>
            <p style="margin:6px 0 0;color:#6b6356;font-size:12px;font-family:Arial,sans-serif;">${esc(payload.email)}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              ${rowsHtml}
              ${messageBlock}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 28px;border-top:1px solid #2a2820;">
            <p style="margin:0;color:#4a4336;font-size:11px;font-family:Arial,sans-serif;">
              Sent from the RootFlute ${esc(payload.formType.toLowerCase())} form
              &nbsp;&middot;&nbsp;
              <a href="https://${esc(payload.source)}" style="color:#c8a45a;text-decoration:none;">${esc(payload.source)}</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildEmailText(payload: InquiryPayload, timestamp: string): string {
  const lines = [
    `${payload.formType} — ${payload.source}`,
    ``,
    `Product:    ${payload.product || "—"}`,
    ``,
    `Name:       ${payload.name}`,
    `Email:      ${payload.email}`,
    `Phone:      ${payload.phone || "—"}`,
    `Instagram:  ${payload.instagram || "—"}`,
  ];

  if (payload.extraFields) {
    for (const [k, v] of Object.entries(payload.extraFields)) {
      lines.push(`${k.padEnd(11)} ${v}`);
    }
  }

  lines.push(
    ``,
    `Message:`,
    payload.message?.trim() || "(no message provided)",
    ``,
    `Source:     ${payload.source}`,
    `Submitted:  ${timestamp}`,
    ``,
    `—`,
    `Sent from the RootFlute acquisition form.`
  );

  return lines.join("\n");
}

// Persists a durable backup of the lead regardless of email outcome — a
// Resend outage or misconfiguration must never mean the lead is simply gone.
// Wrapped so a Blob failure here can never mask or block the caller's actual
// email result.
async function backupLead(payload: InquiryPayload, emailDelivered: boolean): Promise<void> {
  try {
    await saveLead({
      formType: payload.formType,
      product: payload.product,
      name: payload.name,
      email: payload.email,
      phone: payload.phone ?? "",
      instagram: payload.instagram ?? "",
      message: payload.message ?? "",
      source: payload.source,
      extraFields: payload.extraFields ?? null,
      emailDelivered,
    });
  } catch (err) {
    console.error(`[inquiry] Failed to save durable lead backup:`, err);
  }
}

export async function sendInquiryEmail(payload: InquiryPayload): Promise<{ ok: boolean }> {
  const timestamp = formatTimestamp();

  if (!process.env.RESEND_API_KEY) {
    console.error(`[inquiry] RESEND_API_KEY is not set — email NOT sent. Add it to Vercel env vars.`);
    console.info(`[inquiry] Captured payload:`, JSON.stringify({ ...payload, timestamp }));
    await backupLead(payload, false);
    return { ok: false };
  }

  console.info(`[inquiry] Sending email — from: ${FROM_EMAIL} to: ${TO_EMAIL} form: ${payload.formType}`);

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: payload.email,
    subject: `${payload.formType} — ${payload.product || "General"}`,
    html: buildEmailHtml(payload, timestamp),
    text: buildEmailText(payload, timestamp),
  });

  if (error) {
    console.error(`[inquiry] Resend rejected the send:`, JSON.stringify(error));
    console.info(`[inquiry] Payload that failed:`, JSON.stringify({ ...payload, timestamp }));
    await backupLead(payload, false);
    return { ok: false };
  }

  console.info(`[inquiry] Email sent successfully. Resend id: ${data?.id}`);
  await backupLead(payload, true);
  return { ok: true };
}

// ============================================================
// Post-purchase customer confirmation email.
//
// A dedicated, customer-facing message — NOT the internal inquiry body.
// Sent by the checkout webhook after a sale is authoritative. Delivery is
// best-effort: a failure here never affects the completed sale, and the
// caller records send-state in the durable order store for safe retries.
//
// Requires RESEND_FROM_EMAIL (a verified-domain sender). The shared
// onboarding@resend.dev fallback used for internal mail cannot reliably
// deliver to arbitrary customer addresses, so this function refuses to send
// from it and reports the reason instead of silently failing.
// ============================================================

export interface PurchaseConfirmationPayload {
  to: string;
  customerName: string | null;
  itemName: string;
  itemCategoryLabel: string;
  /** Human-readable amount already formatted, e.g. "$1.00". */
  amountFormatted: string;
  /** Short, human-quotable reference derived from the Stripe session id. */
  orderReference: string;
  /** One-line "Name, address" summary, or null if no shipping was collected. */
  shippingSummary: string | null;
  /** Stable idempotency key (per Stripe session) passed through to Resend. */
  idempotencyKey: string;
}

const SUPPORT_URL = `${SITE_URL}/acquisition-support`;

function buildPurchaseConfirmationHtml(p: PurchaseConfirmationPayload): string {
  const greeting = p.customerName ? `${esc(p.customerName)},` : "Thank you.";
  const rows: [string, string][] = [
    ["Piece", `${esc(p.itemName)}`],
    ["Category", esc(p.itemCategoryLabel)],
    ["Amount", esc(p.amountFormatted)],
    ["Order Reference", esc(p.orderReference)],
    ...(p.shippingSummary ? ([["Ship To", esc(p.shippingSummary)]] as [string, string][]) : []),
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:8px 16px 8px 0;color:#9a8a6a;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;white-space:nowrap;vertical-align:top;font-family:Arial,sans-serif;">${label}</td>
        <td style="padding:8px 0;color:#e8e0d0;font-size:14px;vertical-align:top;font-family:Georgia,serif;">${value}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0d0d0b;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0d0d0b;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background:#141410;border:1px solid #2a2820;">
        <tr><td style="height:2px;background:linear-gradient(90deg,transparent,#c8a45a,transparent);font-size:0;">&nbsp;</td></tr>
        <tr>
          <td style="padding:36px 32px 20px;">
            <p style="margin:0 0 12px;color:#c8a45a;font-size:10px;text-transform:uppercase;letter-spacing:0.3em;font-family:Arial,sans-serif;">Acquisition Confirmed</p>
            <p style="margin:0 0 6px;color:#e8e0d0;font-size:24px;font-weight:300;font-family:Georgia,serif;">Your piece has been claimed.</p>
            <p style="margin:0;color:#8a8170;font-size:13px;font-family:Georgia,serif;">${greeting}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 20px;">
            <p style="margin:0;color:#b8ae98;font-size:14px;line-height:1.7;font-family:Georgia,serif;">
              Your checkout completed and this one-of-one piece is now reserved to you. Daniel
              will personally follow up regarding your acquisition and the next steps &mdash;
              please watch the inbox for the email address you used at checkout.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:4px 32px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #2a2820;">
              <tr><td style="height:16px;font-size:0;">&nbsp;</td></tr>
              ${rowsHtml}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 32px;border-top:1px solid #2a2820;">
            <p style="margin:16px 0 12px;color:#9a8a6a;font-size:12px;font-family:Arial,sans-serif;">Need help with your acquisition?</p>
            <a href="${SUPPORT_URL}" style="display:inline-block;padding:12px 22px;background:#c8a45a;color:#141410;font-size:13px;font-weight:bold;text-decoration:none;font-family:Arial,sans-serif;letter-spacing:0.04em;">Request support or a return &rarr;</a>
            <p style="margin:14px 0 0;color:#6b6356;font-size:11px;line-height:1.6;font-family:Arial,sans-serif;">
              Daniel personally reviews each request and follows up with you directly.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 32px 26px;border-top:1px solid #2a2820;">
            <p style="margin:0;color:#4a4336;font-size:11px;font-family:Arial,sans-serif;">
              RootFlute &nbsp;&middot;&nbsp;
              <a href="${SITE_URL}" style="color:#c8a45a;text-decoration:none;">www.rootflute.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildPurchaseConfirmationText(p: PurchaseConfirmationPayload): string {
  const lines = [
    `ACQUISITION CONFIRMED — Your piece has been claimed.`,
    ``,
    p.customerName ? `${p.customerName},` : `Thank you.`,
    ``,
    `Your checkout completed and this one-of-one piece is now reserved to you.`,
    `Daniel will personally follow up regarding your acquisition and the next`,
    `steps — please watch the inbox for the email address you used at checkout.`,
    ``,
    `Piece:            ${p.itemName}`,
    `Category:         ${p.itemCategoryLabel}`,
    `Amount:           ${p.amountFormatted}`,
    `Order Reference:  ${p.orderReference}`,
  ];
  if (p.shippingSummary) lines.push(`Ship To:          ${p.shippingSummary}`);
  lines.push(
    ``,
    `Need help with your acquisition? Request support or a return:`,
    SUPPORT_URL,
    ``,
    `Daniel personally reviews each request and follows up with you directly.`,
    ``,
    `—`,
    `RootFlute · www.rootflute.com`
  );
  return lines.join("\n");
}

export async function sendPurchaseConfirmationEmail(
  payload: PurchaseConfirmationPayload
): Promise<{ ok: boolean; reason?: string }> {
  if (!process.env.RESEND_API_KEY) {
    console.error(`[purchase-confirmation] RESEND_API_KEY is not set — email NOT sent.`);
    return { ok: false, reason: "no_api_key" };
  }

  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) {
    console.error(
      `[purchase-confirmation] RESEND_FROM_EMAIL is not set — refusing to send a customer email from the shared sandbox sender. Configure a verified Resend domain and set RESEND_FROM_EMAIL. Order reference: ${payload.orderReference}`
    );
    return { ok: false, reason: "no_verified_sender" };
  }

  if (!payload.to) {
    console.error(
      `[purchase-confirmation] No customer email on the checkout session — cannot send. Order reference: ${payload.orderReference}`
    );
    return { ok: false, reason: "no_recipient" };
  }

  console.info(
    `[purchase-confirmation] Sending — from: ${from} to: ${payload.to} ref: ${payload.orderReference}`
  );

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send(
    {
      from,
      to: payload.to,
      subject: `Your RootFlute acquisition — ${payload.itemName}`,
      html: buildPurchaseConfirmationHtml(payload),
      text: buildPurchaseConfirmationText(payload),
    },
    { idempotencyKey: payload.idempotencyKey }
  );

  if (error) {
    console.error(`[purchase-confirmation] Resend rejected the send:`, JSON.stringify(error));
    return { ok: false, reason: "resend_error" };
  }

  console.info(`[purchase-confirmation] Sent. Resend id: ${data?.id}`);
  return { ok: true };
}
