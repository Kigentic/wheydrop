export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-2xl font-bold">Datenschutzerklärung</h1>

        <div className="mt-6 rounded-lg border-2 border-yellow-400 bg-yellow-50 p-4 text-sm text-zinc-700">
          <strong>Hinweis (nicht für Kunden sichtbar gedacht):</strong> Entwurf auf Basis
          des tatsächlich eingesetzten Stacks (Supabase, Resend, Vercel-Hosting). Kein
          Tracking/Analytics/Werbe-Pixel im Einsatz — Social-Share-Buttons sind reine
          Weiterleitungs-Links ohne eingebettete Drittanbieter-Skripte. Bitte vor Livegang
          von einem Anwalt/einer Anwältin bzw. Datenschutzbeauftragten gegenchecken lassen,
          insbesondere die Weitergabe an Hersteller/Lieferanten und ggf. nötige
          Auftragsverarbeitungsverträge (AVV) mit Supabase, Resend, Vercel und dem
          jeweiligen Hersteller.
        </div>

        <h2 className="mt-10 text-lg font-bold">1. Verantwortlicher</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Verantwortlicher im Sinne der DSGVO ist:
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

        <h2 className="mt-10 text-lg font-bold">2. Ihre Rechte im Überblick</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten
          personenbezogenen Daten, deren Herkunft, Empfänger und den Zweck der
          Datenverarbeitung (Art. 15 DSGVO) sowie das Recht auf Berichtigung (Art. 16
          DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18 DSGVO),
          Datenübertragbarkeit (Art. 20 DSGVO) und Widerspruch gegen die Verarbeitung (Art.
          21 DSGVO). Erteilte Einwilligungen können Sie jederzeit mit Wirkung für die
          Zukunft widerrufen (Art. 7 Abs. 3 DSGVO). Außerdem steht Ihnen ein
          Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu.
        </p>

        <h2 className="mt-10 text-lg font-bold">3. Hosting</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Wir hosten unsere Website bei Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA
          91789, USA (nachfolgend „Vercel"). Wenn Sie unsere Website besuchen, werden Ihre
          personenbezogenen Daten (insbesondere IP-Adresse) auf den Servern von Vercel
          verarbeitet, wobei eine Übermittlung in die USA nicht ausgeschlossen werden kann.
          Die Datenübertragung stützt sich, soweit einschlägig, auf die
          Standardvertragsklauseln der EU-Kommission. Rechtsgrundlage ist unser
          berechtigtes Interesse an einer zuverlässigen, performanten Bereitstellung
          unserer Plattform (Art. 6 Abs. 1 lit. f DSGVO). Details:{" "}
          <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer" className="underline">
            vercel.com/legal/privacy-policy
          </a>
          .
        </p>

        <h2 className="mt-10 text-lg font-bold">4. Server-Log-Dateien</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Beim Aufruf unserer Website erfasst unser Hosting-Anbieter automatisch
          Informationen (Server-Log-Dateien), die Ihr Browser übermittelt: Browsertyp und
          -version, verwendetes Betriebssystem, Referrer-URL, Uhrzeit der Serveranfrage
          und IP-Adresse. Eine Zusammenführung mit anderen Datenquellen findet nicht statt.
          Rechtsgrundlage ist unser berechtigtes Interesse an der technisch fehlerfreien
          Bereitstellung der Website (Art. 6 Abs. 1 lit. f DSGVO).
        </p>

        <h2 className="mt-10 text-lg font-bold">5. Kundenkonto (Registrierung &amp; Login)</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Wenn Sie ein Kundenkonto anlegen, erheben wir Vorname, Nachname, E-Mail-Adresse
          und ein von Ihnen gewähltes Passwort sowie optional Ihre Lieferadresse. Diese
          Daten dienen der Verwaltung Ihres Kontos, der Vorausfüllung künftiger
          Bestellungen und der Anzeige Ihrer Bestellhistorie. Für die Authentifizierung
          setzen wir ein technisch notwendiges Session-Cookie unseres
          Datenbank-/Auth-Anbieters Supabase (Supabase, Inc., 970 Toa Payoh North #07-04,
          Singapur) ein. Die Datenbank wird in einem Rechenzentrum innerhalb der
          Europäischen Union betrieben. Rechtsgrundlage ist die Vertragserfüllung bzw.
          Durchführung vorvertraglicher Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO). Details zu
          Supabase:{" "}
          <a href="https://supabase.com/privacy" target="_blank" rel="noreferrer" className="underline">
            supabase.com/privacy
          </a>
          .
        </p>

        <h2 className="mt-10 text-lg font-bold">6. Bestellung und Weitergabe an Hersteller/Lieferanten</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Zur Teilnahme an einem Drop erheben wir Vorname, Nachname, E-Mail-Adresse,
          Lieferadresse sowie die von Ihnen gewählte Sorte und Menge. Diese Daten
          verarbeiten wir zur Durchführung und Abwicklung Ihrer Bestellung, insbesondere
          zur Berechnung des autorisierten Höchstbetrags und des final erreichten
          Bestpreises sowie zum Versand einer Bestellbestätigung per E-Mail.
        </p>
        <p className="mt-3 leading-relaxed text-zinc-700">
          <strong>
            Zum Zweck der Auslieferung geben wir Ihren Namen, Ihre Lieferadresse sowie die
            bestellte Sorte und Menge an den Hersteller bzw. Lieferanten des jeweiligen
            Drops weiter,
          </strong>{" "}
          der die Ware in unserem Auftrag direkt an Sie versendet. Eine Weitergabe Ihrer
          Zahlungsdaten oder E-Mail-Adresse an den Hersteller erfolgt dabei nicht, soweit
          dies für den Versand nicht zwingend erforderlich ist. Mit dem jeweiligen
          Hersteller/Lieferanten besteht eine vertragliche Vereinbarung, die diesen zur
          zweckgebundenen Verwendung Ihrer Daten ausschließlich zur Auslieferung
          verpflichtet. Rechtsgrundlage für diese Weitergabe ist die Erfüllung des mit
          Ihnen geschlossenen Kaufvertrags (Art. 6 Abs. 1 lit. b DSGVO).
        </p>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Diese Bestelldaten werden bei uns in einer Datenbank unseres Anbieters Supabase
          gespeichert. Details zu Supabase siehe Ziffer 5.
        </p>

        <h2 className="mt-10 text-lg font-bold">7. Zahlungsabwicklung</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Für die Zahlungsautorisierung und -abwicklung ist die Anbindung eines
          Zahlungsdienstleisters (Stripe) vorgesehen. Sobald dieser produktiv im Einsatz
          ist, werden wir diese Datenschutzerklärung um die entsprechenden Angaben zu
          Anbieter, verarbeiteten Daten und Rechtsgrundlage ergänzen.
        </p>

        <h2 className="mt-10 text-lg font-bold">8. Drop Alarm (E-Mail-Benachrichtigung)</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Wenn Sie sich für den „Drop Alarm" anmelden, erheben wir Ihren Namen und Ihre
          E-Mail-Adresse. Wir versenden zunächst eine Bestätigungs-E-Mail
          (Double-Opt-in); erst nach Bestätigung durch Klick auf den enthaltenen Link
          erhalten Sie Benachrichtigungen zu neuen bzw. bevorstehenden Drops.
          Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Sie können
          diese jederzeit mit Wirkung für die Zukunft widerrufen, indem Sie uns unter
          wheydrop@fitskins.de kontaktieren; ein Abmeldelink wird ergänzt.
        </p>

        <h2 className="mt-10 text-lg font-bold">9. Versand von E-Mails</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Für den Versand von Bestätigungs-, Bestell- und Erinnerungs-E-Mails nutzen wir
          den Dienst Resend (Resend, Inc., USA). Dabei werden Ihre E-Mail-Adresse sowie
          der jeweilige E-Mail-Inhalt (z. B. Name, Bestelldetails) an Resend übermittelt
          und dort verarbeitet. Die Datenübertragung in die USA stützt sich, soweit
          einschlägig, auf die Standardvertragsklauseln der EU-Kommission.
          Rechtsgrundlage ist die Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO) bzw. bei
          Drop-Alarm-Mails Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Details:{" "}
          <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noreferrer" className="underline">
            resend.com/legal/privacy-policy
          </a>
          .
        </p>

        <h2 className="mt-10 text-lg font-bold">10. Cookies</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Wir setzen ausschließlich technisch notwendige Cookies ein, insbesondere ein
          Session-Cookie zur Aufrechterhaltung Ihres Logins (siehe Ziffer 5). Cookies zu
          Analyse-, Marketing- oder Werbezwecken werden derzeit nicht eingesetzt.
          Rechtsgrundlage für notwendige Cookies ist unser berechtigtes Interesse an einer
          technisch fehlerfreien Bereitstellung der Plattform (Art. 6 Abs. 1 lit. f
          DSGVO).
        </p>

        <h2 className="mt-10 text-lg font-bold">11. Social-Media-Verlinkungen</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Auf den Drop-Seiten bieten wir Buttons zum Teilen per WhatsApp, Facebook und
          Instagram an. Es handelt sich dabei um reine Weiterleitungs-Links (z. B.
          wa.me-Links) bzw. das Kopieren eines Textes in Ihre Zwischenablage – es werden
          keine Plugins der jeweiligen Anbieter in unsere Website eingebunden und keine
          Daten an diese Anbieter übertragen, solange Sie den Button nicht aktiv
          anklicken. Erst mit Klick verlassen Sie unsere Website und es gelten die
          Datenschutzbestimmungen des jeweiligen Anbieters.
        </p>

        <h2 className="mt-10 text-lg font-bold">12. Speicherdauer</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Soweit in dieser Erklärung keine speziellere Speicherdauer genannt wurde,
          verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck der Verarbeitung
          entfällt oder Sie ein berechtigtes Löschersuchen geltend machen – vorbehaltlich
          gesetzlicher Aufbewahrungspflichten (insbesondere handels- und
          steuerrechtlicher Fristen von bis zu 10 Jahren für Bestell- und
          Rechnungsdaten).
        </p>

        <h2 className="mt-10 text-lg font-bold">13. Beschwerderecht</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Ihnen steht bei Verstößen gegen die DSGVO ein Beschwerderecht bei einer
          Datenschutz-Aufsichtsbehörde zu, insbesondere in dem Mitgliedstaat Ihres
          gewöhnlichen Aufenthalts, Ihres Arbeitsplatzes oder des Orts des mutmaßlichen
          Verstoßes.
        </p>

        <p className="mt-10 text-xs text-zinc-400">Stand: September 2026</p>
      </main>
    </div>
  );
}
