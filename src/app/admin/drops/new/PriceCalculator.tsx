"use client";

import { useMemo, useState } from "react";
import { avgPurchasePrice } from "@/lib/pricing";
import type { PriceTier } from "@/lib/types";

const VAT = 0.19;
const STRIPE_PCT = 0.015;
const STRIPE_FIXED = 0.25;

interface CalcTier {
  gross: number;
  margin: number;
  net: number;
  vat: number;
  stripeFee: number;
  purchase: number;
  minUnits: number;
  maxUnits: number;
}

/** Gross price needed to hit a given per-unit margin, after VAT + Stripe fees. */
function grossForMargin(margin: number, purchase: number) {
  return (margin + purchase + STRIPE_FIXED) / (1 / (1 + VAT) - STRIPE_PCT);
}

function marginForGross(gross: number, purchase: number) {
  return gross / (1 + VAT) - gross * STRIPE_PCT - STRIPE_FIXED - purchase;
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

function buildTiers(purchase: number, volume: number, tierCount: number, minMargin: number, maxMargin: number): CalcTier[] {
  const size = Math.floor(volume / tierCount);
  return Array.from({ length: tierCount }, (_, i) => {
    const t = tierCount === 1 ? 0 : i / (tierCount - 1);
    const targetMargin = maxMargin - t * (maxMargin - minMargin);
    const gross = nicePrice(grossForMargin(targetMargin, purchase));
    const margin = marginForGross(gross, purchase);
    return {
      gross,
      margin,
      net: gross / (1 + VAT),
      vat: gross - gross / (1 + VAT),
      stripeFee: gross * STRIPE_PCT + STRIPE_FIXED,
      purchase,
      minUnits: i * size + 1,
      maxUnits: i === tierCount - 1 ? volume : (i + 1) * size,
    };
  });
}

function eur(n: number) {
  return n.toFixed(2).replace(".", ",") + " €";
}

function deNum(n: number) {
  return n.toLocaleString("de-DE");
}

export default function PriceCalculator({
  purchaseTiers,
  onApply,
}: {
  purchaseTiers: PriceTier[];
  onApply: (
    tiers: { min_units: string; max_units: string; price: string }[],
    maxUnits: number
  ) => void;
}) {
  const [open, setOpen] = useState(true);
  const [volume, setVolume] = useState("1000");
  const [minMargin, setMinMargin] = useState("2.5");
  const [maxMargin, setMaxMargin] = useState("11");
  const [tierCount, setTierCount] = useState(4);

  const v = parseInt(volume, 10) || 0;
  const hasPurchaseTiers = purchaseTiers.length > 0;
  const s = hasPurchaseTiers && v > 0 ? avgPurchasePrice(purchaseTiers, v) : 0;
  const mn = parseFloat(minMargin) || 0;
  const mx = parseFloat(maxMargin) || 0;
  const valid = hasPurchaseTiers && s > 0 && v > 0 && mn > 0 && mx > mn;

  const tiers = useMemo(() => (valid ? buildTiers(s, v, tierCount, mn, mx) : []), [valid, s, v, tierCount, mn, mx]);

  const bestTierIndex = useMemo(() => {
    if (!tiers.length) return -1;
    const totals = tiers.map((t) => t.maxUnits * t.margin);
    return totals.indexOf(Math.max(...totals));
  }, [tiers]);

  function apply() {
    if (!tiers.length) return;
    const formTiers = tiers.map((t, i) => ({
      min_units: i === 0 ? "0" : String(t.minUnits),
      max_units: i === tiers.length - 1 ? "" : String(t.maxUnits),
      price: t.gross.toFixed(2),
    }));
    onApply(formTiers, v);
  }

  return (
    <div className="rounded border border-zinc-300 bg-zinc-50">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-zinc-800"
      >
        Preis-Kalkulator
        <span className="text-xs font-normal text-zinc-500">{open ? "einklappen ▲" : "aufklappen ▼"}</span>
      </button>

      {open && (
        <div className="space-y-4 border-t border-zinc-300 px-4 py-4">
          {!hasPurchaseTiers ? (
            <p className="rounded border border-amber-400 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Trag oben zuerst die Einkaufspreis-Stufen (EK) ein — der Kalkulator rechnet damit.
            </p>
          ) : (
            <p className="text-xs text-zinc-600">
              Ø-Einkaufspreis bei {deNum(v)} Einheiten:{" "}
              <strong>{eur(s)}</strong> (aus den Einkaufspreis-Stufen oben)
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-xs text-zinc-600">
              Volumen (Einheiten)
              <input
                type="number"
                step="100"
                min="0"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="rounded border border-zinc-400 bg-white px-2 py-1.5 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-zinc-600">
              Min. Marge/Einheit (Netto €)
              <input
                type="number"
                step="0.5"
                min="0"
                value={minMargin}
                onChange={(e) => setMinMargin(e.target.value)}
                className="rounded border border-zinc-400 bg-white px-2 py-1.5 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-zinc-600">
              Max. Marge/Einheit (Netto €)
              <input
                type="number"
                step="0.5"
                min="0"
                value={maxMargin}
                onChange={(e) => setMaxMargin(e.target.value)}
                className="rounded border border-zinc-400 bg-white px-2 py-1.5 text-sm"
              />
            </label>
          </div>

          <div>
            <div className="mb-1.5 text-xs uppercase tracking-wide text-zinc-500">Anzahl Preisstufen</div>
            <div className="flex gap-1.5">
              {[2, 3, 4, 5].map((n) => (
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
            <p className="text-center text-sm text-zinc-500">Felder ausfüllen, um Kalkulation zu starten</p>
          ) : (
            <>
              <div className="space-y-2">
                {tiers.map((t, i) => (
                  <div key={i} className="rounded border border-zinc-300 bg-white p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-zinc-500">
                        Stufe {i + 1} · {deNum(t.minUnits)}–{deNum(t.maxUnits)} Einh.
                      </span>
                      <span className="text-lg font-semibold">{eur(t.gross)}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 border-t border-zinc-200 pt-2 text-xs text-zinc-500">
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
                        Marge
                        <div className="font-semibold text-green-700">{eur(t.margin)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="mb-1.5 mt-2 text-xs uppercase tracking-wide text-zinc-500">
                  Umsatz-Szenarien
                </div>
                <p className="mb-2 text-xs text-zinc-500">
                  Alle Käufer zahlen den Preis der jeweils erreichten Stufe.
                </p>
                <div className="space-y-2">
                  {tiers.map((t, i) => {
                    const units = t.maxUnits;
                    const grossRevenue = units * t.gross;
                    const toSupplier = units * t.purchase;
                    const totalMargin = units * t.margin;
                    const best = i === bestTierIndex;
                    return (
                      <div
                        key={i}
                        className={`rounded border bg-white p-3 ${best ? "border-green-600" : "border-zinc-300"}`}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-800">
                            Stufe {i + 1}
                            {best && (
                              <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">
                                Beste Marge
                              </span>
                            )}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {deNum(units)} Einh. × {eur(t.gross)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500">
                          <div>
                            Brutto-Umsatz
                            <div className="text-sm font-medium text-zinc-800">{eur(grossRevenue)}</div>
                          </div>
                          <div>
                            An Lieferant
                            <div className="text-sm text-zinc-700">{eur(toSupplier)}</div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between border-t border-zinc-200 pt-2">
                          <span className="text-xs text-zinc-500">Gesamtmarge</span>
                          <span className="text-lg font-semibold text-green-700">{eur(totalMargin)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={apply}
                className="w-full rounded-full bg-black py-2.5 text-sm font-bold text-yellow-400 hover:bg-zinc-900"
              >
                In Preisstufen &amp; Max. Kontingent übernehmen
              </button>
              <p className="text-center text-[11px] text-zinc-400">
                Stripe 1,5% + 0,25 € · MwSt. 19% · Alle Angaben ohne Gewähr
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
