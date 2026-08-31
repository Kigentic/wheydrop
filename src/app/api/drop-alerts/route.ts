import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, confirmEmailHtml } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!name || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Bitte Name und gültige E-Mail angeben" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("drop_alerts")
    .select("id, name, confirmed, confirm_token")
    .eq("email", email)
    .maybeSingle();

  let row = existing;

  if (!row) {
    const { data: inserted, error } = await supabase
      .from("drop_alerts")
      .insert({ name, email })
      .select("id, name, confirmed, confirm_token")
      .single();

    if (error) {
      return NextResponse.json({ error: "Anmeldung fehlgeschlagen" }, { status: 500 });
    }
    row = inserted;
  }

  if (row && !row.confirmed) {
    const origin = req.nextUrl.origin;
    const confirmUrl = `${origin}/api/drop-alerts/confirm?token=${row.confirm_token}`;
    try {
      await sendEmail({
        to: email,
        subject: "Bestätige deinen Drop Alarm",
        html: confirmEmailHtml(row.name, confirmUrl),
      });
    } catch (err) {
      console.error("Failed to send confirmation email:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
