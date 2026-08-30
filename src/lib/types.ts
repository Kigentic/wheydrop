export type DropStatus = "upcoming" | "active" | "closed";
export type OrderStatus = "authorized" | "captured" | "cancelled" | "refunded";

export interface PriceTier {
  min_units: number;
  max_units: number | null;
  price: number;
}

export interface Drop {
  id: string;
  title: string;
  brand_name: string;
  status: DropStatus;
  starts_at: string;
  ends_at: string;
  price_tiers: PriceTier[];
  max_units: number;
  total_ordered: number;
  current_price: number;
  created_at: string;
}

export interface Variant {
  id: string;
  drop_id: string;
  flavor: string;
  available_units: number;
  ordered_units: number;
}

export interface Order {
  id: string;
  drop_id: string;
  variant_id: string;
  quantity: number;
  authorized_amount: number;
  final_amount: number | null;
  stripe_payment_intent: string | null;
  status: OrderStatus;
  customer_name: string;
  customer_email: string;
  customer_address: {
    street: string;
    zip: string;
    city: string;
    country: string;
  };
  created_at: string;
}
