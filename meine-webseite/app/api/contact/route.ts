import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

// Where the form-submission email goes.
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "info@sorokinschweisser.de";

// FROM address. Default to Resend's verified onboarding sender so the form
// still works before the user verifies their own domain at resend.com.
// Once sorokinschweisser.de is verified there, set CONTACT_FROM_EMAIL to
// something like:  SOROKIN Kontaktformular <kontakt@sorokinschweisser.de>
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
      replyTo: email, // Konstantin kann direkt antworten
      subject: `Neue Anfrage von ${name}`,
      text:
        `Neue Anfrage über das Kontaktformular auf sorokinschweisser.de\n\n` +
        `Name:    ${name}\n` +
        `Telefon: ${telefon}\n` +
        `E-Mail:  ${email}\n\n` +
        `Auftragsbeschreibung:\n${beschreibung}\n`,
      html: `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Arial,sans-serif;color:#111827;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:14px;padding:28px;box-shadow:0 4px 20px rgba(16,24,40,0.06);">
    <h2 style="margin:0 0 4px 0;color:#0770b0;font-size:20px;">Neue Anfrage</h2>
    <p style="margin:0 0 20px 0;color:#6b7280;font-size:13px;">sorokinschweisser.de · Kontaktformular</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:6px 0;color:#6b7280;width:92px;">Name</td><td style="padding:6px 0;font-weight:600;">${esc(name)}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Telefon</td><td style="padding:6px 0;font-weight:600;"><a href="tel:${esc(telefon)}" style="color:#0770b0;text-decoration:none;">${esc(telefon)}</a></td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">E-Mail</td><td style="padding:6px 0;font-weight:600;"><a href="mailto:${esc(email)}" style="color:#0770b0;text-decoration:none;">${esc(email)}</a></td></tr>
    </table>
    <div style="margin-top:20px;padding:16px;background:#f9fafb;border-left:3px solid #f97316;border-radius:6px;">
      <div style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;margin-bottom:8px;">Auftragsbeschreibung</div>
      <div style="color:#111827;white-space:pre-wrap;line-height:1.55;font-size:14px;">${esc(beschreibung)}</div>
    </div>
    <p style="color:#9ca3af;font-size:12px;margin:18px 0 0 0;">Antworten an diese E-Mail gehen direkt an ${esc(email)}.</p>
  </div>
</body></html>`,
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
