export const VAT = 0.19;
export const STRIPE_PCT = 0.015;
export const STRIPE_FIXED = 0.25;

/** Margin per unit for a given gross price, after VAT + Stripe fees and purchase cost. */
export function marginForGross(gross: number, purchase: number) {
  return gross / (1 + VAT) - gross * STRIPE_PCT - STRIPE_FIXED - purchase;
}
