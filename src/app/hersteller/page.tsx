import { ContactForm } from "./ContactForm";

export const metadata = {
  title: "Wheydrop für Hersteller",
  description:
    "Wheydrop ist ein kontrolliertes 48-Stunden-Absatzformat für Whey-Protein-Hersteller — ohne bestehende Händler-, Vertriebs- und Affiliate-Strukturen zu kannibalisieren.",
};

export default function HerstellerPage() {
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
            Für Hersteller &amp; Marken
          </span>
          <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight sm:text-6xl">
            Zusätzlicher Absatz, <span className="text-yellow-400">ohne</span> euer
            Händlernetz zu untergraben.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-zinc-200">
            Wheydrop ist ein kontrolliertes 48-Stunden-Absatzformat für Whey Protein —
            gebündelte Nachfrage von Endkunden und Studios, klar begrenzt, ohne
            Dauerrabatt.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#kontakt"
              className="rounded-full bg-yellow-400 px-8 py-4 text-base font-black text-black transition hover:bg-yellow-300"
            >
              Jetzt Kontakt aufnehmen
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

      {/* WAS IST WHEYDROP */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-2xl font-black sm:text-3xl">Was ist Wheydrop?</h2>
        <p className="mt-4 leading-relaxed text-zinc-700">
          Wheydrop ist eine Group-Buying-Plattform für Whey Protein. Endkunden und
          Fitnessstudios schließen sich für ein einzelnes Produkt zu einem zeitlich
          begrenzten „Drop" zusammen: Je mehr innerhalb von <strong>48 Stunden</strong>{" "}
          bestellt wird, desto weiter fällt der Preis in vorher festgelegten
          Preisstufen — und am Ende zahlen alle Teilnehmer einheitlich den niedrigsten
          erreichten Preis. Das erzeugt in kurzer Zeit gebündeltes, planbares Volumen
          für euch als Hersteller.
        </p>
      </section>

      {/* WARUM INTERESSANT */}
      <section className="border-y-2 border-black bg-black text-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="text-2xl font-black sm:text-3xl">Warum das für euch interessant ist</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <span className="text-3xl">📦</span>
              <h3 className="mt-3 text-lg font-bold">Planbares Volumen</h3>
              <p className="mt-2 text-sm text-zinc-300">
                Ein Drop bündelt Nachfrage in einem festen 48-Stunden-Fenster — ihr
                wisst vorher genau, welche Menge maximal abgerufen werden kann.
              </p>
            </div>
            <div>
              <span className="text-3xl">🎯</span>
              <h3 className="mt-3 text-lg font-bold">Direkter Zugang zu Endkunden &amp; Studios</h3>
              <p className="mt-2 text-sm text-zinc-300">
                Wheydrop erreicht sowohl Einzelkäufer als auch Fitnessstudios — ein
                zusätzlicher Absatzkanal, ohne eigenen Marketing-Aufwand von eurer Seite.
              </p>
            </div>
            <div>
              <span className="text-3xl">🛡️</span>
              <h3 className="mt-3 text-lg font-bold">Kein Dauerrabatt-Kanal</h3>
              <p className="mt-2 text-sm text-zinc-300">
                Der reduzierte Preis gilt ausschließlich während des jeweiligen
                48-Stunden-Drops. Danach ist er weg — Wheydrop wird nicht zum
                dauerhaften Tiefpreis-Kanal.
              </p>
            </div>
            <div>
              <span className="text-3xl">🤝</span>
              <h3 className="mt-3 text-lg font-bold">Eure Konditionen, eure Kontrolle</h3>
              <p className="mt-2 text-sm text-zinc-300">
                Ihr legt die Preisstufen und die dahinterliegenden Konditionen selbst
                fest. Eure interne Kalkulation müsst ihr uns gegenüber nicht offenlegen.
              </p>
            </div>
            <div className="sm:col-span-2">
              <span className="text-3xl">🚀</span>
              <h3 className="mt-3 text-lg font-bold">Neue Kunden für eure Marke</h3>
              <p className="mt-2 text-sm text-zinc-300">
                Ein Drop bringt euch nicht nur Volumen, sondern auch Sichtbarkeit bei
                Leuten, die eure Marke vorher gar nicht kannten. Wer über den Bestpreis
                zum ersten Mal probiert und überzeugt ist, kauft danach zum regulären
                Preis weiter — ihr gewinnt Neukunden, die euch sonst nie gefunden
                hätten.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-lg border-2 border-yellow-400 bg-zinc-900 p-6">
            <p className="font-bold text-yellow-400">Wichtig — Schutz eurer bestehenden Strukturen</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-200">
              Wheydrop soll bestehende Händler-, Außendienst- oder Affiliate-Strukturen
              ausdrücklich <strong>nicht</strong> ersetzen. Drops sind zeitlich begrenzte
              Zusatzaktionen mit klar definierten Kontingenten und können auf Wunsch auf
              ausgewählte Produkte, Sondergebinde oder Aktionsware begrenzt werden.
            </p>
          </div>
        </div>
      </section>

      {/* SO FUNKTIONIERT'S */}
      <section id="so-funktionierts" className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-2xl font-black sm:text-3xl">So läuft ein Drop ab</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg border-2 border-black p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-lg font-black text-yellow-400">
              1
            </div>
            <h3 className="mt-3 font-bold">48 Stunden</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Jeder Drop läuft exakt 48 Stunden — klar begrenzt, kein Dauerangebot.
            </p>
          </div>
          <div className="rounded-lg border-2 border-black p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-lg font-black text-yellow-400">
              2
            </div>
            <h3 className="mt-3 font-bold">3 Preisstufen</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Z. B. ab 250, ab 500 und ab 1.000 verkauften Einheiten — die Konditionen
              dahinter legt ihr fest.
            </p>
          </div>
          <div className="rounded-lg border-2 border-black p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-lg font-black text-yellow-400">
              3
            </div>
            <h3 className="mt-3 font-bold">Ihr fulfillt direkt</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Nach Drop-Ende bekommt ihr die Bestelldaten und versendet die Ware
              direkt an die Käufer.
            </p>
          </div>
        </div>
      </section>

      {/* WAS WIR BRAUCHEN */}
      <section className="border-t-2 border-black bg-yellow-50">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="text-2xl font-black sm:text-3xl">Was wir von euch brauchen</h2>
          <ul className="mt-6 space-y-3 text-zinc-700">
            <li className="flex gap-3">
              <span className="text-yellow-500">●</span>
              Ein Produkt für den Testlauf, idealerweise mit wenigen
              Geschmacksrichtungen.
            </li>
            <li className="flex gap-3">
              <span className="text-yellow-500">●</span>
              Drei Mengenstufen (z. B. ab 250 / ab 500 / ab 1.000 Einheiten) mit den
              jeweiligen Konditionen.
            </li>
            <li className="flex gap-3">
              <span className="text-yellow-500">●</span>
              Angaben zu Fulfillment &amp; Versandkosten — idealerweise versendet ihr
              direkt an die Käufer.
            </li>
            <li className="flex gap-3">
              <span className="text-yellow-500">●</span>
              Bestätigte Verfügbarkeit der zugesagten Menge für den Drop-Zeitraum.
            </li>
          </ul>
          <p className="mt-6 text-sm text-zinc-600">
            Alles Weitere (Mengenzusage, Vertragsstrafe bei Unterlieferung,
            Fulfillment-Details) regeln wir in einem kurzen Liefervertrag, bevor ein
            Drop live geht.
          </p>
        </div>
      </section>

      {/* KONTAKT */}
      <section id="kontakt" className="bg-black text-white">
        <div className="mx-auto max-w-2xl px-6 py-20">
          <div className="text-center">
            <span className="inline-block bg-yellow-400 px-3 py-1 text-xs font-black uppercase tracking-widest text-black">
              Interesse?
            </span>
            <h2 className="mt-5 text-2xl font-black sm:text-3xl">Sprecht uns an</h2>
            <p className="mx-auto mt-3 max-w-md text-zinc-300">
              Schreibt uns kurz, wer ihr seid und was euch interessiert — wir melden
              uns zeitnah zurück.
            </p>
          </div>

          <div className="mt-8 text-black">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
