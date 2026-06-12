import "server-only";

interface EmailInput {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  idempotencyKey?: string;
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "WakeelHub Pakistan <onboarding@resend.dev>";

export async function sendEmail(input: EmailInput) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, skipped: true, error: "RESEND_API_KEY is not configured." };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(input.idempotencyKey ? { "Idempotency-Key": input.idempotencyKey } : {}),
    },
    body: JSON.stringify({
      from: FROM,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    return { ok: false, skipped: false, error: body || response.statusText };
  }

  return { ok: true, skipped: false };
}

export function basicEmail(title: string, body: string, action?: { label: string; url: string }) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111827">
      <h1 style="font-size:22px;margin:0 0 12px">${title}</h1>
      <p style="font-size:15px;line-height:1.6;margin:0 0 20px;color:#374151">${body}</p>
      ${
        action
          ? `<a href="${action.url}" style="display:inline-block;background:#0f172a;color:white;text-decoration:none;padding:10px 14px;border-radius:8px;font-weight:600">${action.label}</a>`
          : ""
      }
      <p style="font-size:12px;color:#6b7280;margin-top:24px">WakeelHub Pakistan</p>
    </div>
  `;
}

export async function sendTransactionalEmail(input: { to?: string | null; subject: string; title: string; body: string; path?: string; idempotencyKey?: string }) {
  if (!input.to) return { ok: false, skipped: true, error: "Missing recipient." };
  const origin = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "";
  const action = input.path && origin ? { label: "Open WakeelHub", url: `${origin}${input.path}` } : undefined;
  return sendEmail({
    to: input.to,
    subject: input.subject,
    html: basicEmail(input.title, input.body, action),
    text: input.body,
    idempotencyKey: input.idempotencyKey,
  });
}
