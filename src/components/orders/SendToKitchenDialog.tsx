"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { OrderItemToppings } from "@/components/orders/OrderItemToppings";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/order.types";

const KITCHEN_ITEM_KEYWORDS = ["pizza", "kebab", "burger", "chicken"];

function isKitchenItem(name: string) {
    return KITCHEN_ITEM_KEYWORDS.some((kw) => name.toLowerCase().includes(kw));
}

function SendToKitchenBody({
    order,
    onOpenChange,
    onSent,
}: {
    order: Order;
    onOpenChange: (open: boolean) => void;
    onSent: () => void;
}) {
    const [selected, setSelected] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(order.items.map((item) => [item.id, isKitchenItem(item.name)]))
    );
    const [sent, setSent] = useState(false);

    function handleSend() {
        setSent(true);
        onSent();
    }

    if (sent) {
        return (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-600">
                    <Check className="size-8 text-white" strokeWidth={3} />
                </div>
                <p className="font-medium text-white">Items Successfully Sent to Kitchen</p>
                <Button
                    onClick={() => onOpenChange(false)}
                    className="h-11 w-full bg-secondary text-white hover:bg-secondary/90"
                >
                    Done
                </Button>
            </div>
        );
    }

    return (
        <>
            <h2 className="text-lg font-bold text-white">Send to Kitchen</h2>
            <div className="flex flex-col gap-3">
                {order.items.map((item) => (
                    <label
                        key={item.id}
                        className={cn(
                            "flex cursor-pointer items-start justify-between gap-3 rounded-lg border p-3",
                            selected[item.id] ? "border-secondary" : "border-white/10"
                        )}
                    >
                        <div className="flex flex-1 flex-col gap-1.5">
                            <div>
                                <p className="text-sm font-medium text-white">{item.name}</p>
                                {item.size && <p className="text-xs text-white/40">{item.size}</p>}
                            </div>
                            {item.toppings && <OrderItemToppings toppings={item.toppings} />}
                        </div>
                        <Checkbox
                            checked={!!selected[item.id]}
                            onCheckedChange={(checked) =>
                                setSelected((prev) => ({ ...prev, [item.id]: checked === true }))
                            }
                        />
                    </label>
                ))}
            </div>
            <Button
                onClick={handleSend}
                className="h-11 w-full bg-secondary text-white hover:bg-secondary/90"
            >
                Send
            </Button>
        </>
    );
}

export function SendToKitchenDialog({
    order,
    open,
    onOpenChange,
    onSent,
}: {
    order: Order;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSent: () => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTitle className="sr-only">Send to Kitchen</DialogTitle>
            <DialogContent className="w-11/12 max-w-md border border-white/10 bg-[#1c1c1c] p-6 text-white">
                {open && (
                    <SendToKitchenBody
                        key={order.id}
                        order={order}
                        onOpenChange={onOpenChange}
                        onSent={onSent}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
