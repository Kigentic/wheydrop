import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const contact_name = typeof body.contact_name === "string" ? body.contact_name.trim() || null : null;
  const contact_email = typeof body.contact_email === "string" ? body.contact_email.trim() || null : null;

  if (!name) {
    return NextResponse.json({ error: "Name fehlt" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: manufacturer, error } = await supabase
    .from("manufacturers")
    .insert({ name, contact_name, contact_email })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ manufacturer });
}
