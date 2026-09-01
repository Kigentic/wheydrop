import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DropAlertForm } from "@/components/DropAlertForm";
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
          src="/header_mobile.png"
          alt="Wheydrop Community"
          className="absolute inset-0 block h-full w-full object-cover sm:hidden"
          style={{ objectPosition: "center 15%" }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/wheydrop_header.png"
          alt="Wheydrop Community"
          className="absolute inset-0 hidden h-full w-full object-cover sm:block"
          style={{ objectPosition: "center 15%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent sm:bg-gradient-to-r sm:from-black/90 sm:via-black/50 sm:to-transparent" />

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
            <div className="text-3xl font-black">Fair</div>
            <div className="text-xs font-bold uppercase tracking-wide">Bestpreis automatisch für alle</div>
          </div>
          <div>
            <div className="text-3xl font-black">Direkt</div>
            <div className="text-xs font-bold uppercase tracking-wide">Vom Hersteller zu dir</div>
          </div>
          <div>
            <div className="text-3xl font-black">48h</div>
            <div className="text-xs font-bold uppercase tracking-wide">Pro Drop, dann vorbei</div>
          </div>
        </div>
      </section>

      {/* DROP ALARM (top) */}
      <section className="border-b-2 border-black bg-black text-white">
        <div className="mx-auto max-w-2xl px-6 py-14 text-center">
          <span className="inline-block bg-yellow-400 px-3 py-1 text-xs font-black uppercase tracking-widest text-black">
            Verpass keinen Drop
          </span>
          <h2 className="mt-5 text-2xl font-black sm:text-3xl">
            Sichere dir den <span className="text-yellow-400">Bestpreis</span> — bevor er weg ist
          </h2>
          <p className="mx-auto mt-3 max-w-md text-zinc-300">
            Drop Alarm aktivieren und als Erster erfahren, wenn ein neuer Drop startet.
            Kostenlos, jederzeit abbestellbar.
          </p>
          <div className="mt-7">
            <DropAlertForm dark />
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
            <h3 className="mt-4 text-lg font-bold">Preisstufen live erreichen</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Sobald genug Bestellungen zusammenkommen, springt der Preis auf die nächste,
              günstigere Stufe — live sichtbar, für alle gleichzeitig.
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
          <div className="mx-auto mt-12 max-w-lg rounded-lg border-2 border-dashed border-zinc-300 p-10 text-center">
            <p className="text-zinc-500">Aktuell kein aktiver Drop.</p>
            <p className="mt-1 mb-6 font-semibold text-black">
              Aktivier den Drop Alarm, dann verpasst du den nächsten nicht.
            </p>
            <DropAlertForm />
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
                {drop.status === "active" && Date.parse(drop.ends_at) < Date.now() ? (
                  <span className="inline-block bg-zinc-300 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-zinc-700">
                    Beendet
                  </span>
                ) : drop.status === "active" ? (
                  <span className="inline-block bg-black px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-yellow-400">
                    Live
                  </span>
                ) : (
                  <span className="inline-block border-2 border-black bg-yellow-400 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-black">
                    Bald · {new Date(drop.starts_at).toLocaleString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "Europe/Berlin",
                    })}{" "}
                    Uhr
                  </span>
                )}
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

      {/* DROP ALARM (bottom) */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <span className="inline-block bg-yellow-400 px-3 py-1 text-xs font-black uppercase tracking-widest text-black">
            Drop Alarm
          </span>
          <h2 className="mt-5 text-3xl font-black sm:text-4xl">
            Keinen Drop mehr verpassen
          </h2>
          <p className="mx-auto mt-3 max-w-md text-zinc-300">
            Trag dich ein und wir schicken dir eine Nachricht, sobald der nächste Drop startet.
          </p>
          <div className="mt-8">
            <DropAlertForm dark />
          </div>
        </div>
      </section>
    </div>
  );
}
