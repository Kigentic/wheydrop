import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, supplierConfirmationRequestEmailHtml } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    supplier_name,
    supplier_email,
    product_title,
    flavors,
    unit_price,
    delivery_note,
    drop_id,
  } = body;

  if (
    !supplier_name ||
    !supplier_email ||
    !product_title ||
    !Array.isArray(flavors) ||
    flavors.length === 0 ||
    !unit_price ||
    !delivery_note
  ) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: confirmation, error } = await supabase
    .from("supplier_confirmations")
    .insert({
      supplier_name,
      supplier_email,
      product_title,
      flavors,
      unit_price,
      delivery_note,
      drop_id: drop_id || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const confirmUrl = `${req.nextUrl.origin}/supplier-confirm/${confirmation.confirm_token}`;

  try {
    await sendEmail({
      to: supplier_email,
      subject: `Mengen- und Preiszusage: ${product_title}`,
      html: supplierConfirmationRequestEmailHtml(supplier_name, product_title, confirmUrl),
    });
  } catch (err) {
    console.error("Failed to send supplier confirmation request email:", err);
  }

  return NextResponse.json({ confirmation });
}
