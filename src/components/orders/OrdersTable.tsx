"use client";

import { Utensils, ShoppingBag, Bike } from "lucide-react";
import { cn } from "@/lib/utils";
import { PAYMENT_METHOD_LABELS, ORDER_STATUS_LABELS } from "@/types/order.types";
import type { Order } from "@/types/order.types";

const TYPE_ICON: Record<Order["type"], typeof Utensils> = {
    "dine-in": Utensils,
    "take-away": ShoppingBag,
    delivery: Bike,
};

const TYPE_LABEL: Record<Order["type"], string> = {
    "dine-in": "Dine In",
    "take-away": "Take Away",
    delivery: "Delivery",
};

const STATUS_COLOR: Record<Order["status"], string> = {
    "order-placed": "text-amber-400",
    "sent-to-kitchen": "text-orange-400",
    preparing: "text-violet-400",
    prepared: "text-sky-400",
    completed: "text-emerald-400",
    cancelled: "text-red-400",
};

export function OrdersTable({
    orders,
    onSelect,
}: {
    orders: Order[];
    onSelect: (order: Order) => void;
}) {
    return (
        <div className="overflow-x-auto rounded-xl">
            <table className="w-full min-w-[900px] border-collapse text-sm">
                <thead>
                    <tr className="text-left text-white/40">
                        <th className="px-4 py-3 font-medium">Order</th>
                        <th className="px-4 py-3 font-medium">Customer Info</th>
                        <th className="px-4 py-3 font-medium">Amount</th>
                        <th className="px-4 py-3 font-medium">Platform</th>
                        <th className="px-4 py-3 font-medium">Payment Via</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => {
                        const Icon = TYPE_ICON[order.type];
                        return (
                            <tr
                                key={order.id}
                                onClick={() => onSelect(order)}
                                className="relative cursor-pointer border-t border-white/5 bg-white/[0.02] transition-colors hover:bg-white/5"
                            >
                                <td className="relative px-4 py-4">
                                    <span
                                        className={cn(
                                            "absolute top-0 left-0 rounded-tl-lg rounded-br-lg px-2 py-0.5 text-[10px] font-semibold text-white",
                                            order.paymentStatus === "unpaid" ? "bg-red-500" : "bg-emerald-500"
                                        )}
                                    >
                                        {order.paymentStatus === "unpaid" ? "Unpaid" : "Paid"}
                                    </span>
                                    <div className="mt-4 flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-white/70">
                                            <Icon className="size-4" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{order.id}</p>
                                            <p className="text-xs text-white/40">
                                                {TYPE_LABEL[order.type]} • {order.items.length} Item
                                                {order.items.length !== 1 && "s"}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <p className="text-white">{order.customer.name}</p>
                                    {order.customer.phone && (
                                        <p className="text-xs text-white/40">{order.customer.phone}</p>
                                    )}
                                </td>
                                <td className="px-4 py-4 font-medium text-white">
                                    {order.total.toLocaleString()} kr.
                                </td>
                                <td className="px-4 py-4">
                                    <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-white/70">
                                        {order.platform}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-white/70">
                                    {order.paymentMethod ? PAYMENT_METHOD_LABELS[order.paymentMethod] : "Not found"}
                                </td>
                                <td className={cn("px-4 py-4 font-medium", STATUS_COLOR[order.status])}>
                                    {ORDER_STATUS_LABELS[order.status]}
                                </td>
                            </tr>
                        );
                    })}
                    {orders.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-4 py-10 text-center text-white/40">
                                No orders found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
