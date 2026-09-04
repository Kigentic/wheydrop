"use client";

import { useMemo } from "react";
import { checkMarginWaterproof } from "@/lib/pricing";
import type { PriceTier } from "@/lib/types";

function eur(n: number) {
  return n.toFixed(2).replace(".", ",") + " €";
}

function deNum(n: number) {
  return n.toLocaleString("de-DE");
}

export default function MarginCheck({
  priceTiers,
  purchaseTiers,
  dropMaxUnits,
}: {
  priceTiers: PriceTier[];
  purchaseTiers: PriceTier[];
  dropMaxUnits?: number;
}) {
  const validPrice = priceTiers.every(
    (t) => Number.isFinite(t.min_units) && Number.isFinite(t.price) && t.price > 0
  );
  const validPurchase =
    purchaseTiers.length > 0 &&
    purchaseTiers.every(
      (t) => Number.isFinite(t.min_units) && Number.isFinite(t.price) && t.price > 0
    );

  const result = useMemo(() => {
    if (!validPrice || !validPurchase || priceTiers.length < 1) return null;
    try {
      return checkMarginWaterproof(priceTiers, purchaseTiers, dropMaxUnits);
    } catch {
      return null;
    }
  }, [validPrice, validPurchase, priceTiers, purchaseTiers, dropMaxUnits]);

  if (!validPrice || !validPurchase) {
    return (
      <p className="text-xs text-zinc-500">
        Preisstufen und mindestens eine Einkaufspreis-Stufe ausfüllen, um die Margen-Prüfung
        zu sehen.
      </p>
    );
  }

  if (!result) return null;

  if (result.ok) {
    return (
      <div className="rounded-lg border-2 border-green-600 bg-green-50 p-4">
        <p className="font-bold text-green-800">✓ Ok — passt.</p>
        <p className="mt-1 text-sm text-green-800">
          Wird eine Preisstufe komplett verkauft und geht in die nächste (günstigere) über,
          steigt die Gesamtmarge trotzdem weiter — kein Stufe, die sich für euch nicht lohnt.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border-2 border-red-600 bg-red-50 p-4">
      <p className="font-bold text-red-800">✕ So nicht — Marge bricht ein.</p>

      {result.negativeMarginTiers.length > 0 && (
        <div className="mt-2 space-y-1 text-sm text-red-800">
          {result.negativeMarginTiers.map((t) => (
            <p key={t.tierIndex}>
              Stufe {t.tierIndex + 1}: Marge/Einheit ist <strong>{eur(t.marginPerUnit)}</strong> —
              negativ. Verkaufspreis erhöhen oder Einkaufspreis dieser Stufe senken.
            </p>
          ))}
        </div>
      )}

      <div className="mt-2 space-y-3">
        {result.boundaries
          .filter((b) => !b.ok)
          .map((b, i) => (
            <div key={i} className="rounded border border-red-300 bg-white p-3 text-sm">
              <p className="font-semibold text-red-800">
                Stufe voll verkauft ({deNum(b.unitsBefore)} Einh. à {eur(b.vkBefore)}) vs.
                nächste Stufe voll verkauft ({deNum(b.unitsAfter)} Einh. à {eur(b.vkAfter)}):
              </p>
              <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-zinc-700">
                <div>
                  Gesamtmarge bei {deNum(b.unitsBefore)}: <strong>{eur(b.totalMarginBefore)}</strong>
                </div>
                <div>
                  Gesamtmarge bei {deNum(b.unitsAfter)}:{" "}
                  <strong className="text-red-700">{eur(b.totalMarginAfter)}</strong>
                </div>
                <div>Ø-EK bei {deNum(b.unitsBefore)}: {eur(b.avgEkBefore)}</div>
                <div>Ø-EK bei {deNum(b.unitsAfter)}: {eur(b.avgEkAfter)}</div>
              </div>
              <p className="mt-2 text-zinc-800">
                <strong>Mach besser so:</strong> Ø-Einkaufspreis muss bei {deNum(b.unitsAfter)}{" "}
                Einheiten spätestens bei <strong>{eur(b.requiredAvgEk)}</strong> liegen (aktuell{" "}
                {eur(b.avgEkAfter)}) — EK-Stufe früher ansetzen oder an dieser Stelle stärker
                senken. Sonst lohnt sich der Verkauf über {deNum(b.unitsBefore)} Einheiten
                hinaus nicht.
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
