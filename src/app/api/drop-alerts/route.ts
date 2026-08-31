import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!name || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Bitte Name und gültige E-Mail angeben" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("drop_alerts").insert({ name, email });

  // unique violation (already registered) still counts as success for the user
  if (error && error.code !== "23505") {
    return NextResponse.json({ error: "Anmeldung fehlgeschlagen" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
