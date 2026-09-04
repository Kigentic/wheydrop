"use client";

import { useMemo, useState } from "react";
import { avgPurchasePrice, marginForGross, checkMarginWaterproof, VAT, STRIPE_PCT, STRIPE_FIXED } from "@/lib/pricing";
import type { PriceTier } from "@/lib/types";

interface PlannedTier {
  minUnits: number;
  maxUnits: number;
  gross: number;
  net: number;
  vat: number;
  stripeFee: number;
  avgEk: number;
  margin: number;
}

/** Gross price needed to hit a given per-unit margin, after VAT + Stripe fees. */
function grossForMargin(margin: number, purchase: number) {
  return (margin + purchase + STRIPE_FIXED) / (1 / (1 + VAT) - STRIPE_PCT);
}

/** Round to a psychologically nice price ending in .50 / .90 / next .50 */
function nicePrice(raw: number) {
  const cents = Math.round(raw * 100);
  const whole = Math.floor(cents / 100);
  const rest = cents % 100;
  if (rest <= 50) return whole + 0.5;
  if (rest <= 90) return whole + 0.9;
  return whole + 1.5;
}

function buildPlannedTiers(
  purchaseTiers: PriceTier[],
  volume: number,
  tierCount: number,
  marginFirst: number,
  marginLast: number
): PlannedTier[] {
  const size = Math.floor(volume / tierCount);
  return Array.from({ length: tierCount }, (_, i) => {
    const t = tierCount === 1 ? 0 : i / (tierCount - 1);
    const targetMargin = marginFirst - t * (marginFirst - marginLast);
    const maxUnits = i === tierCount - 1 ? volume : (i + 1) * size;
    const avgEk = avgPurchasePrice(purchaseTiers, maxUnits);
    const gross = nicePrice(grossForMargin(targetMargin, avgEk));
    const margin = marginForGross(gross, avgEk);
    return {
      minUnits: i * size + 1,
      maxUnits,
      gross,
      net: gross / (1 + VAT),
      vat: gross - gross / (1 + VAT),
      stripeFee: gross * STRIPE_PCT + STRIPE_FIXED,
      avgEk,
      margin,
    };
  });
}

function eur(n: number) {
  return n.toFixed(2).replace(".", ",") + " €";
}

function deNum(n: number) {
  return n.toLocaleString("de-DE");
}

export default function DropPlanner({
  purchaseTiers,
  onApply,
}: {
  purchaseTiers: PriceTier[];
  onApply: (
    tiers: { min_units: string; max_units: string; price: string }[],
    volume: number
  ) => void;
}) {
  const [open, setOpen] = useState(true);
  const [volume, setVolume] = useState("4000");
  const [marginLast, setMarginLast] = useState("2.5");
  const [marginFirst, setMarginFirst] = useState("11");
  const [tierCount, setTierCount] = useState(4);

  const hasPurchaseTiers = purchaseTiers.length > 0;
  const v = parseInt(volume, 10) || 0;
  const mLast = parseFloat(marginLast) || 0;
  const mFirst = parseFloat(marginFirst) || 0;
  const valid = hasPurchaseTiers && v > 0 && mLast > 0 && mFirst > mLast;

  const plannedTiers = useMemo(
    () => (valid ? buildPlannedTiers(purchaseTiers, v, tierCount, mFirst, mLast) : []),
    [valid, purchaseTiers, v, tierCount, mFirst, mLast]
  );

  const check = useMemo(() => {
    if (plannedTiers.length < 2) return null;
    const asPriceTiers: PriceTier[] = plannedTiers.map((t, i) => ({
      min_units: i === 0 ? 0 : t.minUnits,
      max_units: i === plannedTiers.length - 1 ? null : t.maxUnits,
      price: t.gross,
    }));
    try {
      return checkMarginWaterproof(asPriceTiers, purchaseTiers, v);
    } catch {
      return null;
    }
  }, [plannedTiers, purchaseTiers, v]);

  const bestTierIndex = useMemo(() => {
    if (!plannedTiers.length) return -1;
    const totals = plannedTiers.map((t) => t.maxUnits * t.margin);
    return totals.indexOf(Math.max(...totals));
  }, [plannedTiers]);

  function apply() {
    if (!plannedTiers.length) return;
    const formTiers = plannedTiers.map((t, i) => ({
      min_units: i === 0 ? "0" : String(t.minUnits),
      max_units: i === plannedTiers.length - 1 ? "" : String(t.maxUnits),
      price: t.gross.toFixed(2),
    }));
    onApply(formTiers, v);
  }

  return (
    <div className="rounded border-2 border-black bg-zinc-50">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-bold text-zinc-800"
      >
        Drop-Planer — geilster &amp; wirtschaftlich bester Drop
        <span className="text-xs font-normal text-zinc-500">{open ? "einklappen ▲" : "aufklappen ▼"}</span>
      </button>

      {open && (
        <div className="space-y-4 border-t-2 border-black px-4 py-4">
          {!hasPurchaseTiers ? (
            <p className="rounded border border-amber-400 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Trag oben zuerst die Einkaufspreis-Stufen (EK) ein — der Planer rechnet damit.
            </p>
          ) : (
            <p className="text-xs text-zinc-600">
              Rechnet mit dem gewichteten Ø-Einkaufspreis aus den EK-Stufen oben — nicht mit
              einem flachen Wert.
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-xs text-zinc-600">
              Gesamtmenge (Einheiten)
              <input
                type="number"
                step="100"
                min="0"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="rounded border border-zinc-400 bg-white px-2 py-1.5 text-sm"
              />
            </label>
            <div />
            <label className="flex flex-col gap-1 text-xs text-zinc-600">
              Meine Marge, Stufe 1 (höchste, Netto €)
              <input
                type="number"
                step="0.5"
                min="0"
                value={marginFirst}
                onChange={(e) => setMarginFirst(e.target.value)}
                className="rounded border border-zinc-400 bg-white px-2 py-1.5 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-zinc-600">
              Meine Marge, letzte Stufe (volles Volumen, Netto €)
              <input
                type="number"
                step="0.5"
                min="0"
                value={marginLast}
                onChange={(e) => setMarginLast(e.target.value)}
                className="rounded border border-zinc-400 bg-white px-2 py-1.5 text-sm"
              />
            </label>
          </div>

          <div>
            <div className="mb-1.5 text-xs uppercase tracking-wide text-zinc-500">Anzahl Preisstufen</div>
            <div className="flex gap-1.5">
              {[2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setTierCount(n)}
                  className={`flex-1 rounded border py-1.5 text-sm font-medium ${
                    tierCount === n ? "border-black bg-black text-yellow-400" : "border-zinc-400 bg-white text-zinc-700"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {!valid ? (
            <p className="text-center text-sm text-zinc-500">Felder ausfüllen, um zu rechnen</p>
          ) : (
            <>
              {check && (
                <div
                  className={`rounded border-2 p-3 text-sm ${
                    check.ok ? "border-green-600 bg-green-50 text-green-800" : "border-red-600 bg-red-50 text-red-800"
                  }`}
                >
                  {check.ok
                    ? "✓ Wasserdicht — Gesamtmarge sinkt an keiner Stufe."
                    : "✕ Nicht wasserdicht — Marge-Range oder EK-Stufen anpassen (Details im Margen-Check unten nach dem Übernehmen)."}
                </div>
              )}

              <div className="space-y-2">
                {plannedTiers.map((t, i) => {
                  const units = t.maxUnits;
                  const grossRevenue = units * t.gross;
                  const toSupplier = units * t.avgEk;
                  const totalMargin = units * t.margin;
                  const best = i === bestTierIndex;
                  return (
                    <div
                      key={i}
                      className={`rounded border bg-white p-3 ${best ? "border-green-600" : "border-zinc-300"}`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-800">
                          Stufe {i + 1} · {deNum(t.minUnits)}–{deNum(t.maxUnits)} Einh.
                          {best && (
                            <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">
                              Beste Marge
                            </span>
                          )}
                        </span>
                        <span className="text-lg font-semibold">{eur(t.gross)}</span>
                      </div>
                      <div className="grid grid-cols-5 gap-2 border-t border-zinc-200 pt-2 text-xs text-zinc-500">
                        <div>
                          Netto
                          <div className="text-zinc-800">{eur(t.net)}</div>
                        </div>
                        <div>
                          MwSt.
                          <div className="text-zinc-800">{eur(t.vat)}</div>
                        </div>
                        <div>
                          Stripe
                          <div className="text-zinc-800">{eur(t.stripeFee)}</div>
                        </div>
                        <div>
                          Ø-EK
                          <div className="text-zinc-800">{eur(t.avgEk)}</div>
                        </div>
                        <div>
                          Marge
                          <div className="font-semibold text-green-700">{eur(t.margin)}</div>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2 border-t border-zinc-200 pt-2 text-xs text-zinc-500">
                        <div>
                          Brutto-Umsatz
                          <div className="text-sm font-medium text-zinc-800">{eur(grossRevenue)}</div>
                        </div>
                        <div>
                          An Lieferant
                          <div className="text-sm text-zinc-700">{eur(toSupplier)}</div>
                        </div>
                        <div>
                          Gesamtmarge
                          <div className="text-sm font-semibold text-green-700">{eur(totalMargin)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={apply}
                className="w-full rounded-full bg-black py-2.5 text-sm font-bold text-yellow-400 hover:bg-zinc-900"
              >
                In Preisstufen &amp; Max. Kontingent übernehmen
              </button>
              <p className="text-center text-[11px] text-zinc-400">
                Stripe 1,5% + 0,25 € · MwSt. 19% · Versandpauschale separat, nicht Teil der
                Marge · Alle Angaben ohne Gewähr
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
