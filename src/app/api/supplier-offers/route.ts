import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, supplierOfferReceivedEmailHtml } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    supplier_name,
    contact_name,
    supplier_email,
    phone,
    product_title,
    flavors,
    unit_price,
    delivery_note,
    message,
  } = body;

  if (
    !supplier_name ||
    !contact_name ||
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
      contact_name,
      supplier_email,
      phone: phone || null,
      product_title,
      flavors,
      unit_price,
      delivery_note,
      message: message || null,
      status: "submitted",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const reviewUrl = `${req.nextUrl.origin}/admin/supplier-confirmations/${confirmation.id}`;

  try {
    await sendEmail({
      to: "wheydrop@fitskins.de",
      subject: `Neues Hersteller-Angebot: ${product_title}`,
      html: supplierOfferReceivedEmailHtml(
        supplier_name,
        contact_name,
        product_title,
        flavors,
        unit_price,
        delivery_note,
        message || "",
        reviewUrl
      ),
    });
  } catch (err) {
    console.error("Failed to send supplier offer notification:", err);
  }

  return NextResponse.json({ confirmation });
}
