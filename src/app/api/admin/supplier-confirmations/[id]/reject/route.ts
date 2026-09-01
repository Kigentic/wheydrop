import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, supplierOfferDeclinedEmailHtml } from "@/lib/email";
import type { SupplierConfirmation } from "@/lib/types";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const reason = typeof body.reason === "string" ? body.reason : "";

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("supplier_confirmations")
    .select("*")
    .eq("id", id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const confirmation = existing as SupplierConfirmation;

  if (confirmation.status !== "submitted") {
    return NextResponse.json({ error: "already reviewed" }, { status: 400 });
  }

  const { data: updated, error } = await supabase
    .from("supplier_confirmations")
    .update({
      status: "declined",
      declined_by: "admin",
      decline_reason: reason || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  try {
    await sendEmail({
      to: confirmation.supplier_email,
      subject: `Zu eurem Angebot: ${confirmation.product_title}`,
      html: supplierOfferDeclinedEmailHtml(
        confirmation.contact_name || confirmation.supplier_name,
        confirmation.product_title,
        reason
      ),
    });
  } catch (err) {
    console.error("Failed to send supplier decline email:", err);
  }

  return NextResponse.json({ confirmation: updated });
}
