import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Drop } from "@/lib/types";
import { LogoutButton } from "./LogoutButton";

export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = createAdminClient();
  const { data: drops } = await supabase
    .from("drops")
    .select("*")
    .order("created_at", { ascending: false });

  const list = (drops ?? []) as Drop[];

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Alle Drops</h1>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/drops/new"
              className="rounded-full bg-black px-4 py-2 text-sm font-bold text-yellow-400 hover:bg-zinc-900"
            >
              Neuer Drop
            </Link>
            <LogoutButton />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg border-2 border-black">
          <table className="w-full text-sm">
            <thead className="bg-yellow-400 text-left">
              <tr>
                <th className="px-4 py-3">Titel</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Einheiten</th>
                <th className="px-4 py-3">Preis</th>
                <th className="px-4 py-3">Ende</th>
                <th className="px-4 py-3">Bestellungen</th>
              </tr>
            </thead>
            <tbody>
              {list.map((drop) => (
                <tr key={drop.id} className="border-t border-zinc-300 hover:bg-yellow-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/drops/${drop.id}`} className="font-medium hover:underline">
                      {drop.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 capitalize">{drop.status}</td>
                  <td className="px-4 py-3 tabular-nums">
                    {drop.total_ordered} / {drop.max_units}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{drop.current_price.toFixed(2)} €</td>
                  <td className="px-4 py-3">
                    {new Date(drop.ends_at).toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/drops/${drop.id}`} className="font-semibold hover:underline">
                      Ansehen →
                    </Link>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-zinc-500">
                    Noch keine Drops.
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
