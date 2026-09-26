"use client";

import { Check, Printer, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PAYMENT_METHOD_LABELS } from "@/types/order.types";
import type { OrderType, PaymentMethodId, Platform } from "@/types/order.types";
import type { OrderTypeValue } from "@/types/orderPayload.types";

const ORDER_TYPE_LABELS: Record<OrderType | OrderTypeValue, string> = {
    "dine-in": "Dine-In",
    "take-away": "Take Away",
    delivery: "Delivery",
    dine_in: "Dine-In",
    takeaway: "Take Away",
    home_delivery: "Delivery",
};

export function PaymentCompletedView({
    orderId,
    orderType,
    platform,
    paymentMethod,
    totalBill,
    paidAmount,
    changeAmount,
    txnId,
    onDone,
    onReprintReceipt,
    onSendToKitchen,
}: {
    orderId: string;
    orderType: OrderType | OrderTypeValue;
    platform: Platform;
    paymentMethod: PaymentMethodId;
    totalBill: number;
    paidAmount: number;
    changeAmount?: number;
    txnId?: string;
    onDone: () => void;
    onReprintReceipt: () => void;
    onSendToKitchen: () => void;
}) {
    const headline = changeAmount !== undefined ? changeAmount : paidAmount;
    const headlineLabel = changeAmount !== undefined ? "Change Amount" : "Paid amount";

    return (
        <div className="flex h-full flex-col items-center justify-center gap-6 px-8">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-600">
                <Check className="size-8 text-white" strokeWidth={3} />
            </div>

            <div className="text-center">
                <p className="text-lg font-medium text-white">Payment Completed</p>
            </div>

            <div className="text-center">
                <p className="text-4xl font-bold text-white">{headline.toLocaleString()} kr.</p>
                <p className="mt-1 text-sm text-white/50">{headlineLabel}</p>
            </div>

            <div className="flex gap-3 text-sm text-white/60">
                {changeAmount !== undefined ? (
                    <>
                        <span>
                            Paid Amount <span className="font-semibold text-white">{paidAmount.toLocaleString()} kr.</span>
                        </span>
                        <span>
                            Total Bill <span className="font-semibold text-white">{totalBill.toLocaleString()} kr.</span>
                        </span>
                    </>
                ) : (
                    <>
                        <span>
                            TXN ID <span className="font-semibold text-white">{txnId}</span>
                        </span>
                        <span>
                            Total Bill <span className="font-semibold text-white">{totalBill.toLocaleString()} kr.</span>
                        </span>
                    </>
                )}
            </div>

            <div className="w-full max-w-md rounded-xl bg-white/5 p-4">
                <div className="flex items-center justify-between py-2 text-sm">
                    <span className="text-white/50">Order ID</span>
                    <span className="text-white">{orderId}</span>
                </div>
                <div className="flex items-center justify-between py-2 text-sm">
                    <span className="text-white/50">Payment Method</span>
                    <span className="text-white">{PAYMENT_METHOD_LABELS[paymentMethod]}</span>
                </div>
                <div className="flex items-center justify-between py-2 text-sm">
                    <span className="text-white/50">Order Type</span>
                    <span className="text-white">{ORDER_TYPE_LABELS[orderType]}</span>
                </div>
                <div className="flex items-center justify-between py-2 text-sm">
                    <span className="text-white/50">Platform</span>
                    <span className="text-white">{platform}</span>
                </div>
            </div>

            <div className="flex w-full max-w-md gap-3">
                <Button
                    onClick={onReprintReceipt}
                    variant="outline"
                    className="h-11 flex-1 border-white/15 text-white"
                >
                    <Printer className="size-4" />
                    Reprint Receipt
                </Button>
                <Button
                    onClick={onSendToKitchen}
                    variant="outline"
                    className="h-11 flex-1 border-white/15 text-white"
                >
                    <Send className="size-4" />
                    Send to Kitchen
                </Button>
            </div>

            <Button
                onClick={onDone}
                className="h-12 w-full max-w-md bg-secondary text-base font-semibold text-white hover:bg-secondary/90"
            >
                Done
            </Button>
        </div>
    );
}
