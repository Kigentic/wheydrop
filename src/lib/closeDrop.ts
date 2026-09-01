import { createAdminClient } from "@/lib/supabase/admin";
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

  // TODO: Stripe capture per order at finalPrice * quantity once Stripe is wired up.
  for (const order of (orders ?? []) as Order[]) {
    await supabase
      .from("orders")
      .update({ final_amount: finalPrice * order.quantity + SHIPPING_FLAT, status: "captured" })
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
