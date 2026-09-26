"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaymentMethodPicker } from "@/components/payment/PaymentMethodPicker";
import { CartLineDetails } from "@/components/create-order/CartLineDetails";
import { cn } from "@/lib/utils";
import { posCartLineTotal, posCartTotal, type PosCartLine } from "@/store/pos-cart.store";
import type { PaymentMethodId } from "@/types/order.types";
import type { OrderTypeValue } from "@/types/orderPayload.types";

const ORDER_TYPES: { id: OrderTypeValue; label: string }[] = [
    { id: "dine_in", label: "Dine-In" },
    { id: "takeaway", label: "Take Away" },
    { id: "home_delivery", label: "Delivery" },
];

export interface CheckoutCustomerInfo {
    isGuest: boolean;
    name: string;
    phone: string;
    tableNumber: string;
    deliveryAddress: string;
}

export function CheckoutView({
    orderId,
    lines,
    orderType,
    onOrderTypeChange,
    onBack,
    onProceed,
}: {
    orderId: string;
    lines: PosCartLine[];
    orderType: OrderTypeValue;
    onOrderTypeChange: (type: OrderTypeValue) => void;
    onBack: () => void;
    onProceed: (method: PaymentMethodId, customer: CheckoutCustomerInfo) => void;
}) {
    const [isGuest, setIsGuest] = useState(true);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [tableNumber, setTableNumber] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("cash");
    const [error, setError] = useState("");

    const subtotal = posCartTotal(lines);
    const tax = Math.round(subtotal * 0.11);
    const discount = 0;
    const total = subtotal + tax - discount;

    function handleProceed() {
        if (!isGuest && !name.trim()) {
            setError("Customer name is required");
            return;
        }
        if (orderType === "dine_in" && !tableNumber.trim()) {
            setError("Table number is required for dine-in orders");
            return;
        }
        if (orderType === "home_delivery" && !deliveryAddress.trim()) {
            setError("Delivery address is required for delivery orders");
            return;
        }
        setError("");
        onProceed(paymentMethod, {
            isGuest,
            name: isGuest ? "Guest Customer" : name.trim(),
            phone: phone.trim(),
            tableNumber: tableNumber.trim(),
            deliveryAddress: deliveryAddress.trim(),
        });
    }

    return (
        <div>
            <div className="flex items-center gap-3 px-8 py-5">
                <button
                    onClick={onBack}
                    className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-white hover:bg-white/10"
                >
                    <ArrowLeft className="size-4" />
                </button>
                <h1 className="text-xl font-bold text-white">Checkout</h1>
            </div>

            <div className="grid grid-cols-1 gap-8 px-8 pb-10 lg:grid-cols-[1fr_420px]">
                <div>
                    <div className="mb-4 flex flex-wrap gap-3">
                        <div className="rounded-lg bg-white/5 px-4 py-2">
                            <p className="text-xs text-white/40">Order ID</p>
                            <p className="text-sm font-medium text-white">{orderId}</p>
                        </div>
                        <div className="rounded-lg bg-white/5 px-4 py-2">
                            <p className="text-xs text-white/40">Platform</p>
                            <p className="text-sm font-medium text-white">POS</p>
                        </div>
                    </div>

                    <p className="mb-3 text-sm text-white/60">{lines.length} Items</p>
                    <div className="flex flex-col gap-3">
                        {lines.map((line) => (
                            <div key={line.id} className="rounded-xl bg-white/5 p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-medium text-white">{line.name}</p>
                                        <p className="text-xs text-white/40">{line.variantLabel}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-white/50">Qty: {line.qty}</p>
                                        <p className="font-semibold text-white">
                                            {posCartLineTotal(line).toLocaleString()} kr.
                                        </p>
                                    </div>
                                </div>
                                <CartLineDetails line={line} className="mt-2" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div>
                        <p className="mb-2 text-sm font-semibold text-white">Order Type</p>
                        <div className="grid grid-cols-3 gap-2">
                            {ORDER_TYPES.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => onOrderTypeChange(type.id)}
                                    className={cn(
                                        "rounded-lg border py-2.5 text-sm font-medium transition-colors",
                                        orderType === type.id
                                            ? "border-secondary text-white"
                                            : "border-white/15 text-white/60 hover:border-white/30"
                                    )}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {orderType === "dine_in" && (
                        <div>
                            <p className="mb-2 text-sm font-semibold text-white">Table Number</p>
                            <Input
                                value={tableNumber}
                                onChange={(e) => setTableNumber(e.target.value)}
                                placeholder="e.g. T4"
                                className="h-11"
                            />
                        </div>
                    )}

                    {orderType === "home_delivery" && (
                        <div>
                            <p className="mb-2 text-sm font-semibold text-white">Delivery Address</p>
                            <Input
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                placeholder="Enter delivery address"
                                className="h-11"
                            />
                        </div>
                    )}

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-sm font-semibold text-white">Customer Info</p>
                            <label className="flex items-center gap-2 text-sm text-white/60">
                                Guest
                                <button
                                    onClick={() => setIsGuest((g) => !g)}
                                    className={cn(
                                        "relative h-5 w-9 rounded-full transition-colors",
                                        isGuest ? "bg-secondary" : "bg-white/15"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "absolute top-0.5 size-4 rounded-full bg-white transition-transform",
                                            isGuest ? "translate-x-4" : "translate-x-0.5"
                                        )}
                                    />
                                </button>
                            </label>
                        </div>
                        {isGuest ? (
                            <Input value="Guest Customer" readOnly className="h-11" />
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                <Input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Phone number"
                                    className="h-11"
                                />
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Name"
                                    className="h-11"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Input placeholder="Voucher code" className="h-11 flex-1" />
                        <Button variant="secondary" className="h-11 bg-secondary text-white hover:bg-secondary/90">
                            Apply
                        </Button>
                    </div>

                    <div>
                        <p className="mb-2 text-sm font-semibold text-white">Payment Summary</p>
                        <div className="rounded-lg bg-white/5 p-4 text-sm">
                            <div className="flex justify-between py-1 text-white/60">
                                <span>Total Amount</span>
                                <span className="text-white">{subtotal.toLocaleString()} kr.</span>
                            </div>
                            <div className="flex justify-between py-1 text-white/60">
                                <span>Tax (11%)</span>
                                <span className="text-white">{tax.toLocaleString()} kr.</span>
                            </div>
                            <div className="flex justify-between py-1 text-white/60">
                                <span>Discount</span>
                                <span className="text-red-400">-{discount.toLocaleString()} kr.</span>
                            </div>
                            <div className="mt-2 flex justify-between border-t border-white/10 pt-2 font-semibold text-white">
                                <span>Total</span>
                                <span>{total.toLocaleString()} kr.</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="mb-2 text-sm font-semibold text-white">Payment Method</p>
                        <PaymentMethodPicker value={paymentMethod} onChange={setPaymentMethod} />
                    </div>

                    {error && <p className="text-sm text-secondary">{error}</p>}

                    <Button
                        onClick={handleProceed}
                        disabled={lines.length === 0}
                        className="h-12 w-full bg-secondary text-base font-semibold text-white hover:bg-secondary/90"
                    >
                        Proceed to Complete
                    </Button>
                </div>
            </div>
        </div>
    );
}
