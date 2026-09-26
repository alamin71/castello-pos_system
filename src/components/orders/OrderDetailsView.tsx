"use client";

import { useState } from "react";
import { Printer, Pencil, X, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderItemToppings } from "@/components/orders/OrderItemToppings";
import { StatusRing } from "@/components/orders/StatusRing";
import { PaymentMethodPicker } from "@/components/payment/PaymentMethodPicker";
import { cn } from "@/lib/utils";
import type { Order, PaymentMethodId } from "@/types/order.types";

const ORDER_TYPE_LABELS: Record<Order["type"], string> = {
    "dine-in": "Dine-In",
    "take-away": "Take Away",
    delivery: "Delivery",
};

export function OrderDetailsView({
    order,
    onClose,
    onCancelOrder,
    onSendToKitchen,
    onTakePayment,
}: {
    order: Order;
    onClose: () => void;
    onCancelOrder: () => void;
    onSendToKitchen: () => void;
    onTakePayment: (method: PaymentMethodId) => void;
}) {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>(
        order.paymentMethod ?? "cash"
    );
    const [prepMinutes, setPrepMinutes] = useState(5);

    return (
        <div>
            <div className="flex items-center justify-between px-8 py-5">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-white hover:bg-white/10"
                    >
                        <X className="size-4" />
                    </button>
                    <h1 className="text-xl font-bold text-white">Order Details</h1>
                </div>
                <div className="flex items-center gap-5 text-sm text-white/70">
                    <button className="flex items-center gap-1.5 hover:text-white">
                        <Printer className="size-4" /> Print Receipt
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-white">
                        <Pencil className="size-4" /> Edit Order
                    </button>
                    <button
                        onClick={onCancelOrder}
                        className="flex items-center gap-1.5 text-red-400 hover:text-red-300"
                    >
                        <X className="size-4" /> Cancel Order
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 px-8 pb-10 lg:grid-cols-[1fr_420px]">
                <div>
                    <div className="mb-4 flex flex-wrap gap-3">
                        <div className="rounded-lg bg-white/5 px-4 py-2">
                            <p className="text-xs text-white/40">Order ID</p>
                            <p className="text-sm font-medium text-white">{order.id}</p>
                        </div>
                        <div className="rounded-lg bg-white/5 px-4 py-2">
                            <p className="text-xs text-white/40">Order Type</p>
                            <p className="text-sm font-medium text-white">{ORDER_TYPE_LABELS[order.type]}</p>
                        </div>
                        <div className="rounded-lg bg-white/5 px-4 py-2">
                            <p className="text-xs text-white/40">Platform</p>
                            <p className="text-sm font-medium text-white">{order.platform}</p>
                        </div>
                    </div>

                    <p className="mb-3 text-sm text-white/60">{order.items.length} Items</p>
                    <div className="flex flex-col gap-3">
                        {order.items.map((item) => (
                            <div key={item.id} className="rounded-xl bg-white/5 p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="font-medium text-white">{item.name}</p>
                                        {item.size && <p className="text-xs text-white/40">{item.size}</p>}
                                        {item.toppings && (
                                            <OrderItemToppings
                                                toppings={item.toppings}
                                                extraCount={item.extraToppingsCount}
                                                extraPrice={item.extraToppingsPrice}
                                                className="mt-2"
                                            />
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-white/50">Qty: {item.qty}</p>
                                        <p className="font-semibold text-white">
                                            {item.lineTotal.toLocaleString()} kr.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="rounded-xl bg-white/5 p-4">
                        <div className="flex items-center justify-between">
                            <StatusRing status={order.status} placedAt={order.placedAt} />
                            {order.status === "preparing" && (
                                <div className="flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1">
                                    <button
                                        onClick={() => setPrepMinutes((m) => Math.max(m - 1, 0))}
                                        className="flex size-6 items-center justify-center rounded-md bg-white/10 text-white"
                                    >
                                        <Minus className="size-3" />
                                    </button>
                                    <span className="w-6 text-center text-sm font-medium text-white">
                                        {prepMinutes}
                                    </span>
                                    <button
                                        onClick={() => setPrepMinutes((m) => m + 1)}
                                        className="flex size-6 items-center justify-center rounded-md bg-white/10 text-white"
                                    >
                                        <Plus className="size-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="mb-2 text-sm font-semibold text-white">Customer Info</p>
                        <div className="rounded-lg bg-white/5 px-4 py-3 text-sm text-white">
                            {order.customer.isGuest ? "Guest" : order.customer.name}
                        </div>
                    </div>

                    <div>
                        <p className="mb-2 text-sm font-semibold text-white">Payment Summary</p>
                        <div className="rounded-lg bg-white/5 p-4 text-sm">
                            <div className="flex justify-between py-1 text-white/60">
                                <span>Total Amount</span>
                                <span className="text-white">{order.total.toLocaleString()} kr.</span>
                            </div>
                            <div className="flex justify-between py-1 text-white/60">
                                <span>Tax (11%)</span>
                                <span className="text-white">{order.tax.toLocaleString()} kr.</span>
                            </div>
                            <div className="flex justify-between py-1 text-white/60">
                                <span>Discount</span>
                                <span className="text-red-400">-{order.discount.toLocaleString()} kr.</span>
                            </div>
                            <div className="mt-2 flex justify-between border-t border-white/10 pt-2 font-semibold text-white">
                                <span>Total</span>
                                <span>{order.total.toLocaleString()} kr.</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="mb-2 text-sm font-semibold text-white">Payment Info</p>
                        <div
                            className={cn(
                                "rounded-lg bg-white/5 px-4 py-3 text-sm",
                                order.paymentStatus === "unpaid" ? "text-red-400" : "text-emerald-400"
                            )}
                        >
                            {order.paymentStatus === "unpaid" ? "Due | Pay at counter" : "Paid"}
                        </div>
                    </div>

                    {order.paymentStatus === "unpaid" && (
                        <div>
                            <p className="mb-2 text-sm font-semibold text-white">Payment Method</p>
                            <PaymentMethodPicker value={paymentMethod} onChange={setPaymentMethod} />
                        </div>
                    )}

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={onSendToKitchen}
                            className="h-12 flex-1 border-white/15 text-white"
                        >
                            Send to Kitchen
                        </Button>
                        {order.paymentStatus === "unpaid" && (
                            <Button
                                onClick={() => onTakePayment(paymentMethod)}
                                className="h-12 flex-1 bg-secondary text-white hover:bg-secondary/90"
                            >
                                Take Payment
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
