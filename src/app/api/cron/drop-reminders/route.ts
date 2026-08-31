import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, reminder24hEmailHtml, reminderStartEmailHtml } from "@/lib/email";
import type { Drop } from "@/lib/types";

const DAY_MS = 24 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const origin = req.nextUrl.origin;
  const supabase = createAdminClient();

  const { data: drops } = await supabase
    .from("drops")
    .select("*")
    .in("status", ["upcoming", "active"]);

  const results: string[] = [];
  const now = Date.now();

  for (const drop of (drops ?? []) as Drop[]) {
    const startsAt = Date.parse(drop.starts_at);

    // flip status once the start time has passed
    if (drop.status === "upcoming" && startsAt <= now) {
      await supabase.from("drops").update({ status: "active" }).eq("id", drop.id);
      drop.status = "active";
      results.push(`${drop.id}: status -> active`);
    }

    const dropUrl = `${origin}/drop/${drop.id}`;

    const needs24h =
      !drop.reminder_24h_sent_at && startsAt > now && startsAt - now <= DAY_MS;
    const needsStart = !drop.reminder_start_sent_at && startsAt <= now;

    if (!needs24h && !needsStart) continue;

    const { data: subscribers } = await supabase
      .from("drop_alerts")
      .select("name, email")
      .eq("confirmed", true);

    if (needs24h) {
      const startsAtLabel = new Date(drop.starts_at).toLocaleString("de-DE", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "Europe/Berlin",
      });
      await Promise.allSettled(
        (subscribers ?? []).map((s) =>
          sendEmail({
            to: s.email,
            subject: `Morgen geht's los: ${drop.title}`,
            html: reminder24hEmailHtml(s.name, drop.title, dropUrl, startsAtLabel),
          })
        )
      );
      await supabase
        .from("drops")
        .update({ reminder_24h_sent_at: new Date().toISOString() })
        .eq("id", drop.id);
      results.push(`${drop.id}: 24h reminder sent to ${subscribers?.length ?? 0}`);
    }

    if (needsStart) {
      await Promise.allSettled(
        (subscribers ?? []).map((s) =>
          sendEmail({
            to: s.email,
            subject: `Live jetzt: ${drop.title}`,
            html: reminderStartEmailHtml(s.name, drop.title, dropUrl),
          })
        )
      );
      await supabase
        .from("drops")
        .update({ reminder_start_sent_at: new Date().toISOString() })
        .eq("id", drop.id);
      results.push(`${drop.id}: start reminder sent to ${subscribers?.length ?? 0}`);
    }
  }

  return NextResponse.json({ ok: true, results });
}
