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
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-8 text-2xl font-bold">Aktuelle Drops</h1>

        {list.length === 0 && (
          <p className="text-zinc-600">Aktuell kein aktiver Drop. Schau bald wieder vorbei.</p>
        )}

        <div className="grid gap-4">
          {list.map((drop) => (
            <Link
              key={drop.id}
              href={`/drop/${drop.id}`}
              className="flex items-center gap-5 rounded-lg border-2 border-black p-6 transition hover:bg-yellow-50"
            >
              {drop.image_urls[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={drop.image_urls[0]}
                  alt={drop.title}
                  className="h-20 w-20 flex-shrink-0 rounded-md border border-black object-cover"
                />
              )}
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <span className="inline-block bg-black px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-yellow-400">
                    {drop.status === "active" ? "Live" : "Bald"}
                  </span>
                  <h2 className="mt-1 text-xl font-bold">{drop.title}</h2>
                  <p className="text-zinc-600">{drop.brand_name}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold tabular-nums">
                    {drop.current_price.toFixed(2)} €
                  </div>
                  <div className="text-sm text-zinc-600">
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
