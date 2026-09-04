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

function Box({
  tone,
  children,
}: {
  tone: "neutral" | "green" | "red";
  children: React.ReactNode;
}) {
  const cls =
    tone === "green"
      ? "border-green-600 bg-green-50"
      : tone === "red"
      ? "border-red-600 bg-red-50"
      : "border-zinc-300 bg-zinc-50";
  return <div className={`rounded-lg border-2 p-4 ${cls}`}>{children}</div>;
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
  const missing: string[] = [];
  if (priceTiers.length < 2) {
    missing.push("Mindestens 2 vollständige VK-Preisstufen eintragen.");
  }
  if (purchaseTiers.length < 1) {
    missing.push("Mindestens eine vollständige Einkaufspreis-Stufe (EK) eintragen.");
  }

  const result = useMemo(() => {
    if (missing.length > 0) return { kind: "missing" as const };
    try {
      return { kind: "ok" as const, data: checkMarginWaterproof(priceTiers, purchaseTiers, dropMaxUnits) };
    } catch (err) {
      return { kind: "error" as const, message: err instanceof Error ? err.message : "Unbekannter Fehler" };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missing.length, priceTiers, purchaseTiers, dropMaxUnits]);

  if (result.kind === "missing") {
    return (
      <Box tone="neutral">
        <p className="font-semibold text-zinc-700">Noch nicht genug Daten für den Margen-Check.</p>
        <ul className="mt-1 list-disc pl-5 text-sm text-zinc-600">
          {missing.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </Box>
    );
  }

  if (result.kind === "error") {
    return (
      <Box tone="red">
        <p className="font-bold text-red-800">Fehler bei der Berechnung.</p>
        <p className="mt-1 text-sm text-red-800">{result.message}</p>
        <p className="mt-1 text-xs text-red-700">
          Bitte Einheiten-Bereiche der Preis- und Einkaufsstufen prüfen (Überschneidungen, Lücken,
          min &gt; max).
        </p>
      </Box>
    );
  }

  const check = result.data;

  if (check.ok) {
    return (
      <Box tone="green">
        <p className="font-bold text-green-800">✓ Ok — passt.</p>
        <p className="mt-1 text-sm text-green-800">
          Wird eine Preisstufe komplett verkauft und geht in die nächste (günstigere) über,
          steigt die Gesamtmarge trotzdem weiter — keine Stufe, die sich für euch nicht lohnt.
        </p>
      </Box>
    );
  }

  return (
    <Box tone="red">
      <p className="font-bold text-red-800">✕ So nicht — Marge bricht ein.</p>

      {check.negativeMarginTiers.length > 0 && (
        <div className="mt-2 space-y-1 text-sm text-red-800">
          {check.negativeMarginTiers.map((t) => (
            <p key={t.tierIndex}>
              Stufe {t.tierIndex + 1}: Marge/Einheit ist <strong>{eur(t.marginPerUnit)}</strong> —
              negativ. Verkaufspreis erhöhen oder Einkaufspreis dieser Stufe senken.
            </p>
          ))}
        </div>
      )}

      <div className="mt-2 space-y-3">
        {check.boundaries
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
    </Box>
  );
}
