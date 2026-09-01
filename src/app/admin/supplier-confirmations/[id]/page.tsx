import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SupplierConfirmation } from "@/lib/types";
import { ReviewActions } from "./ReviewActions";

export const revalidate = 0;

const statusLabel: Record<SupplierConfirmation["status"], string> = {
  submitted: "Neues Angebot — wartet auf Prüfung",
  admin_approved: "Freigegeben — wartet auf finale Hersteller-Bestätigung",
  confirmed: "Verbindlich bestätigt",
  declined: "Abgelehnt",
};

export default async function SupplierConfirmationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("supplier_confirmations")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const confirmation = data as SupplierConfirmation | null;

  if (!confirmation) {
    return (
      <div className="min-h-screen bg-white text-black">
        <main className="mx-auto max-w-2xl px-6 py-12">
          <p>Nicht gefunden.</p>
        </main>
      </div>
    );
  }

  const totalUnits = confirmation.flavors.reduce((sum, f) => sum + f.quantity, 0);

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/admin/supplier-confirmations" className="text-sm text-zinc-500 hover:underline">
          ← Zurück
        </Link>
        <h1 className="mt-1 text-2xl font-bold">{confirmation.product_title}</h1>
        <p className="mt-1 text-sm font-semibold">{statusLabel[confirmation.status]}</p>

        <div className="mt-6 rounded-lg border-2 border-black p-6">
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <div className="text-zinc-500">Firma</div>
              <div className="font-medium">{confirmation.supplier_name}</div>
            </div>
            <div>
              <div className="text-zinc-500">Ansprechpartner</div>
              <div className="font-medium">{confirmation.contact_name || "–"}</div>
            </div>
            <div>
              <div className="text-zinc-500">E-Mail</div>
              <div className="font-medium">{confirmation.supplier_email}</div>
            </div>
            <div>
              <div className="text-zinc-500">Telefon</div>
              <div className="font-medium">{confirmation.phone || "–"}</div>
            </div>
          </div>

          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500">
                <th className="pb-2">Geschmacksrichtung</th>
                <th className="pb-2 text-right">Menge</th>
              </tr>
            </thead>
            <tbody>
              {confirmation.flavors.map((f, i) => (
                <tr key={i} className="border-t border-zinc-200">
                  <td className="py-2">{f.flavor}</td>
                  <td className="py-2 text-right tabular-nums">{f.quantity}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-black font-bold">
                <td className="py-2">Gesamt</td>
                <td className="py-2 text-right tabular-nums">{totalUnits}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 flex items-center justify-between border-t border-zinc-300 pt-4">
            <div>Preis pro Einheit</div>
            <div className="font-bold tabular-nums">{confirmation.unit_price.toFixed(2)} €</div>
          </div>
          <div className="mt-1 flex items-center justify-between text-zinc-600">
            <div>Gesamtwert (Referenz)</div>
            <div className="tabular-nums">{(totalUnits * confirmation.unit_price).toFixed(2)} €</div>
          </div>

          <div className="mt-4 border-t border-zinc-300 pt-4">
            <div className="text-sm text-zinc-500">Lieferzeit / Lieferbedingungen</div>
            <p className="mt-1 whitespace-pre-line">{confirmation.delivery_note}</p>
          </div>

          {confirmation.message && (
            <div className="mt-4 border-t border-zinc-300 pt-4">
              <div className="text-sm text-zinc-500">Nachricht des Herstellers</div>
              <p className="mt-1 whitespace-pre-line">{confirmation.message}</p>
            </div>
          )}
        </div>

        {confirmation.status === "submitted" && <ReviewActions id={confirmation.id} />}

        {confirmation.status === "declined" && confirmation.decline_reason && (
          <div className="mt-6 rounded-lg border-2 border-black bg-red-50 p-4 text-sm">
            <strong>Ablehnungsgrund:</strong> {confirmation.decline_reason}
          </div>
        )}

        {confirmation.status === "confirmed" && (
          <div className="mt-6 rounded-lg border-2 border-black bg-green-50 p-4 text-sm">
            Verbindlich bestätigt am{" "}
            {confirmation.confirmed_at &&
              new Date(confirmation.confirmed_at).toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}{" "}
            (IP: {confirmation.confirmed_ip})
          </div>
        )}
      </main>
    </div>
  );
}
