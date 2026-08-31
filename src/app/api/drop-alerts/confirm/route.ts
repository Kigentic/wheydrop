import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const origin = req.nextUrl.origin;

  if (!token) {
    return NextResponse.redirect(`${origin}/drop-alarm/status?ok=0`);
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("drop_alerts")
    .update({ confirmed: true, confirmed_at: new Date().toISOString() })
    .eq("confirm_token", token)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.redirect(`${origin}/drop-alarm/status?ok=0`);
  }

  return NextResponse.redirect(`${origin}/drop-alarm/status?ok=1`);
}
