import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import type { Manufacturer } from "@/lib/types";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: manufacturer, error } = await supabase
    .from("manufacturers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !manufacturer) {
    return NextResponse.json({ error: "Hersteller nicht gefunden" }, { status: 404 });
  }

  const typedManufacturer = manufacturer as Manufacturer;
  if (!typedManufacturer.stripe_account_id) {
    return NextResponse.json({ onboarding_status: typedManufacturer.onboarding_status });
  }

  const account = await stripe.accounts.retrieve(typedManufacturer.stripe_account_id);
  const onboarding_status = account.charges_enabled && account.payouts_enabled ? "complete" : "pending";

  await supabase.from("manufacturers").update({ onboarding_status }).eq("id", id);

  return NextResponse.json({ onboarding_status });
}
