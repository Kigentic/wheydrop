import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, supplierConfirmedEmailHtml } from "@/lib/email";
import type { SupplierConfirmation } from "@/lib/types";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const body = await req.json();
  const action = body.action as "confirm" | "decline";

  if (action !== "confirm" && action !== "decline") {
    return NextResponse.json({ error: "invalid action" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("supplier_confirmations")
    .select("*")
    .eq("confirm_token", token)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const confirmation = existing as SupplierConfirmation;

  if (confirmation.status !== "admin_approved") {
    return NextResponse.json({ error: "already processed" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  const { data: updated, error } = await supabase
    .from("supplier_confirmations")
    .update({
      status: action === "confirm" ? "confirmed" : "declined",
      confirmed_at: new Date().toISOString(),
      confirmed_ip: ip,
      declined_by: action === "decline" ? "supplier" : null,
    })
    .eq("id", confirmation.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  try {
    if (action === "confirm") {
      await sendEmail({
        to: "wheydrop@fitskins.de",
        subject: `Zusage bestätigt: ${confirmation.product_title}`,
        html: supplierConfirmedEmailHtml(
          confirmation.supplier_name,
          confirmation.product_title,
          confirmation.flavors,
          confirmation.unit_price,
          new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })
        ),
      });
    } else {
      await sendEmail({
        to: "wheydrop@fitskins.de",
        subject: `Hersteller hat abgelehnt: ${confirmation.product_title}`,
        html: `<p>${confirmation.supplier_name} hat die finale Bestätigung für ${confirmation.product_title} abgelehnt.</p>`,
      });
    }
  } catch (err) {
    console.error("Failed to send supplier-confirm notification:", err);
  }

  return NextResponse.json({ confirmation: updated });
}
