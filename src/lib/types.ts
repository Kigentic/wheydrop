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
  description: string;
  image_urls: string[];
  purchase_price: number | null;
  reminder_24h_sent_at: string | null;
  reminder_start_sent_at: string | null;
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
  customer_id: string | null;
  quantity: number;
  authorized_amount: number;
  final_amount: number | null;
  stripe_payment_intent: string | null;
  status: OrderStatus;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_address: {
    street: string;
    zip: string;
    city: string;
    country: string;
  };
  created_at: string;
}

export type SupplierConfirmationStatus = "pending" | "confirmed" | "declined";

export interface SupplierConfirmationFlavor {
  flavor: string;
  quantity: number;
}

export interface SupplierConfirmation {
  id: string;
  drop_id: string | null;
  supplier_name: string;
  supplier_email: string;
  product_title: string;
  flavors: SupplierConfirmationFlavor[];
  unit_price: number;
  delivery_note: string;
  status: SupplierConfirmationStatus;
  confirm_token: string;
  confirmed_at: string | null;
  confirmed_ip: string | null;
  created_at: string;
}
