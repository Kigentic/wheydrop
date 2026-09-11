import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import type { Drop, Manufacturer } from "@/lib/types";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const amount = Number(body.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Ungültiger Betrag" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: drop, error: dropError } = await supabase
    .from("drops")
    .select("*")
    .eq("id", id)
    .single();

  if (dropError || !drop) {
    return NextResponse.json({ error: "Drop nicht gefunden" }, { status: 404 });
  }

  const typedDrop = drop as Drop;

  if (typedDrop.status !== "closed") {
    return NextResponse.json({ error: "Drop ist noch nicht geschlossen" }, { status: 400 });
  }

  if (!typedDrop.manufacturer_id) {
    return NextResponse.json({ error: "Diesem Drop ist kein Hersteller zugeordnet" }, { status: 400 });
  }

  const { data: manufacturer, error: manufacturerError } = await supabase
    .from("manufacturers")
    .select("*")
    .eq("id", typedDrop.manufacturer_id)
    .single();

  if (manufacturerError || !manufacturer) {
    return NextResponse.json({ error: "Hersteller nicht gefunden" }, { status: 404 });
  }

  const typedManufacturer = manufacturer as Manufacturer;

  if (!typedManufacturer.stripe_account_id || typedManufacturer.onboarding_status !== "complete") {
    return NextResponse.json(
      { error: "Hersteller hat das Stripe-Onboarding noch nicht abgeschlossen" },
      { status: 400 }
    );
  }

  let transfer;
  try {
    transfer = await stripe.transfers.create({
      amount: Math.round(amount * 100),
      currency: "eur",
      destination: typedManufacturer.stripe_account_id,
      transfer_group: typedDrop.id,
      description: `Wheydrop – ${typedDrop.title}`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Transfer fehlgeschlagen";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const { error: insertError } = await supabase.from("manufacturer_transfers").insert({
    drop_id: typedDrop.id,
    manufacturer_id: typedManufacturer.id,
    amount,
    stripe_transfer_id: transfer.id,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ transfer_id: transfer.id });
}
