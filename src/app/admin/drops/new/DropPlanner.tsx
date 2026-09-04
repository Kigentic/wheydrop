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
  /** The EK actually charged for units newly sold within this tier's bracket. */
  tierEk: number;
  /** Cumulative weighted-average EK across ALL units up to maxUnits (used for total-margin accounting). */
  avgEkCumulative: number;
  /** Margin per unit against this tier's own EK — what you asked for. */
  margin: number;
  corrected: boolean;
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

/** Like nicePrice, but always rounds UP so the result is guaranteed >= raw. */
function nicePriceUp(raw: number) {
  const whole = Math.floor(raw);
  if (raw <= whole + 0.5) return whole + 0.5;
  if (raw <= whole + 0.9) return whole + 0.9;
  return whole + 1.5;
}

/**
 * Tier boundaries to plan against, each with the EK bracket price that
 * applies to units newly sold within it. If the purchase tiers are
 * themselves staggered (more than one bracket), the VK tiers are aligned
 * 1:1 to those EK brackets — so "Stufe 1" always means exactly what the
 * supplier quoted for that bracket, never a blend across a bracket
 * boundary. Only when the purchase price is flat (a single bracket) is
 * there no natural break point, so the volume is divided evenly into the
 * requested tier count instead (using that same flat price throughout).
 */
function computeBoundaries(
  purchaseTiers: PriceTier[],
  volume: number,
  tierCount: number
): { maxUnits: number; tierEk: number }[] {
  const sorted = [...purchaseTiers].sort((a, b) => a.min_units - b.min_units);

  if (sorted.length > 1) {
    const rows = sorted
      .map((t) => ({ maxUnits: Math.min(t.max_units ?? volume, volume), tierEk: t.price }))
      .filter((r) => r.maxUnits > 0 && r.maxUnits <= volume);
    // dedupe by maxUnits, keep the last (cheapest, since sorted ascending) tier for that boundary
    const byUnits = new Map<number, number>();
    rows.forEach((r) => byUnits.set(r.maxUnits, r.tierEk));
    const result = Array.from(byUnits.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([maxUnits, tierEk]) => ({ maxUnits, tierEk }));
    if (result.length > 1) {
      if (result[result.length - 1].maxUnits !== volume) {
        result.push({ maxUnits: volume, tierEk: sorted[sorted.length - 1].price });
      }
      return result;
    }
  }

  const flatEk = sorted[0]?.price ?? 0;
  const size = Math.floor(volume / tierCount);
  return Array.from({ length: tierCount }, (_, i) => ({
    maxUnits: i === tierCount - 1 ? volume : (i + 1) * size,
    tierEk: flatEk,
  }));
}

/**
 * Builds VK tiers whose price decreases from marginFirst (tier 1) toward
 * marginLast (final tier), then walks the tiers left to right and bumps any
 * tier's price up just enough to guarantee its TOTAL margin never falls
 * below the previous tier's — so the result is always "wasserdicht" by
 * construction, not just checked after the fact.
 */
function buildPlannedTiers(
  purchaseTiers: PriceTier[],
  volume: number,
  tierCount: number,
  marginFirst: number,
  marginLast: number
): PlannedTier[] {
  const boundaries = computeBoundaries(purchaseTiers, volume, tierCount);
  const n = boundaries.length;

  let minUnits = 1;
  let prevTotalMargin = -Infinity;

  return boundaries.map(({ maxUnits, tierEk }, i) => {
    const t = n === 1 ? 0 : i / (n - 1);
    const targetMargin = marginFirst - t * (marginFirst - marginLast);
    const avgEkCumulative = avgPurchasePrice(purchaseTiers, maxUnits);

    // Solve the price against THIS tier's own EK bracket, not the blended
    // average — "ich zahl 29 € EK hier, will X Marge drauf" is the mental
    // model, and the blended figure only matters for total-margin math.
    let gross = nicePrice(grossForMargin(targetMargin, tierEk));
    let margin = marginForGross(gross, tierEk);
    let totalMargin = maxUnits * marginForGross(gross, avgEkCumulative);
    let corrected = false;

    if (i > 0 && totalMargin < prevTotalMargin) {
      const requiredMarginPerUnit = prevTotalMargin / maxUnits;
      gross = nicePriceUp(grossForMargin(requiredMarginPerUnit, avgEkCumulative));
      margin = marginForGross(gross, tierEk);
      totalMargin = maxUnits * marginForGross(gross, avgEkCumulative);
      corrected = true;
    }

    const tier: PlannedTier = {
      minUnits,
      maxUnits,
      gross,
      net: gross / (1 + VAT),
      vat: gross - gross / (1 + VAT),
      stripeFee: gross * STRIPE_PCT + STRIPE_FIXED,
      tierEk,
      avgEkCumulative,
      margin,
      corrected,
    };

    minUnits = maxUnits + 1;
    prevTotalMargin = totalMargin;
    return tier;
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
  const ekIsStaggered = purchaseTiers.length > 1;
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
    const totals = plannedTiers.map((t) => t.maxUnits * marginForGross(t.gross, t.avgEkCumulative));
    return totals.indexOf(Math.max(...totals));
  }, [plannedTiers]);

  const anyCorrected = plannedTiers.some((t) => t.corrected);

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
              Rechnet mit dem echten Einkaufspreis aus den EK-Stufen oben — jede Stufe hier
              entspricht 1:1 einer EK-Stufe, kein Verschmieren über Bracket-Grenzen hinweg.
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

          {ekIsStaggered ? (
            <p className="text-xs text-zinc-500">
              Preisstufen folgen automatisch euren {purchaseTiers.length} EK-Stufen oben (eine
              VK-Stufe pro EK-Stufe).
            </p>
          ) : (
            <div>
              <div className="mb-1.5 text-xs uppercase tracking-wide text-zinc-500">
                Anzahl Preisstufen (EK ist noch flach, keine natürlichen Bruchstellen)
              </div>
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
          )}

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
                    ? anyCorrected
                      ? "✓ Wasserdicht — eine oder mehrere Stufen wurden automatisch nach oben korrigiert, damit die Gesamtmarge nirgends sinkt (siehe „angepasst“-Markierung unten)."
                      : "✓ Wasserdicht — Gesamtmarge sinkt an keiner Stufe."
                    : "✕ Trotz automatischer Korrektur nicht wasserdicht — Marge-Range enger wählen oder EK-Stufen anpassen."}
                </div>
              )}

              <div className="space-y-2">
                {plannedTiers.map((t, i) => {
                  const units = t.maxUnits;
                  const grossRevenue = units * t.gross;
                  const toSupplier = units * t.avgEkCumulative;
                  const totalMargin = units * marginForGross(t.gross, t.avgEkCumulative);
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
                          {t.corrected && (
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                              angepasst
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
                          EK dieser Stufe
                          <div className="text-zinc-800">{eur(t.tierEk)}</div>
                        </div>
                        <div>
                          Marge (auf EK dieser Stufe)
                          <div className="font-semibold text-green-700">{eur(t.margin)}</div>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2 border-t border-zinc-200 pt-2 text-xs text-zinc-500">
                        <div>
                          Brutto-Umsatz
                          <div className="text-sm font-medium text-zinc-800">{eur(grossRevenue)}</div>
                        </div>
                        <div>
                          An Lieferant (Ø-EK {eur(t.avgEkCumulative)} kumuliert)
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
