import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Drop } from "@/lib/types";

export const revalidate = 0;

export default async function Home() {
  let list: Drop[] = [];

  try {
    const supabase = await createClient();
    const { data: drops } = await supabase
      .from("drops")
      .select("*")
      .in("status", ["active", "upcoming"])
      .order("starts_at", { ascending: true });
    list = (drops ?? []) as Drop[];
  } catch (err) {
    console.error("Failed to load drops:", err);
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* HERO */}
      <section className="relative overflow-hidden bg-black text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/wheydrop_header.png"
          alt="Wheydrop Community"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "center 15%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <span className="inline-block bg-yellow-400 px-3 py-1 text-xs font-black uppercase tracking-widest text-black">
            Group-Buying für Whey Protein
          </span>
          <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight sm:text-6xl">
            Je mehr <span className="text-yellow-400">mitmachen</span>,
            <br />
            desto günstiger für <span className="text-yellow-400">alle.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-zinc-200">
            Schließ dich der Community an, sichere dir Premium-Protein bekannter Marken zum
            Bestpreis — und zahl erst am Ende genau den Preis, den ihr gemeinsam erreicht habt.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#drops"
              className="rounded-full bg-yellow-400 px-8 py-4 text-base font-black text-black transition hover:bg-yellow-300"
            >
              Jetzt Drops entdecken
            </a>
            <a
              href="#so-funktionierts"
              className="rounded-full border-2 border-white px-8 py-4 text-base font-black text-white transition hover:bg-white hover:text-black"
            >
              So funktioniert's
            </a>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-b-2 border-black bg-yellow-400">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 text-center sm:grid-cols-4">
          <div>
            <div className="text-3xl font-black">100%</div>
            <div className="text-xs font-bold uppercase tracking-wide">Community-powered</div>
          </div>
          <div>
            <div className="text-3xl font-black">0€</div>
            <div className="text-xs font-bold uppercase tracking-wide">Risiko bis Drop-Ende</div>
          </div>
          <div>
            <div className="text-3xl font-black">Top</div>
            <div className="text-xs font-bold uppercase tracking-wide">Marken, direkt ab Werk</div>
          </div>
          <div>
            <div className="text-3xl font-black">48h</div>
            <div className="text-xs font-bold uppercase tracking-wide">Pro Drop, dann vorbei</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="so-funktionierts" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-black sm:text-4xl">So funktioniert's</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-zinc-600">
          Kein Feilschen, kein Mindestbestellwert für dich allein — die Community verhandelt den
          Preis für dich mit.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          <div className="rounded-lg border-2 border-black p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-xl font-black text-yellow-400">
              1
            </div>
            <h3 className="mt-4 text-lg font-bold">Drop auswählen &amp; mitmachen</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Wähl Flavor und Menge. Wir autorisieren nur den Maximalpreis — belastet wird das
              erst am Ende.
            </p>
          </div>
          <div className="rounded-lg border-2 border-black p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-xl font-black text-yellow-400">
              2
            </div>
            <h3 className="mt-4 text-lg font-bold">Preis fällt in Echtzeit</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Jede weitere Bestellung schiebt den Gesamtpreis für alle Teilnehmer runter —
              live sichtbar, kein Warten auf Rabattcodes.
            </p>
          </div>
          <div className="rounded-lg border-2 border-black p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-xl font-black text-yellow-400">
              3
            </div>
            <h3 className="mt-4 text-lg font-bold">Nur den Bestpreis zahlen</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Drop endet nach 48h. Du zahlst automatisch den niedrigsten erreichten Preis —
              ohne dein Zutun.
            </p>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="border-y-2 border-black bg-black text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <span className="text-4xl">🤝</span>
              <h3 className="mt-4 text-xl font-bold">Echte Community-Power</h3>
              <p className="mt-2 text-sm text-zinc-300">
                Kein Konzern verhandelt für dich — ihr als Community bestimmt gemeinsam den
                Preis. Je größer die Gruppe, desto besser für jeden Einzelnen.
              </p>
            </div>
            <div>
              <span className="text-4xl">💰</span>
              <h3 className="mt-4 text-xl font-bold">Bestpreis-Garantie</h3>
              <p className="mt-2 text-sm text-zinc-300">
                Kein Feilschen um Rabattcodes. Der niedrigste Preis, den die Community
                erreicht, gilt automatisch für alle — auch für die ersten Käufer.
              </p>
            </div>
            <div>
              <span className="text-4xl">🏭</span>
              <h3 className="mt-4 text-xl font-bold">Direkt vom Hersteller</h3>
              <p className="mt-2 text-sm text-zinc-300">
                Kein Zwischenhändler-Aufschlag. Bekannte Protein-Marken liefern direkt an dich —
                ohne Umwege, ohne Lagerkosten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVE DROPS */}
      <section id="drops" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-black sm:text-4xl">Aktuelle Drops</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-zinc-600">
          Zeitlich begrenzt. Je mehr mitmachen, desto günstiger — für alle gleichzeitig.
        </p>

        {list.length === 0 && (
          <div className="mx-auto mt-12 max-w-md rounded-lg border-2 border-dashed border-zinc-300 p-10 text-center text-zinc-500">
            Aktuell kein aktiver Drop. Schau bald wieder vorbei.
          </div>
        )}

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {list.map((drop) => (
            <Link
              key={drop.id}
              href={`/drop/${drop.id}`}
              className="group overflow-hidden rounded-lg border-2 border-black transition hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000]"
            >
              {drop.image_urls[0] && (
                <div className="aspect-[16/9] overflow-hidden border-b-2 border-black bg-zinc-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={drop.image_urls[0]}
                    alt={drop.title}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <span className="inline-block bg-black px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-yellow-400">
                  {drop.status === "active" ? "Live" : "Bald"}
                </span>
                <h3 className="mt-2 text-xl font-bold">{drop.title}</h3>
                <p className="text-zinc-600">{drop.brand_name}</p>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <div className="text-xs text-zinc-500">Aktueller Preis</div>
                    <div className="text-2xl font-black tabular-nums">
                      <span className="bg-yellow-400 px-1">{drop.current_price.toFixed(2)} €</span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-zinc-600">
                    {drop.total_ordered} / {drop.max_units} Einheiten
                  </div>
                </div>

                <div className="mt-3 h-2 rounded-full border border-black bg-white">
                  <div
                    className="h-full rounded-full bg-yellow-400"
                    style={{
                      width: `${Math.min(100, (drop.total_ordered / drop.max_units) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-yellow-400">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-3xl font-black sm:text-4xl">Bereit, gemeinsam zu sparen?</h2>
          <p className="mx-auto mt-3 max-w-lg text-black/70">
            Schließ dich der Wheydrop-Community an und sichere dir den nächsten Drop, bevor er
            endet.
          </p>
          <a
            href="#drops"
            className="mt-8 inline-block rounded-full bg-black px-8 py-4 text-base font-black text-yellow-400 transition hover:bg-zinc-900"
          >
            Zu den Drops
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black px-6 py-10 text-center text-sm text-zinc-400">
        © {new Date().getFullYear()} Wheydrop. Alle Preise inkl. MwSt.
      </footer>
    </div>
  );
}
