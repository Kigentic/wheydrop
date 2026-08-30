import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Drop } from "@/lib/types";

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();
  const { data: drops } = await supabase
    .from("drops")
    .select("*")
    .in("status", ["active", "upcoming"])
    .order("starts_at", { ascending: true });

  const list = (drops ?? []) as Drop[];

  return (
    <div className="min-h-screen bg-black text-zinc-50">
      <header className="border-b border-zinc-800 px-6 py-5">
        <span className="text-xl font-bold tracking-tight">Proteinbörse</span>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-8 text-2xl font-bold">Aktuelle Drops</h1>

        {list.length === 0 && (
          <p className="text-zinc-400">Aktuell kein aktiver Drop. Schau bald wieder vorbei.</p>
        )}

        <div className="grid gap-4">
          {list.map((drop) => (
            <Link
              key={drop.id}
              href={`/drop/${drop.id}`}
              className="block rounded-lg border border-zinc-800 bg-zinc-950 p-6 transition hover:border-lime-400"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-lime-400">
                    {drop.status === "active" ? "Live" : "Bald"}
                  </span>
                  <h2 className="mt-1 text-xl font-bold">{drop.title}</h2>
                  <p className="text-zinc-400">{drop.brand_name}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold tabular-nums">
                    {drop.current_price.toFixed(2)} €
                  </div>
                  <div className="text-sm text-zinc-400">
                    {drop.total_ordered} / {drop.max_units} Einheiten
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
