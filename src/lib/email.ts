import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Wheydrop <drops@wheydrop.fitskins.de>";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const { error } = await resend.emails.send({ from: FROM, to, subject, html });
  if (error) {
    console.error("Resend send failed:", error);
    throw new Error(error.message);
  }
}

function layout(bodyHtml: string) {
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f4f4f4; padding:32px 16px;">
    <div style="max-width:480px; margin:0 auto; background:#ffffff; border:2px solid #000; border-radius:12px; overflow:hidden;">
      <div style="background:#000; padding:20px 24px;">
        <span style="color:#fff; font-size:20px; font-weight:900;">Wheydrop<span style="color:#FFD600;">.</span></span>
      </div>
      <div style="padding:24px;">
        ${bodyHtml}
      </div>
      <div style="padding:16px 24px; color:#999; font-size:12px; border-top:1px solid #eee;">
        Wheydrop · Group-Buying für Whey Protein
      </div>
    </div>
  </div>`;
}

export function confirmEmailHtml(name: string, confirmUrl: string) {
  return layout(`
    <h1 style="font-size:20px; margin:0 0 12px;">Hi ${escapeHtml(name)},</h1>
    <p style="font-size:15px; color:#333; line-height:1.5;">
      bestätige deine Anmeldung zum Drop Alarm, damit wir dir per E-Mail Bescheid geben können,
      sobald ein neuer Drop startet.
    </p>
    <div style="margin:24px 0;">
      <a href="${confirmUrl}" style="display:inline-block; background:#000; color:#FFD600; font-weight:700; text-decoration:none; padding:14px 28px; border-radius:999px;">
        Anmeldung bestätigen
      </a>
    </div>
    <p style="font-size:12px; color:#999;">
      Falls du dich nicht angemeldet hast, kannst du diese E-Mail einfach ignorieren.
    </p>
  `);
}

export function reminder24hEmailHtml(name: string, dropTitle: string, dropUrl: string, startsAtLabel: string) {
  return layout(`
    <span style="display:inline-block; background:#FFD600; padding:4px 10px; font-size:11px; font-weight:800; text-transform:uppercase; border-radius:4px;">Drop Alarm</span>
    <h1 style="font-size:20px; margin:16px 0 12px;">Hi ${escapeHtml(name)}, morgen geht's los!</h1>
    <p style="font-size:15px; color:#333; line-height:1.5;">
      <strong>${escapeHtml(dropTitle)}</strong> startet in 24 Stunden, am ${startsAtLabel}.
      Je mehr mitmachen, desto günstiger wird's für alle — sei früh dabei.
    </p>
    <div style="margin:24px 0;">
      <a href="${dropUrl}" style="display:inline-block; background:#000; color:#FFD600; font-weight:700; text-decoration:none; padding:14px 28px; border-radius:999px;">
        Drop ansehen
      </a>
    </div>
  `);
}

export function reminderStartEmailHtml(name: string, dropTitle: string, dropUrl: string) {
  return layout(`
    <span style="display:inline-block; background:#FFD600; padding:4px 10px; font-size:11px; font-weight:800; text-transform:uppercase; border-radius:4px;">Live jetzt</span>
    <h1 style="font-size:20px; margin:16px 0 12px;">Hi ${escapeHtml(name)}, es geht los!</h1>
    <p style="font-size:15px; color:#333; line-height:1.5;">
      <strong>${escapeHtml(dropTitle)}</strong> ist jetzt live. 48 Stunden Zeit, gemeinsam den
      Preis zu drücken — je mehr mitmachen, desto günstiger für alle.
    </p>
    <div style="margin:24px 0;">
      <a href="${dropUrl}" style="display:inline-block; background:#000; color:#FFD600; font-weight:700; text-decoration:none; padding:14px 28px; border-radius:999px;">
        Jetzt mitmachen
      </a>
    </div>
  `);
}

export function orderConfirmationEmailHtml(
  name: string,
  dropTitle: string,
  flavor: string,
  quantity: number,
  subtotal: number,
  shipping: number,
  authorizedAmount: number,
  dropUrl: string
) {
  return layout(`
    <span style="display:inline-block; background:#FFD600; padding:4px 10px; font-size:11px; font-weight:800; text-transform:uppercase; border-radius:4px;">Bestellung bestätigt</span>
    <h1 style="font-size:20px; margin:16px 0 12px;">Hi ${escapeHtml(name)}, danke für deine Bestellung!</h1>
    <p style="font-size:15px; color:#333; line-height:1.5;">
      Du bist dabei bei <strong>${escapeHtml(dropTitle)}</strong>.
    </p>
    <table style="width:100%; font-size:14px; color:#333; border-collapse:collapse; margin:16px 0;">
      <tr><td style="padding:6px 0; color:#999;">Sorte</td><td style="padding:6px 0; text-align:right;">${escapeHtml(flavor)}</td></tr>
      <tr><td style="padding:6px 0; color:#999;">Menge</td><td style="padding:6px 0; text-align:right;">${quantity}</td></tr>
      <tr><td style="padding:6px 0; color:#999;">Zwischensumme (Maximalpreis)</td><td style="padding:6px 0; text-align:right;">${subtotal.toFixed(2)} €</td></tr>
      <tr><td style="padding:6px 0; color:#999;">Versand</td><td style="padding:6px 0; text-align:right;">${shipping.toFixed(2)} €</td></tr>
      <tr><td style="padding:6px 0; color:#999; border-top:1px solid #eee;">Autorisierter Höchstbetrag</td><td style="padding:6px 0; text-align:right; border-top:1px solid #eee; font-weight:700;">${authorizedAmount.toFixed(2)} €</td></tr>
    </table>
    <p style="font-size:13px; color:#666; line-height:1.5;">
      Das ist der maximale Betrag inkl. Versand. Je mehr Leute mitmachen, desto günstiger wird's
      für alle — am Ende zahlst du nur den tatsächlich erreichten Bestpreis zzgl. Versand.
    </p>
    <div style="margin:24px 0;">
      <a href="${dropUrl}" style="display:inline-block; background:#000; color:#FFD600; font-weight:700; text-decoration:none; padding:14px 28px; border-radius:999px;">
        Drop verfolgen
      </a>
    </div>
  `);
}

export function supplierConfirmationRequestEmailHtml(
  supplierName: string,
  productTitle: string,
  confirmUrl: string
) {
  return layout(`
    <span style="display:inline-block; background:#FFD600; padding:4px 10px; font-size:11px; font-weight:800; text-transform:uppercase; border-radius:4px;">Mengen- und Preiszusage</span>
    <h1 style="font-size:20px; margin:16px 0 12px;">Hallo ${escapeHtml(supplierName)},</h1>
    <p style="font-size:15px; color:#333; line-height:1.5;">
      bitte bestätigen Sie die Menge und den Preis für <strong>${escapeHtml(productTitle)}</strong>
      über den folgenden Link. Details (Geschmacksrichtungen, Mengen, Preis, Lieferzeit sowie die
      vertraglichen Bedingungen aus unserem Rahmenvertrag) finden Sie auf der verlinkten Seite.
    </p>
    <div style="margin:24px 0;">
      <a href="${confirmUrl}" style="display:inline-block; background:#000; color:#FFD600; font-weight:700; text-decoration:none; padding:14px 28px; border-radius:999px;">
        Zusage ansehen &amp; bestätigen
      </a>
    </div>
    <p style="font-size:12px; color:#999;">
      Mit Bestätigung erklären Sie sich mit den dort genannten Bedingungen verbindlich
      einverstanden (Textform gem. § 126b BGB).
    </p>
  `);
}

export function supplierOfferReceivedEmailHtml(
  companyName: string,
  contactName: string,
  productTitle: string,
  flavors: { flavor: string; quantity: number }[],
  unitPrice: number,
  deliveryNote: string,
  message: string,
  reviewUrl: string
) {
  const rows = flavors
    .map(
      (f) =>
        `<tr><td style="padding:4px 0; color:#999;">${escapeHtml(f.flavor)}</td><td style="padding:4px 0; text-align:right;">${f.quantity}</td></tr>`
    )
    .join("");
  return layout(`
    <span style="display:inline-block; background:#FFD600; padding:4px 10px; font-size:11px; font-weight:800; text-transform:uppercase; border-radius:4px;">Neues Hersteller-Angebot</span>
    <h1 style="font-size:20px; margin:16px 0 12px;">${escapeHtml(companyName)} (${escapeHtml(contactName)})</h1>
    <p style="font-size:15px; color:#333; line-height:1.5;">
      <strong>${escapeHtml(productTitle)}</strong> zu ${unitPrice.toFixed(2)} €/Einheit.
    </p>
    <table style="width:100%; font-size:14px; color:#333; border-collapse:collapse; margin:16px 0;">
      ${rows}
    </table>
    <p style="font-size:14px; color:#333;"><strong>Lieferbedingungen:</strong> ${escapeHtml(deliveryNote)}</p>
    ${message ? `<p style="font-size:14px; color:#333;"><strong>Nachricht:</strong> ${escapeHtml(message)}</p>` : ""}
    <div style="margin:24px 0;">
      <a href="${reviewUrl}" style="display:inline-block; background:#000; color:#FFD600; font-weight:700; text-decoration:none; padding:14px 28px; border-radius:999px;">
        Anfrage prüfen
      </a>
    </div>
  `);
}

export function supplierOfferDeclinedEmailHtml(contactName: string, productTitle: string, reason: string) {
  return layout(`
    <h1 style="font-size:20px; margin:0 0 12px;">Hallo ${escapeHtml(contactName)},</h1>
    <p style="font-size:15px; color:#333; line-height:1.5;">
      vielen Dank für euer Angebot für <strong>${escapeHtml(productTitle)}</strong>. Leider
      passt es aktuell nicht in unsere Planung.
    </p>
    ${reason ? `<p style="font-size:14px; color:#666;">${escapeHtml(reason)}</p>` : ""}
    <p style="font-size:14px; color:#666;">
      Gerne könnt ihr euch mit anderen Konditionen erneut melden.
    </p>
  `);
}

export function supplierConfirmedEmailHtml(
  supplierName: string,
  productTitle: string,
  flavors: { flavor: string; quantity: number }[],
  unitPrice: number,
  confirmedAt: string
) {
  const rows = flavors
    .map(
      (f) =>
        `<tr><td style="padding:4px 0; color:#999;">${escapeHtml(f.flavor)}</td><td style="padding:4px 0; text-align:right;">${f.quantity}</td></tr>`
    )
    .join("");
  return layout(`
    <span style="display:inline-block; background:#FFD600; padding:4px 10px; font-size:11px; font-weight:800; text-transform:uppercase; border-radius:4px;">Zusage bestätigt</span>
    <h1 style="font-size:20px; margin:16px 0 12px;">${escapeHtml(supplierName)} hat zugesagt</h1>
    <p style="font-size:15px; color:#333; line-height:1.5;">
      Für <strong>${escapeHtml(productTitle)}</strong> zum Preis von ${unitPrice.toFixed(2)} €/Einheit,
      bestätigt am ${confirmedAt}.
    </p>
    <table style="width:100%; font-size:14px; color:#333; border-collapse:collapse; margin:16px 0;">
      ${rows}
    </table>
  `);
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
