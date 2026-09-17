import type { Product } from "@/types/product.types";

export interface OfferSlotProductOption {
  product: Product;
  /** Restricts which of the product's variants this slot allows. Omitted = every variant. */
  variantIds?: string[];
}

export interface OfferSlot {
  categoryName: string;
  /** true = a single fixed item with no choice or toppings (e.g. "Breadsticks - Large"). */
  isFixed: boolean;
  products: OfferSlotProductOption[];
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  slots: OfferSlot[];
}
