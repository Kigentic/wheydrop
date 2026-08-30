import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Order, Variant } from "@/lib/types";

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [{ data: orders }, { data: variants }] = await Promise.all([
    supabase.from("orders").select("*").eq("drop_id", id).order("created_at", { ascending: true }),
    supabase.from("variants").select("*").eq("drop_id", id),
  ]);

  const variantMap = new Map(((variants ?? []) as Variant[]).map((v) => [v.id, v.flavor]));

  const header = [
    "Name",
    "E-Mail",
    "Flavor",
    "Menge",
    "Finaler Preis",
    "Straße",
    "PLZ",
    "Stadt",
    "Land",
    "Status",
  ];

  const rows = ((orders ?? []) as Order[]).map((o) => [
    o.customer_name,
    o.customer_email,
    variantMap.get(o.variant_id) ?? "",
    String(o.quantity),
    o.final_amount != null ? o.final_amount.toFixed(2) : "",
    o.customer_address.street,
    o.customer_address.zip,
    o.customer_address.city,
    o.customer_address.country,
    o.status,
  ]);

  const csv = [header, ...rows].map((r) => r.map(csvEscape).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="drop-${id}-orders.csv"`,
    },
  });
}
