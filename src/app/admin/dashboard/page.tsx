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
    <div className="min-h-screen bg-black text-zinc-50">
      <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
        <span className="text-xl font-bold tracking-tight">Admin</span>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/drops/new"
            className="rounded-full bg-lime-400 px-4 py-2 text-sm font-bold text-black hover:bg-lime-300"
          >
            Neuer Drop
          </Link>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-6 text-2xl font-bold">Alle Drops</h1>

        <div className="overflow-x-auto rounded-lg border border-zinc-800">
          <table className="w-full text-sm">
            <thead className="bg-zinc-950 text-left text-zinc-400">
              <tr>
                <th className="px-4 py-3">Titel</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Einheiten</th>
                <th className="px-4 py-3">Preis</th>
                <th className="px-4 py-3">Ende</th>
              </tr>
            </thead>
            <tbody>
              {list.map((drop) => (
                <tr key={drop.id} className="border-t border-zinc-800 hover:bg-zinc-950">
                  <td className="px-4 py-3">
                    <Link href={`/admin/drops/${drop.id}`} className="font-medium hover:text-lime-400">
                      {drop.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 capitalize">{drop.status}</td>
                  <td className="px-4 py-3 tabular-nums">
                    {drop.total_ordered} / {drop.max_units}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{drop.current_price.toFixed(2)} €</td>
                  <td className="px-4 py-3">{new Date(drop.ends_at).toLocaleString("de-DE")}</td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-zinc-500">
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
