import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, orderConfirmationEmailHtml } from "@/lib/email";
import type { Drop } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { drop_id, variant_id, quantity, customer_name, customer_email, customer_address } = body;

  if (!drop_id || !variant_id || !quantity || !customer_name || !customer_email || !customer_address) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const sessionClient = await createClient();
  const {
    data: { user },
  } = await sessionClient.auth.getUser();

  const supabase = createAdminClient();

  const { data: drop, error: dropError } = await supabase
    .from("drops")
    .select("*")
    .eq("id", drop_id)
    .single();

  if (dropError || !drop) {
    return NextResponse.json({ error: "drop not found" }, { status: 404 });
  }

  const typedDrop = drop as Drop;
  if (typedDrop.status !== "active" || Date.parse(typedDrop.ends_at) < Date.now()) {
    return NextResponse.json({ error: "drop not active" }, { status: 400 });
  }

  // TODO: Stripe PaymentIntent (authorize) here once keys are configured.
  // authorized_amount uses the worst-case (first/highest) tier price.
  const maxPrice = typedDrop.price_tiers[0]?.price ?? typedDrop.current_price;
  const authorized_amount = maxPrice * quantity;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      drop_id,
      variant_id,
      quantity,
      authorized_amount,
      status: "authorized",
      customer_id: user?.id ?? null,
      customer_name,
      customer_email,
      customer_address,
    })
    .select()
    .single();

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }

  const { data: variant } = await supabase
    .from("variants")
    .select("flavor")
    .eq("id", variant_id)
    .single();

  try {
    await sendEmail({
      to: customer_email,
      subject: `Bestellung bestätigt: ${typedDrop.title}`,
      html: orderConfirmationEmailHtml(
        customer_name,
        typedDrop.title,
        variant?.flavor ?? "",
        quantity,
        authorized_amount,
        `${req.nextUrl.origin}/drop/${drop_id}`
      ),
    });
  } catch (err) {
    console.error("Failed to send order confirmation email:", err);
  }

  return NextResponse.json({ order });
}
