import { createAdminClient } from "@/lib/supabase/admin";
import type { SupplierConfirmation } from "@/lib/types";
import { RahmenvertragAccordion } from "@/components/RahmenvertragAccordion";
import { ConfirmActions } from "./ConfirmActions";

export const revalidate = 0;

export default async function SupplierConfirmPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("supplier_confirmations")
    .select("*")
    .eq("confirm_token", token)
    .maybeSingle();

  const confirmation = data as SupplierConfirmation | null;

  if (!confirmation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6 text-center text-black">
        <p>Dieser Link ist ungültig.</p>
      </div>
    );
  }

  const totalUnits = confirmation.flavors.reduce((sum, f) => sum + f.quantity, 0);
  const totalValue = totalUnits * confirmation.unit_price;

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto max-w-2xl px-6 py-16">
        <span className="inline-block bg-yellow-400 px-3 py-1 text-xs font-black uppercase tracking-widest text-black">
          Mengen- und Preiszusage
        </span>
        <h1 className="mt-4 text-2xl font-bold">{confirmation.product_title}</h1>
        <p className="mt-1 text-zinc-600">Anfrage an {confirmation.supplier_name}</p>

        <div className="mt-6 rounded-lg border-2 border-black p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500">
                <th className="pb-2">Geschmacksrichtung</th>
                <th className="pb-2 text-right">Menge</th>
              </tr>
            </thead>
            <tbody>
              {confirmation.flavors.map((f, i) => (
                <tr key={i} className="border-t border-zinc-200">
                  <td className="py-2">{f.flavor}</td>
                  <td className="py-2 text-right tabular-nums">{f.quantity}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-black font-bold">
                <td className="py-2">Gesamt</td>
                <td className="py-2 text-right tabular-nums">{totalUnits}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 flex items-center justify-between border-t border-zinc-300 pt-4">
            <div>Preis pro Einheit</div>
            <div className="font-bold tabular-nums">{confirmation.unit_price.toFixed(2)} €</div>
          </div>
          <div className="mt-1 flex items-center justify-between text-zinc-600">
            <div>Gesamtwert (Referenz)</div>
            <div className="tabular-nums">{totalValue.toFixed(2)} €</div>
          </div>

          <div className="mt-4 border-t border-zinc-300 pt-4">
            <div className="text-sm text-zinc-500">Lieferzeit / Lieferbedingungen</div>
            <p className="mt-1 whitespace-pre-line">{confirmation.delivery_note}</p>
          </div>
        </div>

        <div className="mt-8 space-y-4 text-sm leading-relaxed text-zinc-700">
          <h2 className="text-base font-bold text-black">Bedingungen dieser Zusage</h2>
          <p>
            Mit Bestätigung dieser Zusage reservieren Sie die oben genannte Menge exklusiv für
            den betreffenden Wheydrop-Drop. Diese Menge darf ab Bestätigung nicht anderweitig
            verkauft, reserviert oder beworben werden, bis Wheydrop sie vollständig abgerufen
            hat. Eine nachträgliche Reduzierung der Menge oder Erhöhung des Preises nach
            Drop-Start ist ausgeschlossen, es sei denn, beide Seiten vereinbaren dies
            ausdrücklich schriftlich.
          </p>
          <p>
            Wird die zugesagte Menge von den Endkunden vollständig abgerufen, sind Sie
            verpflichtet, die gesamte zugesagte Menge zum zugesagten Preis zu liefern. Diese
            Lieferpflicht gilt unabhängig vom Absatzerfolg und ohne Mindestabnahmeschwelle:
            Wird nur ein Teil der Menge abgerufen, liefern Sie die tatsächlich abgerufene
            Menge zum zugesagten Preis. Bei Unterlieferung gilt die im
            Liefervertrag/Rahmenvertrag vereinbarte Vertragsstrafenregelung.
          </p>
          <p>
            Wheydrop selbst versendet keine Ware: Nach Drop-Ende erhalten Sie von uns eine
            Bestellliste mit den Endkunden-Adressen und versenden die Ware direkt an die
            Endkunden. Details (Fristen, Versandnachweis) siehe Rahmenvertrag unten.
          </p>
        </div>

        <div className="mt-4">
          <RahmenvertragAccordion supplierName={confirmation.supplier_name} />
        </div>

        {confirmation.status === "submitted" && (
          <div className="mt-8 rounded-lg border-2 border-black bg-zinc-50 p-6 text-center">
            <p className="font-bold">Diese Anfrage wird noch geprüft.</p>
            <p className="mt-1 text-sm text-zinc-600">
              Wir melden uns, sobald wir sie freigegeben haben.
            </p>
          </div>
        )}

        {confirmation.status === "admin_approved" && <ConfirmActions token={token} />}

        {confirmation.status === "confirmed" && (
          <div className="mt-8 rounded-lg border-2 border-black bg-green-50 p-6 text-center">
            <p className="font-bold">Zusage bestätigt.</p>
            <p className="mt-1 text-sm text-zinc-600">
              Bestätigt am{" "}
              {confirmation.confirmed_at &&
                new Date(confirmation.confirmed_at).toLocaleString("de-DE", {
                  timeZone: "Europe/Berlin",
                })}
              .
            </p>
          </div>
        )}

        {confirmation.status === "declined" && (
          <div className="mt-8 rounded-lg border-2 border-black bg-red-50 p-6 text-center">
            <p className="font-bold">Diese Zusage wurde abgelehnt.</p>
            <p className="mt-1 text-sm text-zinc-600">
              Bitte kontaktieren Sie uns direkt, falls sich etwas geändert hat.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
