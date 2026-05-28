import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

// Where the form-submission email goes.
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "info@sorokinschweisser.de";

// FROM address. Default to Resend's verified onboarding sender so the form
// still works before the customer's own domain is verified at resend.com.
// Once sorokinschweisser.de is verified there, set CONTACT_FROM_EMAIL to:
//   SOROKIN Kontaktformular <info@sorokinschweisser.de>
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL ||
  "SOROKIN Kontaktformular <onboarding@resend.dev>";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

// HTML-escape user input so it can't break the email body.
const esc = (s: string) =>
  s.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string)
  );

export async function POST(req: Request) {
  let body: {
    name?: string;
    telefon?: string;
    email?: string;
    beschreibung?: string;
    website?: string; // honeypot
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Ungültige Anfrage." },
      { status: 400 }
    );
  }

  // Honeypot — bots fill hidden fields; humans don't see "website".
  // Pretend success to avoid signalling the trap.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = (body.name || "").trim();
  const telefon = (body.telefon || "").trim();
  const email = (body.email || "").trim();
  const beschreibung = (body.beschreibung || "").trim();

  if (!name || !telefon || !email || !beschreibung) {
    return NextResponse.json(
      { ok: false, error: "Bitte füllen Sie alle Felder aus." },
      { status: 400 }
    );
  }
  if (!isEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Bitte geben Sie eine gültige E-Mail-Adresse an." },
      { status: 400 }
    );
  }
  if (
    name.length > 200 ||
    telefon.length > 100 ||
    email.length > 200 ||
    beschreibung.length > 5000
  ) {
    return NextResponse.json(
      { ok: false, error: "Eingabe zu lang." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set");
    return NextResponse.json(
      {
        ok: false,
        error:
          "E-Mail-Versand ist aktuell nicht konfiguriert. Bitte rufen Sie uns kurz an: 01511 4459165.",
      },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: TO_EMAIL, // Per user instruction: alle Mail-Felder auf info@
      subject: `Neue Anfrage von ${name} – sorokinschweisser.de`,
      text:
        `Neue Kontaktanfrage über sorokinschweisser.de\n\n` +
        `Name:    ${name}\n` +
        `Telefon: ${telefon}\n` +
        `E-Mail:  ${email}\n\n` +
        `Auftragsbeschreibung:\n${beschreibung}\n\n` +
        `--\nE-Mail-Adresse des Anfragenden: ${email}\n`,
      // Clean transactional HTML — table-based, all-inline CSS, no external
      // assets. Phone/email rendered as PLAIN text spans (no <a tel:>/mailto:)
      // because Gmail wraps those links with its own styling and applies a
      // strikethrough when it can't validate the value. format-detection meta
      // tells mail clients not to auto-decorate values either.
      html: `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no">
<title>Neue Kontaktanfrage</title>
</head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,Arial,sans-serif;color:#111827;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f5f7fa;">
  <tr><td align="center" style="padding:28px 12px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;">
      <tr><td style="padding:26px 28px 6px 28px;">
        <div style="font-size:12px;font-weight:600;color:#0770b0;letter-spacing:0.10em;text-transform:uppercase;margin:0 0 6px 0;">sorokinschweisser.de</div>
        <div style="font-size:19px;font-weight:700;color:#111827;line-height:1.3;margin:0;">Neue Kontaktanfrage</div>
      </td></tr>
      <tr><td style="padding:14px 28px 4px 28px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
          <tr>
            <td width="90" style="padding:10px 0;color:#6b7280;font-size:13px;font-weight:500;vertical-align:top;border-bottom:1px solid #f3f4f6;">Name</td>
            <td style="padding:10px 0;color:#111827;font-size:14px;font-weight:600;vertical-align:top;border-bottom:1px solid #f3f4f6;">${esc(name)}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#6b7280;font-size:13px;font-weight:500;vertical-align:top;border-bottom:1px solid #f3f4f6;">Telefon</td>
            <td style="padding:10px 0;color:#111827;font-size:14px;font-weight:600;vertical-align:top;border-bottom:1px solid #f3f4f6;"><span style="color:#111827;text-decoration:none;">${esc(telefon)}</span></td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#6b7280;font-size:13px;font-weight:500;vertical-align:top;">E-Mail</td>
            <td style="padding:10px 0;color:#111827;font-size:14px;font-weight:600;vertical-align:top;"><span style="color:#111827;text-decoration:none;">${esc(email)}</span></td>
          </tr>
        </table>
      </td></tr>
      <tr><td style="padding:18px 28px 8px 28px;">
        <div style="font-size:11px;font-weight:700;color:#6b7280;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 10px 0;">Auftragsbeschreibung</div>
        <div style="font-size:14px;color:#374151;line-height:1.55;white-space:pre-wrap;background:#f9fafb;border:1px solid #f3f4f6;border-radius:8px;padding:14px 16px;">${esc(beschreibung)}</div>
      </td></tr>
      <tr><td style="padding:8px 28px 26px 28px;">
        <div style="font-size:12px;color:#9ca3af;line-height:1.5;">Eingang über das Kontaktformular auf sorokinschweisser.de.</div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`,
    });

    if (result.error) {
      console.error("[contact] Resend error:", result.error);
      return NextResponse.json(
        {
          ok: false,
          error:
            "Versand fehlgeschlagen. Bitte versuchen Sie es erneut oder rufen Sie uns an: 01511 4459165.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] send threw:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Versand fehlgeschlagen. Bitte versuchen Sie es erneut oder rufen Sie uns an: 01511 4459165.",
      },
      { status: 502 }
    );
  }
}
