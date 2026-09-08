import { NextRequest, NextResponse } from "next/server";
import { sendEmail, manufacturerContactEmailHtml } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const company = typeof body.company === "string" ? body.company.trim() : "";
  const contactName = typeof body.contactName === "string" ? body.contactName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!company || !contactName || !EMAIL_RE.test(email) || !message) {
    return NextResponse.json({ error: "Bitte alle Pflichtfelder ausfüllen." }, { status: 400 });
  }

  try {
    await sendEmail({
      to: "wheydrop@fitskins.de",
      subject: `Hersteller-Anfrage: ${company}`,
      html: manufacturerContactEmailHtml(company, contactName, email, phone, message),
    });
  } catch (err) {
    console.error("Failed to send manufacturer contact email:", err);
    return NextResponse.json({ error: "Senden fehlgeschlagen. Bitte nochmal versuchen." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
