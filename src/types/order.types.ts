export type OrderType = "dine-in" | "take-away" | "delivery";
export type Platform = "POS" | "KIOSK" | "WEB";
export type PaymentStatus = "paid" | "unpaid";
export type PaymentMethodId = "teya" | "cash" | "card" | "gift-card";

export type OrderStatus =
  | "order-placed"
  | "sent-to-kitchen"
  | "preparing"
  | "prepared"
  | "completed"
  | "cancelled";

export type ToppingState = "default" | "added" | "removed";

export interface OrderItemTopping {
  name: string;
  state: ToppingState;
  qty?: number;
  /** true for a topping that isn't part of the product's default recipe at all */
  isNew?: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  size?: string;
  image?: string;
  toppings?: OrderItemTopping[];
  extraToppingsCount?: number;
  extraToppingsPrice?: number;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderCustomer {
  name: string;
  phone?: string;
  address?: string;
  isGuest: boolean;
}

export interface Order {
  id: string;
  type: OrderType;
  platform: Platform;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethodId;
  status: OrderStatus;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  placedAt: string;
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodId, string> = {
  teya: "Teya",
  cash: "Cash",
  card: "Card Pay",
  "gift-card": "Gift Card",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  "order-placed": "Order Placed",
  "sent-to-kitchen": "Sent to Kitchen",
  preparing: "Preparing",
  prepared: "Prepared",
  completed: "Completed",
  cancelled: "Cancelled",
};
