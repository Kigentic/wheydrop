import type { PriceTier } from "./types";

export const VAT = 0.19;
export const STRIPE_PCT = 0.015;
export const STRIPE_FIXED = 0.25;
export const SHIPPING_FLAT = 4.99;

/** Margin per unit for a given gross price, after VAT + Stripe fees and purchase cost. */
export function marginForGross(gross: number, purchase: number) {
  return gross / (1 + VAT) - gross * STRIPE_PCT - STRIPE_FIXED - purchase;
}

/**
 * Weighted-average purchase cost per unit for a given total volume, where the
 * supplier bills per-unit cost in brackets (like tax brackets): the first N
 * units cost tier-1 price, the next M units cost tier-2 price, etc. Bracket
 * tiers must be sorted ascending by min_units and are treated as non-retroactive.
 */
export function avgPurchasePrice(purchaseTiers: PriceTier[], totalUnits: number): number {
  if (totalUnits <= 0 || purchaseTiers.length === 0) return 0;
  const sorted = [...purchaseTiers].sort((a, b) => a.min_units - b.min_units);
  let remaining = totalUnits;
  let cost = 0;
  for (const tier of sorted) {
    if (remaining <= 0) break;
    const tierCap = tier.max_units === null ? Infinity : tier.max_units - tier.min_units + 1;
    const unitsInTier = Math.min(remaining, tierCap);
    cost += unitsInTier * tier.price;
    remaining -= unitsInTier;
  }
  return cost / totalUnits;
}

export interface MarginBoundaryResult {
  fromTierIndex: number;
  toTierIndex: number;
  unitsBefore: number;
  unitsAfter: number;
  vkBefore: number;
  vkAfter: number;
  avgEkBefore: number;
  avgEkAfter: number;
  marginPerUnitBefore: number;
  marginPerUnitAfter: number;
  totalMarginBefore: number;
  totalMarginAfter: number;
  ok: boolean;
  /** Max average EK allowed at the new threshold to keep total margin non-decreasing. */
  requiredAvgEk: number;
}

export interface MarginCheckResult {
  ok: boolean;
  boundaries: MarginBoundaryResult[];
  /** Any tier where margin per unit itself is negative. */
  negativeMarginTiers: { tierIndex: number; marginPerUnit: number }[];
}

/**
 * Checks whether rising sell-price tiers (price_tiers) combined with bracketed
 * purchase-price tiers (purchase_tiers) ever cause TOTAL margin to drop when a
 * tier is fully sold through and volume moves on into the next, cheaper sell
 * tier — i.e. fully selling the next tier ends up earning less than fully
 * selling the previous one. Also flags any tier with a negative per-unit
 * margin.
 *
 * Compares full-tier-to-full-tier (not the single unit at the threshold):
 * the very first unit of a new tier is never a fair comparison, since there's
 * no volume cushion yet to offset the price cut. For an open-ended last tier
 * (no max_units), dropMaxUnits — the drop's realistic overall cap — stands in
 * for "fully sold".
 */
export function checkMarginWaterproof(
  priceTiers: PriceTier[],
  purchaseTiers: PriceTier[],
  dropMaxUnits?: number
): MarginCheckResult {
  const sorted = [...priceTiers].sort((a, b) => a.min_units - b.min_units);
  const boundaries: MarginBoundaryResult[] = [];
  const negativeMarginTiers: { tierIndex: number; marginPerUnit: number }[] = [];

  sorted.forEach((tier, i) => {
    const unitsAtMax = tier.max_units ?? dropMaxUnits ?? tier.min_units;
    const avgEk = avgPurchasePrice(purchaseTiers, Math.max(unitsAtMax, 1));
    const marginPerUnit = marginForGross(tier.price, avgEk);
    if (marginPerUnit < 0) {
      negativeMarginTiers.push({ tierIndex: i, marginPerUnit });
    }
  });

  for (let i = 0; i < sorted.length - 1; i++) {
    const prev = sorted[i];
    const next = sorted[i + 1];
    if (prev.max_units === null) continue;

    const unitsBefore = prev.max_units;
    const unitsAfter = next.max_units ?? dropMaxUnits ?? next.min_units;
    if (unitsAfter <= unitsBefore) continue;

    const avgEkBefore = avgPurchasePrice(purchaseTiers, unitsBefore);
    const avgEkAfter = avgPurchasePrice(purchaseTiers, unitsAfter);

    const marginPerUnitBefore = marginForGross(prev.price, avgEkBefore);
    const marginPerUnitAfter = marginForGross(next.price, avgEkAfter);

    const totalMarginBefore = marginPerUnitBefore * unitsBefore;
    const totalMarginAfter = marginPerUnitAfter * unitsAfter;

    const netVkAfter = next.price / (1 + VAT) - next.price * STRIPE_PCT - STRIPE_FIXED;
    const requiredAvgEk = netVkAfter - totalMarginBefore / unitsAfter;

    boundaries.push({
      fromTierIndex: i,
      toTierIndex: i + 1,
      unitsBefore,
      unitsAfter,
      vkBefore: prev.price,
      vkAfter: next.price,
      avgEkBefore,
      avgEkAfter,
      marginPerUnitBefore,
      marginPerUnitAfter,
      totalMarginBefore,
      totalMarginAfter,
      ok: totalMarginAfter >= totalMarginBefore,
      requiredAvgEk,
    });
  }

  return {
    ok: boundaries.every((b) => b.ok) && negativeMarginTiers.length === 0,
    boundaries,
    negativeMarginTiers,
  };
}
