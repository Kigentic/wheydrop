import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    title,
    brand_name,
    starts_at,
    ends_at,
    price_tiers,
    max_units,
    flavors,
    description,
    image_urls,
    purchase_price,
    purchase_tiers,
  } = body;

  if (!title || !brand_name || !starts_at || !ends_at || !price_tiers?.length || !max_units || !flavors?.length) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const status = new Date(starts_at) <= new Date() ? "active" : "upcoming";

  const { data: drop, error: dropError } = await supabase
    .from("drops")
    .insert({
      title,
      brand_name,
      status,
      starts_at,
      ends_at,
      price_tiers,
      max_units,
      total_ordered: 0,
      current_price: price_tiers[0].price,
      description: description ?? "",
      image_urls: image_urls ?? [],
      purchase_price: purchase_price ?? null,
      purchase_tiers: purchase_tiers?.length ? purchase_tiers : null,
    })
    .select()
    .single();

  if (dropError) {
    return NextResponse.json({ error: dropError.message }, { status: 500 });
  }

  const variantRows = (
    flavors as { flavor: string; brand?: string; available_units: number }[]
  ).map((f) => ({
    drop_id: drop.id,
    flavor: f.flavor,
    brand: f.brand?.trim() || null,
    available_units: f.available_units,
  }));

  const { error: variantError } = await supabase.from("variants").insert(variantRows);

  if (variantError) {
    return NextResponse.json({ error: variantError.message }, { status: 500 });
  }

  return NextResponse.json({ drop });
}
