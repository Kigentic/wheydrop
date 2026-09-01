"use client";

import { useState } from "react";

export function RahmenvertragAccordion({ supplierName }: { supplierName?: string }) {
  const [open, setOpen] = useState(false);
  const name = supplierName?.trim() || "[Hersteller/Lieferant]";

  return (
    <div className="rounded-lg border-2 border-black">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left font-bold"
      >
        Rahmenvertrag lesen (vollständiger Vertragstext)
        <span className="text-xl">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="max-h-96 overflow-y-auto border-t-2 border-black px-4 py-4 text-sm leading-relaxed text-zinc-700">
          <p className="text-xs text-zinc-500">
            zwischen FITSKINS – Christian Guzien, Köttlingerweg 11, 44793 Bochum
            („Wheydrop") und {name} („Lieferant")
          </p>

          <h3 className="mt-4 font-bold text-black">§ 1 Vertragsgegenstand</h3>
          <p className="mt-1">
            Wheydrop betreibt eine Plattform für zeitlich begrenzte Gruppen-Einkäufe
            („Drops"), bei denen eine im Voraus festgelegte Maximalmenge eines Produkts zu
            gestaffelten Preisen an Endkunden verkauft wird. Gegenstand dieses Vertrags ist
            die Belieferung von Wheydrop mit dem vom Lieferanten angebotenen Produkt für
            einen oder mehrere konkret vereinbarte Drops gemäß den Einzelbestellungen nach
            § 3.
          </p>

          <h3 className="mt-4 font-bold text-black">§ 2 Garantierte Menge und Preis</h3>
          <p className="mt-1">
            Reicht der Lieferant über das Angebotsformular eine Menge und einen Preis ein
            und wird diese Zusage von Wheydrop angenommen, ist die genannte Menge ab
            Annahme <strong>exklusiv für den jeweiligen Drop reserviert</strong>. Der
            Lieferant verpflichtet sich, diese Menge während der gesamten Drop-Laufzeit
            (in der Regel 48 Stunden ab Drop-Start) sowie bis zum vollständigen Abruf durch
            Wheydrop nicht anderweitig zu verkaufen, zu reservieren oder zu bewerben.
          </p>
          <p className="mt-1">
            Wird die zugesagte Menge innerhalb des Drops von den Endkunden vollständig
            abgerufen, ist der Lieferant verpflichtet, die gesamte zugesagte Menge zum
            zugesagten Preis zu liefern — unabhängig davon, ob der Lieferant die Ware
            zwischenzeitlich anderweitig hätte teurer verkaufen können. Eine nachträgliche
            Reduzierung der zugesagten Menge oder Preiserhöhung nach Drop-Start ist
            ausgeschlossen, es sei denn, beide Parteien vereinbaren dies ausdrücklich
            schriftlich (z. B. bei höherer Gewalt gemäß § 6).
          </p>

          <h3 className="mt-4 font-bold text-black">§ 3 Einzelbestellung je Drop</h3>
          <p className="mt-1">
            Jeder konkrete Drop wird durch eine gesonderte, auf diesen Rahmenvertrag Bezug
            nehmende Einreichung über das Angebotsformular ausgelöst, die mindestens
            enthält: Produkt, Geschmacksrichtungen mit jeweiliger Höchstmenge,
            Einkaufspreis pro Einheit, Lieferzeit/Lieferbedingungen. Mit Annahme durch
            Wheydrop und finaler Bestätigung durch den Lieferanten wird die
            Einzelbestellung verbindlicher Bestandteil dieses Vertrags.
          </p>

          <h3 className="mt-4 font-bold text-black">§ 4 Lieferzeit und Lieferort</h3>
          <p className="mt-1">
            Der Lieferant liefert die vom Drop tatsächlich abgerufene Menge gemäß den in
            der jeweiligen Einzelbestellung genannten Lieferbedingungen. Teillieferungen
            sind nur nach vorheriger Zustimmung von Wheydrop zulässig.
          </p>

          <h3 className="mt-4 font-bold text-black">§ 5 Vertragsstrafe bei Unterlieferung</h3>
          <p className="mt-1">
            Liefert der Lieferant weniger als die zugesagte und von Endkunden abgerufene
            Menge, ist er verpflichtet, Wheydrop je nicht gelieferter Einheit eine
            Vertragsstrafe in Höhe von 100 % des vereinbarten Einkaufspreises dieser
            Einheit zzgl. eines Aufschlags von 20 % zu zahlen, unabhängig vom Nachweis
            eines tatsächlichen Schadens. Der Nachweis eines darüber hinausgehenden
            Schadens bleibt Wheydrop unbenommen; die Vertragsstrafe wird auf einen
            weitergehenden Schadensersatzanspruch angerechnet. Die Vertragsstrafe entfällt
            nur bei Vorliegen eines Falls höherer Gewalt gemäß § 6, sofern der Lieferant
            Wheydrop unverzüglich, spätestens jedoch 24 Stunden nach Kenntnis eines
            Lieferengpasses, informiert.
          </p>

          <h3 className="mt-4 font-bold text-black">§ 6 Höhere Gewalt</h3>
          <p className="mt-1">
            Ereignisse höherer Gewalt, die eine Lieferung unmöglich machen, befreien den
            Lieferanten von der Vertragsstrafe nach § 5, nicht jedoch von der Pflicht zur
            unverzüglichen Information und zur anteiligen Rückabwicklung mit Wheydrop.
          </p>

          <h3 className="mt-4 font-bold text-black">§ 7 Qualität und Spezifikation</h3>
          <p className="mt-1">
            Der Lieferant sichert zu, dass die gelieferte Ware der im Angebot genannten
            Produktspezifikation entspricht und alle in Deutschland/der EU geltenden
            lebensmittelrechtlichen Vorschriften einhält.
          </p>

          <h3 className="mt-4 font-bold text-black">§ 8 Zahlungsbedingungen</h3>
          <p className="mt-1">
            Zahlung erfolgt innerhalb 14 Tagen nach Wareneingang bzw. nach
            Rechnungsstellung, sofern in der Einzelbestellung nichts anderes vereinbart
            ist.
          </p>

          <h3 className="mt-4 font-bold text-black">§ 9 Laufzeit und Kündigung</h3>
          <p className="mt-1">
            Dieser Rahmenvertrag gilt auf unbestimmte Zeit und kann von beiden Parteien mit
            einer Frist von vier Wochen zum Monatsende gekündigt werden. Bereits
            bestätigte Einzelbestellungen bleiben von einer Kündigung unberührt und sind
            vollständig abzuwickeln.
          </p>

          <h3 className="mt-4 font-bold text-black">§ 10 Haftung</h3>
          <p className="mt-1">
            Es gelten die gesetzlichen Haftungsregeln, soweit in diesem Vertrag nichts
            Abweichendes geregelt ist. Für Ansprüche aus § 5 (Vertragsstrafe) gilt die dort
            getroffene Regelung vorrangig.
          </p>

          <h3 className="mt-4 font-bold text-black">§ 11 Schlussbestimmungen</h3>
          <p className="mt-1">
            Änderungen und Ergänzungen dieses Vertrags sowie der Einzelbestellungen
            bedürfen der Textform (E-Mail bzw. elektronische Bestätigung über dieses
            Formular genügt). Es gilt deutsches Recht. Gerichtsstand für Kaufleute ist
            Bochum. Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit
            der übrigen Bestimmungen unberührt.
          </p>

          <p className="mt-4 text-xs text-zinc-500">
            Hinweis: Entwurf, kein Rechtsrat. Individuell abweichende Konditionen können
            zwischen den Parteien gesondert vereinbart werden.
          </p>
        </div>
      )}
    </div>
  );
}
