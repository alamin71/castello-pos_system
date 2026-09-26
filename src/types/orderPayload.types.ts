// Request/response shapes for POST /orders — mirrors castello-backend's
// order.validation.ts / order.interface.ts exactly, since the server re-derives every price
// from these ids and never trusts a client-sent amount.

export type OrderItemType = "regular" | "offer" | "half_and_half" | "make_your_own";
export type OrderTypeValue = "takeaway" | "home_delivery" | "dine_in";
export type PlatformValue = "website" | "kiosk" | "pos";
export type PaymentMethodValue = "cash_on_delivery" | "cash" | "card" | "stripe" | "online_giro" | "aur";

export interface ToppingSelectionPayload {
  toppingItemId: string;
  quantity: number;
}

export interface HalfPayload {
  productId: string;
  variantItemId?: string;
  toppingSelections?: ToppingSelectionPayload[];
  removedDefaultToppingItemIds?: string[];
}

export interface BundleSelectionPayload {
  slotIndex: number;
  productId: string;
  variantItemId?: string;
  toppingSelections?: ToppingSelectionPayload[];
  removedDefaultToppingItemIds?: string[];
}

export interface OrderItemPayload {
  type: OrderItemType;
  productId?: string;
  offerId?: string;
  variantItemId?: string;
  quantity: number;
  toppingSelections?: ToppingSelectionPayload[];
  removedDefaultToppingItemIds?: string[];
  needsKitchen?: boolean;
  halfAndHalf?: { firstHalf: HalfPayload; secondHalf: HalfPayload };
  bundleSelections?: BundleSelectionPayload[];
}

export interface GuestInfoPayload {
  name: string;
  phone?: string;
}

export interface CreateOrderPayload {
  guestInfo?: GuestInfoPayload;
  branchId: string;
  orderType: OrderTypeValue;
  platform: PlatformValue;
  items: OrderItemPayload[];
  voucherCode?: string;
  payment: { method: PaymentMethodValue };
  deliveryAddress?: {
    deliveryAddress: string;
    addressInfo?: string;
    location?: { lat: number; lng: number };
    instructions?: string;
  };
  tableNumber?: string;
  notes?: string;
}

export interface CreateOrderResponse {
  _id: string;
  orderId: string;
  status: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  total: number;
  payment: {
    method: PaymentMethodValue;
    status: string;
    receivedAmount?: number;
    changeAmount?: number;
  };
}
