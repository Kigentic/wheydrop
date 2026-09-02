import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import { SHIPPING_FLAT } from "@/lib/pricing";
import type { Drop, Variant } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { drop_id, variant_id, quantity } = body;

  if (!drop_id || !variant_id || !quantity || quantity < 1) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

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

  const { data: variant, error: variantError } = await supabase
    .from("variants")
    .select("*")
    .eq("id", variant_id)
    .eq("drop_id", drop_id)
    .single();

  if (variantError || !variant) {
    return NextResponse.json({ error: "variant not found" }, { status: 404 });
  }

  const typedVariant = variant as Variant;
  const variantRemaining = typedVariant.available_units - typedVariant.ordered_units;
  const dropRemaining = typedDrop.max_units - typedDrop.total_ordered;
  const maxOrderable = Math.min(variantRemaining, dropRemaining);

  if (quantity > maxOrderable) {
    return NextResponse.json(
      { error: "not enough stock", available: Math.max(0, maxOrderable) },
      { status: 409 }
    );
  }

  const maxPrice = typedDrop.price_tiers[0]?.price ?? typedDrop.current_price;
  const authorizedAmount = maxPrice * quantity + SHIPPING_FLAT;
  const amountCents = Math.round(authorizedAmount * 100);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "eur",
      capture_method: "manual",
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
      metadata: {
        drop_id,
        variant_id,
        quantity: String(quantity),
      },
    });

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      authorized_amount: authorizedAmount,
    });
  } catch (err) {
    console.error("Failed to create Stripe PaymentIntent:", err);
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
