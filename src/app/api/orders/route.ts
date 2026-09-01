import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import { sendEmail, orderConfirmationEmailHtml } from "@/lib/email";
import { SHIPPING_FLAT } from "@/lib/pricing";
import type { Drop } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    drop_id,
    variant_id,
    quantity,
    customer_first_name,
    customer_last_name,
    customer_email,
    customer_address,
    accept_terms,
    accept_withdrawal,
    payment_intent_id,
  } = body;

  if (
    !drop_id ||
    !variant_id ||
    !quantity ||
    !customer_first_name ||
    !customer_last_name ||
    !customer_email ||
    !customer_address ||
    !payment_intent_id
  ) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  if (!accept_terms || !accept_withdrawal) {
    return NextResponse.json({ error: "AGB und Widerrufsbelehrung müssen bestätigt werden" }, { status: 400 });
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

  const maxPrice = typedDrop.price_tiers[0]?.price ?? typedDrop.current_price;
  const authorized_amount = maxPrice * quantity + SHIPPING_FLAT;

  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

  if (
    paymentIntent.status !== "requires_capture" ||
    paymentIntent.metadata.drop_id !== drop_id ||
    paymentIntent.metadata.variant_id !== variant_id ||
    paymentIntent.metadata.quantity !== String(quantity) ||
    paymentIntent.amount !== Math.round(authorized_amount * 100)
  ) {
    return NextResponse.json({ error: "payment not authorized" }, { status: 400 });
  }

  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_payment_intent", payment_intent_id)
    .maybeSingle();

  if (existingOrder) {
    return NextResponse.json({ error: "order already exists for this payment" }, { status: 409 });
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      drop_id,
      variant_id,
      quantity,
      authorized_amount,
      status: "authorized",
      stripe_payment_intent: payment_intent_id,
      customer_id: user?.id ?? null,
      customer_first_name,
      customer_last_name,
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
        customer_first_name,
        typedDrop.title,
        variant?.flavor ?? "",
        quantity,
        maxPrice * quantity,
        SHIPPING_FLAT,
        authorized_amount,
        `${req.nextUrl.origin}/drop/${drop_id}`
      ),
    });
  } catch (err) {
    console.error("Failed to send order confirmation email:", err);
  }

  return NextResponse.json({ order });
}
