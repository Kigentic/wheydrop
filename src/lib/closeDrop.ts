import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import { SHIPPING_FLAT } from "@/lib/pricing";
import type { Drop, Order } from "@/lib/types";

function priceForUnits(tiers: Drop["price_tiers"], units: number) {
  const sorted = [...tiers].sort((a, b) => b.min_units - a.min_units);
  const match = sorted.find(
    (t) => units >= t.min_units && (t.max_units === null || units <= t.max_units)
  );
  return match?.price ?? tiers[0].price;
}

export async function closeDrop(dropId: string) {
  const supabase = createAdminClient();

  const { data: drop, error: dropError } = await supabase
    .from("drops")
    .select("*")
    .eq("id", dropId)
    .single();

  if (dropError || !drop) {
    throw new Error("drop not found");
  }

  const typedDrop = drop as Drop;
  const finalPrice = priceForUnits(typedDrop.price_tiers, typedDrop.total_ordered);

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .eq("drop_id", dropId)
    .eq("status", "authorized");

  if (ordersError) {
    throw new Error(ordersError.message);
  }

  for (const order of (orders ?? []) as Order[]) {
    const finalAmount = finalPrice * order.quantity + SHIPPING_FLAT;

    if (order.stripe_payment_intent) {
      try {
        await stripe.paymentIntents.capture(order.stripe_payment_intent, {
          amount_to_capture: Math.round(finalAmount * 100),
        });
      } catch (err) {
        console.error(`Failed to capture payment for order ${order.id}:`, err);
        continue; // leave this order as "authorized" for manual follow-up
      }
    }

    await supabase
      .from("orders")
      .update({ final_amount: finalAmount, status: "captured" })
      .eq("id", order.id);
  }

  const { error: closeError } = await supabase
    .from("drops")
    .update({ status: "closed", current_price: finalPrice })
    .eq("id", dropId);

  if (closeError) {
    throw new Error(closeError.message);
  }

  return { final_price: finalPrice, orders_closed: orders?.length ?? 0 };
}
