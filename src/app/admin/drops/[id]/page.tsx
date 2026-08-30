import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Drop, Order, Variant } from "@/lib/types";
import { CloseDropButton } from "./CloseDropButton";

export const revalidate = 0;

export default async function AdminDropDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [{ data: drop }, { data: variants }, { data: orders }] = await Promise.all([
    supabase.from("drops").select("*").eq("id", id).single(),
    supabase.from("variants").select("*").eq("drop_id", id),
    supabase.from("orders").select("*").eq("drop_id", id).order("created_at", { ascending: false }),
  ]);

  if (!drop) notFound();

  const typedDrop = drop as Drop;
  const variantMap = new Map(((variants ?? []) as Variant[]).map((v) => [v.id, v.flavor]));
  const orderList = (orders ?? []) as Order[];

  return (
    <div className="min-h-screen bg-black text-zinc-50">
      <header className="border-b border-zinc-800 px-6 py-5">
        <a href="/admin/dashboard" className="text-xl font-bold tracking-tight">
          Admin
        </a>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-lime-400">
              {typedDrop.status}
            </span>
            <h1 className="mt-1 text-2xl font-bold">{typedDrop.title}</h1>
            <p className="text-zinc-400">{typedDrop.brand_name}</p>
          </div>

          <div className="flex gap-3">
            <a
              href={`/api/admin/drops/${typedDrop.id}/orders.csv`}
              className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium hover:border-zinc-500"
            >
              CSV exportieren
            </a>
            {typedDrop.status !== "closed" && <CloseDropButton dropId={typedDrop.id} />}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-xs text-zinc-400">Einheiten</div>
            <div className="text-xl font-bold tabular-nums">
              {typedDrop.total_ordered} / {typedDrop.max_units}
            </div>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-xs text-zinc-400">Preis</div>
            <div className="text-xl font-bold tabular-nums">{typedDrop.current_price.toFixed(2)} €</div>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-xs text-zinc-400">Ende</div>
            <div className="text-xl font-bold">{new Date(typedDrop.ends_at).toLocaleString("de-DE")}</div>
          </div>
        </div>

        <h2 className="mt-10 mb-3 text-lg font-bold">Bestellungen ({orderList.length})</h2>
        <div className="overflow-x-auto rounded-lg border border-zinc-800">
          <table className="w-full text-sm">
            <thead className="bg-zinc-950 text-left text-zinc-400">
              <tr>
                <th className="px-4 py-3">Kunde</th>
                <th className="px-4 py-3">Flavor</th>
                <th className="px-4 py-3">Menge</th>
                <th className="px-4 py-3">Autorisiert</th>
                <th className="px-4 py-3">Final</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orderList.map((o) => (
                <tr key={o.id} className="border-t border-zinc-800">
                  <td className="px-4 py-3">
                    <div>{o.customer_name}</div>
                    <div className="text-zinc-500">{o.customer_email}</div>
                  </td>
                  <td className="px-4 py-3">{variantMap.get(o.variant_id) ?? "–"}</td>
                  <td className="px-4 py-3 tabular-nums">{o.quantity}</td>
                  <td className="px-4 py-3 tabular-nums">{o.authorized_amount.toFixed(2)} €</td>
                  <td className="px-4 py-3 tabular-nums">
                    {o.final_amount != null ? `${o.final_amount.toFixed(2)} €` : "–"}
                  </td>
                  <td className="px-4 py-3 capitalize">{o.status}</td>
                </tr>
              ))}
              {orderList.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-zinc-500">
                    Noch keine Bestellungen.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
