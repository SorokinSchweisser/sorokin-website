import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

// All mail traffic uses info@sorokinschweisser.de. Both FROM and TO are
// hardcoded — no env-var override, no Resend onboarding fallback. The
// FROM domain (sorokinschweisser.de) must be verified at Resend.
const FROM_EMAIL = "SOROKIN Schweisserservice <info@sorokinschweisser.de>";
const TO_EMAIL = "info@sorokinschweisser.de";
const SUBJECT = "Neue Kontaktanfrage über sorokinschweisser.de";

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
      replyTo: email, // Direktes Antworten an den Kunden
      subject: SUBJECT,
      text:
        `Neue Kontaktanfrage über sorokinschweisser.de\n\n` +
        `Name:    ${name}\n` +
        `Telefon: ${telefon}\n` +
        `E-Mail:  ${email}\n\n` +
        `Auftragsbeschreibung:\n${beschreibung}\n`,
      // Minimal-HTML: kein font-family, keine externen Ressourcen, keine
      // farbigen Akzente. Werte als plain spans (kein <a>) + format-detection
      // Meta — verhindert Strikethrough bei Gmail/IONOS-Webmail.
      html: `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no">
<title>Neue Kontaktanfrage</title>
</head>
<body style="margin:0;padding:20px;background:#ffffff;color:#000000;">
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;margin:0 auto;border-collapse:collapse;">
  <tr><td style="padding:0 0 14px 0;border-bottom:1px solid #cccccc;">
    <p style="margin:0;font-size:16px;font-weight:bold;">Neue Kontaktanfrage</p>
    <p style="margin:4px 0 0 0;font-size:12px;color:#666666;">sorokinschweisser.de</p>
  </td></tr>
  <tr><td style="padding:16px 0 8px 0;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;font-size:14px;">
      <tr>
        <td width="100" style="padding:6px 0;color:#666666;vertical-align:top;">Name:</td>
        <td style="padding:6px 0;font-weight:bold;color:#000000;vertical-align:top;">${esc(name)}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;color:#666666;vertical-align:top;">Telefon:</td>
        <td style="padding:6px 0;font-weight:bold;color:#000000;vertical-align:top;">${esc(telefon)}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;color:#666666;vertical-align:top;">E-Mail:</td>
        <td style="padding:6px 0;font-weight:bold;color:#000000;vertical-align:top;">${esc(email)}</td>
      </tr>
    </table>
  </td></tr>
  <tr><td style="padding:10px 0 0 0;">
    <p style="margin:0 0 6px 0;font-size:13px;color:#666666;">Auftragsbeschreibung:</p>
    <p style="margin:0;font-size:14px;line-height:1.5;color:#000000;white-space:pre-wrap;">${esc(beschreibung)}</p>
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
