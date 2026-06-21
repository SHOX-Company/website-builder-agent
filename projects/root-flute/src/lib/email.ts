import { Resend } from "resend";

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

export async function sendInquiryEmail(payload: InquiryPayload): Promise<{ ok: boolean }> {
  const timestamp = formatTimestamp();

  if (!process.env.RESEND_API_KEY) {
    console.error(`[inquiry] RESEND_API_KEY is not set — email NOT sent. Add it to Vercel env vars.`);
    console.info(`[inquiry] Captured payload:`, JSON.stringify({ ...payload, timestamp }));
    return { ok: true };
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
  } else {
    console.info(`[inquiry] Email sent successfully. Resend id: ${data?.id}`);
  }

  return { ok: true };
}
