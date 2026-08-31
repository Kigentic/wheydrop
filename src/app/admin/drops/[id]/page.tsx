import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { marginForGross } from "@/lib/pricing";
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
  const variantList = (variants ?? []) as Variant[];
  const variantMap = new Map(variantList.map((v) => [v.id, v.flavor]));
  const orderList = (orders ?? []) as Order[];

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/admin/dashboard" className="text-sm font-semibold hover:underline">
          ← Alle Drops
        </Link>

        <div className="mt-3 flex items-start justify-between">
          <div>
            <span className="inline-block bg-black px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-yellow-400">
              {typedDrop.status}
            </span>
            <h1 className="mt-1 text-2xl font-bold">{typedDrop.title}</h1>
            <p className="text-zinc-600">{typedDrop.brand_name}</p>
          </div>

          <div className="flex gap-3">
            <a
              href={`/api/admin/drops/${typedDrop.id}/orders.csv`}
              className="rounded-full border-2 border-black px-4 py-2 text-sm font-medium hover:bg-black hover:text-yellow-400"
            >
              CSV exportieren
            </a>
            {typedDrop.status !== "closed" && <CloseDropButton dropId={typedDrop.id} />}
          </div>
        </div>

        {typedDrop.image_urls.length > 0 && (
          <div className="mt-6 grid grid-cols-4 gap-3">
            {typedDrop.image_urls.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={url}
                alt={`${typedDrop.title} – Bild ${i + 1}`}
                className="aspect-square rounded-lg border-2 border-black object-cover"
              />
            ))}
          </div>
        )}

        {typedDrop.description && (
          <p className="mt-6 max-w-2xl leading-relaxed text-zinc-700">{typedDrop.description}</p>
        )}

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg border-2 border-black p-4">
            <div className="text-xs text-zinc-600">Einheiten</div>
            <div className="text-xl font-bold tabular-nums">
              {typedDrop.total_ordered} / {typedDrop.max_units}
            </div>
          </div>
          <div className="rounded-lg border-2 border-black p-4">
            <div className="text-xs text-zinc-600">Preis</div>
            <div className="text-xl font-bold tabular-nums">{typedDrop.current_price.toFixed(2)} €</div>
          </div>
          <div className="rounded-lg border-2 border-black p-4">
            <div className="text-xs text-zinc-600">Ende</div>
            <div className="text-xl font-bold">{new Date(typedDrop.ends_at).toLocaleString("de-DE")}</div>
          </div>
        </div>

        <h2 className="mt-10 mb-3 text-lg font-bold">Flavors</h2>
        <div className="overflow-x-auto rounded-lg border-2 border-black">
          <table className="w-full text-sm">
            <thead className="bg-yellow-400 text-left">
              <tr>
                <th className="px-4 py-3">Flavor</th>
                <th className="px-4 py-3">Bestellt</th>
                <th className="px-4 py-3">Verfügbares Kontingent</th>
              </tr>
            </thead>
            <tbody>
              {variantList.map((v) => (
                <tr key={v.id} className="border-t border-zinc-300">
                  <td className="px-4 py-3 font-medium">{v.flavor}</td>
                  <td className="px-4 py-3 tabular-nums">{v.ordered_units}</td>
                  <td className="px-4 py-3 tabular-nums">{v.available_units}</td>
                </tr>
              ))}
              {variantList.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-zinc-500">
                    Keine Flavors hinterlegt.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h2 className="mt-10 mb-3 text-lg font-bold">Preisstufen</h2>
        <div className="overflow-x-auto rounded-lg border-2 border-black">
          <table className="w-full text-sm">
            <thead className="bg-yellow-400 text-left">
              <tr>
                <th className="px-4 py-3">Einheiten</th>
                <th className="px-4 py-3">Preis</th>
                {typedDrop.purchase_price != null && <th className="px-4 py-3">Marge / Einheit</th>}
              </tr>
            </thead>
            <tbody>
              {typedDrop.price_tiers.map((t, i) => (
                <tr key={i} className="border-t border-zinc-300">
                  <td className="px-4 py-3 tabular-nums">
                    {t.min_units}
                    {t.max_units != null ? ` – ${t.max_units}` : "+"}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{t.price.toFixed(2)} €</td>
                  {typedDrop.purchase_price != null && (
                    <td className="px-4 py-3 tabular-nums text-green-700">
                      {marginForGross(t.price, typedDrop.purchase_price).toFixed(2)} €
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {typedDrop.purchase_price != null && (
          <p className="mt-2 text-xs text-zinc-500">
            Einkaufspreis: {typedDrop.purchase_price.toFixed(2)} € · Marge inkl. MwSt. (19%) und Stripe-Gebühr
            (1,5% + 0,25 €)
          </p>
        )}

        <h2 className="mt-10 mb-3 text-lg font-bold">Bestellungen ({orderList.length})</h2>
        <div className="overflow-x-auto rounded-lg border-2 border-black">
          <table className="w-full text-sm">
            <thead className="bg-yellow-400 text-left">
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
                <tr key={o.id} className="border-t border-zinc-300">
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
