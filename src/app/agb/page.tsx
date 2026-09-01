export default function AgbPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-2xl font-bold">Allgemeine Geschäftsbedingungen (B2C)</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Bestellst du als Unternehmer? Es gelten unsere{" "}
          <a href="/agb-b2b" className="underline">
            AGB für Geschäftskunden
          </a>
          .
        </p>

        <div className="mt-6 rounded-lg border-2 border-yellow-400 bg-yellow-50 p-4 text-sm text-zinc-700">
          <strong>Hinweis (nicht für Kunden sichtbar gedacht):</strong> Entwurf, an das
          Drop-Modell (Preisstufen, Autorisierung/Belastung erst bei Drop-Ende) angepasst. Vor
          Livegang bitte von einem Anwalt/einer Anwältin prüfen lassen — insbesondere
          Zahlungsabwicklung (Stripe), Gewährleistung und Gerichtsstand.
        </div>

        <h2 className="mt-10 text-lg font-bold">§ 1 Geltungsbereich, Vertragspartner</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen von Verbrauchern
          (§ 13 BGB) über die Plattform Wheydrop (wheydrop.fitskins.de). Vertragspartner ist:
        </p>
        <p className="mt-3 leading-relaxed text-zinc-700">
          FITSKINS – Christian Guzien
          <br />
          Köttlingerweg 11
          <br />
          44793 Bochum
          <br />
          Telefon: 0151/46300001
          <br />
          E-Mail: wheydrop@fitskins.de
        </p>

        <h2 className="mt-10 text-lg font-bold">§ 2 Das Drop-Prinzip</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Wheydrop vermittelt Gruppen-Einkäufe („Drops") für Nahrungsergänzungsmittel. Ein Drop
          läuft für einen festgelegten Zeitraum (in der Regel 48 Stunden). Der Preis pro Einheit
          sinkt in vorab veröffentlichten Preisstufen, je mehr Einheiten innerhalb des Drops
          bestellt werden. Alle Teilnehmer eines Drops zahlen am Ende einheitlich den niedrigsten
          Preis, der innerhalb des Drop-Zeitraums erreicht wurde – unabhängig davon, zu welchem
          Preis der einzelne Kunde bestellt hat.
        </p>

        <h2 className="mt-10 text-lg font-bold">§ 3 Vertragsschluss</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Die Darstellung der Drops auf der Plattform stellt kein bindendes Angebot unsererseits
          dar, sondern eine unverbindliche Aufforderung an den Kunden, ein Angebot abzugeben. Mit
          Absenden des Bestellformulars gibt der Kunde ein verbindliches Angebot zum Kauf der
          ausgewählten Menge zum zu diesem Zeitpunkt höchstmöglichen Preis der jeweils ersten
          Preisstufe ab. Der Vertrag kommt zustande, sobald wir die Bestellung durch eine
          Bestellbestätigungs-E-Mail annehmen.
        </p>

        <h2 className="mt-10 text-lg font-bold">§ 4 Preise, Zahlung, Autorisierung</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Alle angegebenen Preise sind Endpreise inklusive der gesetzlichen Umsatzsteuer, zzgl.
          der bei Bestellung ausgewiesenen Versandpauschale.
        </p>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Bei Bestellung wird zunächst nur der zu diesem Zeitpunkt maximal mögliche Preis
          (Preisstufe 1 zzgl. Versand) als Zahlungsautorisierung vorgemerkt. Tatsächlich
          belastet wird erst nach Ende des Drops und ausschließlich der final erreichte, für
          alle Teilnehmer geltende niedrigste Preis zzgl. Versandpauschale. Die Belastung erfolgt
          über den bei der Bestellung gewählten Zahlungsdienstleister.
        </p>

        <h2 className="mt-10 text-lg font-bold">§ 5 Lieferung</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Die Lieferung erfolgt innerhalb Deutschlands nach Ende des jeweiligen Drops, sobald die
          Gesamtmenge beim Hersteller bzw. Lieferanten abgerufen und an uns bzw. direkt an den
          Kunden versendet wurde. Eine voraussichtliche Lieferzeit wird auf der jeweiligen
          Drop-Seite angegeben. Sollte die zugesicherte Ware ganz oder teilweise nicht verfügbar
          sein, informieren wir betroffene Kunden unverzüglich und erstatten bereits belastete
          Beträge vollständig.
        </p>

        <h2 className="mt-10 text-lg font-bold">§ 6 Widerrufsrecht</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Verbrauchern steht ein gesetzliches Widerrufsrecht zu. Einzelheiten ergeben sich aus
          unserer{" "}
          <a href="/widerrufsrecht" className="underline">
            Widerrufsbelehrung
          </a>
          .
        </p>

        <h2 className="mt-10 text-lg font-bold">§ 7 Gewährleistung</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Es gilt das gesetzliche Mängelgewährleistungsrecht. Ansprüche wegen Sachmängeln
          verjähren bei Verbrauchern innerhalb der gesetzlichen Frist von zwei Jahren ab
          Ablieferung der Ware.
        </p>

        <h2 className="mt-10 text-lg font-bold">§ 8 Haftung</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Wir haften unbeschränkt bei Vorsatz, grober Fahrlässigkeit sowie für Schäden aus der
          Verletzung des Lebens, des Körpers oder der Gesundheit. Bei leicht fahrlässiger
          Verletzung wesentlicher Vertragspflichten (Kardinalpflichten) ist unsere Haftung auf
          den vertragstypischen, vorhersehbaren Schaden begrenzt. Im Übrigen ist die Haftung für
          leicht fahrlässige Pflichtverletzungen ausgeschlossen. Die vorstehenden
          Haftungsbeschränkungen gelten nicht bei Ansprüchen nach dem Produkthaftungsgesetz.
        </p>

        <h2 className="mt-10 text-lg font-bold">§ 9 Streitbeilegung</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
          bereit, abrufbar unter{" "}
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noreferrer" className="underline">
            ec.europa.eu/consumers/odr
          </a>
          . Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor
          einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>

        <h2 className="mt-10 text-lg font-bold">§ 10 Schlussbestimmungen</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des
          UN-Kaufrechts. Zwingende Verbraucherschutzvorschriften des Staates, in dem der Kunde
          seinen gewöhnlichen Aufenthalt hat, bleiben unberührt. Sollten einzelne Bestimmungen
          dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen davon
          unberührt.
        </p>

        <p className="mt-10 text-xs text-zinc-400">Stand: September 2026</p>
      </main>
    </div>
  );
}
