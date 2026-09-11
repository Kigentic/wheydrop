import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import type { Manufacturer } from "@/lib/types";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
  let accountId = typedManufacturer.stripe_account_id;

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      country: "DE",
      email: typedManufacturer.contact_email ?? undefined,
      capabilities: { transfers: { requested: true } },
      business_type: "company",
    });
    accountId = account.id;

    await supabase
      .from("manufacturers")
      .update({ stripe_account_id: accountId, onboarding_status: "pending" })
      .eq("id", id);
  }

  const origin = req.nextUrl.origin;
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${origin}/admin/manufacturers`,
    return_url: `${origin}/admin/manufacturers`,
    type: "account_onboarding",
  });

  return NextResponse.json({ url: accountLink.url });
}
