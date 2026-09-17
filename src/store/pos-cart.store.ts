"use client";

import { create } from "zustand";
import type { OrderItemTopping, OrderType } from "@/types/order.types";

export interface PosCartBundleSubItem {
  name: string;
  variantLabel?: string;
  toppings?: OrderItemTopping[];
  extraToppingsCount?: number;
  extraToppingsPrice?: number;
}

export interface PosCartLine {
  id: string;
  productId: string;
  name: string;
  variantLabel: string;
  image: string;
  qty: number;
  unitPrice: number;
  toppings?: OrderItemTopping[];
  extraToppingsCount?: number;
  extraToppingsPrice?: number;
  /** Plain-text fallback shown instead of topping chips — used for Half & Half lines,
   * which combine two independent topping sets that don't fit one chip summary. */
  description?: string;
  /** Offer/bundle sub-items — the bundle's own price is flat, so only each sub-item's
   * extra toppings add to `extraToppingsPrice`; picking a different product/variant per
   * slot never changes the line's price. */
  bundleItems?: PosCartBundleSubItem[];
}

interface PosCartState {
  orderType: OrderType;
  lines: PosCartLine[];
  setOrderType: (type: OrderType) => void;
  addLine: (line: Omit<PosCartLine, "id">) => void;
  updateQty: (id: string, qty: number) => void;
  removeLine: (id: string) => void;
  clear: () => void;
}

export const usePosCartStore = create<PosCartState>()((set) => ({
  orderType: "dine-in",
  lines: [],
  setOrderType: (orderType) => set({ orderType }),
  addLine: (line) =>
    set((state) => ({
      lines: [...state.lines, { ...line, id: `${line.productId}-${Date.now()}` }],
    })),
  updateQty: (id, qty) =>
    set((state) => ({
      lines:
        qty <= 0
          ? state.lines.filter((l) => l.id !== id)
          : state.lines.map((l) => (l.id === id ? { ...l, qty } : l)),
    })),
  removeLine: (id) => set((state) => ({ lines: state.lines.filter((l) => l.id !== id) })),
  clear: () => set({ lines: [] }),
}));

export function posCartLineTotal(line: PosCartLine) {
  return (line.unitPrice + (line.extraToppingsPrice ?? 0)) * line.qty;
}

export function posCartTotal(lines: PosCartLine[]) {
  return lines.reduce((sum, l) => sum + posCartLineTotal(l), 0);
}
