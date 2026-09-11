import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Manufacturer } from "@/lib/types";
import { NewManufacturerForm } from "./NewManufacturerForm";
import { ManufacturerActions } from "./ManufacturerActions";

export const revalidate = 0;

const STATUS_LABEL: Record<Manufacturer["onboarding_status"], string> = {
  not_started: "Nicht gestartet",
  pending: "Onboarding läuft",
  complete: "Bereit für Transfers",
};

const STATUS_TONE: Record<Manufacturer["onboarding_status"], string> = {
  not_started: "bg-zinc-200 text-zinc-700",
  pending: "bg-yellow-200 text-yellow-900",
  complete: "bg-green-200 text-green-900",
};

export default async function ManufacturersPage() {
  const supabase = createAdminClient();
  const { data: manufacturers } = await supabase
    .from("manufacturers")
    .select("*")
    .order("created_at", { ascending: false });

  const list = (manufacturers ?? []) as Manufacturer[];

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/admin/dashboard" className="text-sm font-semibold hover:underline">
          ← Alle Drops
        </Link>

        <h1 className="mt-3 text-2xl font-bold">Hersteller-Konten (Stripe Connect)</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600">
          Jeder Hersteller braucht ein eigenes Stripe-Express-Konto, bevor ihr Auszahlungen
          direkt aus dem Wheydrop-Guthaben an ihn transferieren könnt. Onboarding-Link
          generieren, an den Hersteller schicken, danach „Status aktualisieren".
        </p>

        <div className="mt-6">
          <NewManufacturerForm />
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg border-2 border-black">
          <table className="w-full text-sm">
            <thead className="bg-yellow-400 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Kontakt</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {list.map((m) => (
                <tr key={m.id} className="border-t border-zinc-300">
                  <td className="px-4 py-3 font-medium">{m.name}</td>
                  <td className="px-4 py-3 text-zinc-600">
                    {m.contact_name}
                    {m.contact_name && m.contact_email && " · "}
                    {m.contact_email}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${STATUS_TONE[m.onboarding_status]}`}>
                      {STATUS_LABEL[m.onboarding_status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <ManufacturerActions manufacturerId={m.id} />
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-zinc-500">
                    Noch keine Hersteller angelegt.
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
