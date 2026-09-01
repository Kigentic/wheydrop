import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SupplierConfirmation } from "@/lib/types";

export const revalidate = 0;

const statusLabel: Record<SupplierConfirmation["status"], string> = {
  pending: "Ausstehend",
  confirmed: "Bestätigt",
  declined: "Abgelehnt",
};

const statusClass: Record<SupplierConfirmation["status"], string> = {
  pending: "bg-zinc-200 text-zinc-700",
  confirmed: "bg-green-200 text-green-800",
  declined: "bg-red-200 text-red-800",
};

export default async function SupplierConfirmationsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("supplier_confirmations")
    .select("*")
    .order("created_at", { ascending: false });

  const list = (data ?? []) as SupplierConfirmation[];

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin/dashboard" className="text-sm text-zinc-500 hover:underline">
              ← Zurück
            </Link>
            <h1 className="mt-1 text-2xl font-bold">Hersteller-Zusagen</h1>
          </div>
          <Link
            href="/admin/supplier-confirmations/new"
            className="rounded-full bg-black px-4 py-2 text-sm font-bold text-yellow-400 hover:bg-zinc-900"
          >
            Neue Zusage anfragen
          </Link>
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg border-2 border-black">
          <table className="w-full text-sm">
            <thead className="bg-yellow-400 text-left">
              <tr>
                <th className="px-4 py-3">Produkt</th>
                <th className="px-4 py-3">Hersteller</th>
                <th className="px-4 py-3">Preis/Einheit</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Bestätigt am</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className="border-t border-zinc-300">
                  <td className="px-4 py-3 font-medium">{c.product_title}</td>
                  <td className="px-4 py-3">
                    {c.supplier_name}
                    <div className="text-zinc-500">{c.supplier_email}</div>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{c.unit_price.toFixed(2)} €</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold uppercase ${statusClass[c.status]}`}>
                      {statusLabel[c.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {c.confirmed_at
                      ? new Date(c.confirmed_at).toLocaleString("de-DE", { timeZone: "Europe/Berlin" })
                      : "–"}
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-zinc-500">
                    Noch keine Anfragen.
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
