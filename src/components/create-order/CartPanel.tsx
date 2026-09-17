"use client";

import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartLineDetails } from "@/components/create-order/CartLineDetails";
import { posCartLineTotal, posCartTotal, type PosCartLine } from "@/store/pos-cart.store";

export function CartPanel({
    lines,
    onUpdateQty,
    onRemove,
    onClearAll,
    onCompleteOrder,
}: {
    lines: PosCartLine[];
    onUpdateQty: (id: string, qty: number) => void;
    onRemove: (id: string) => void;
    onClearAll: () => void;
    onCompleteOrder: () => void;
}) {
    const total = posCartTotal(lines);
    const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);

    return (
        <div className="flex w-80 shrink-0 flex-col rounded-xl bg-white/5">
            <div className="flex items-center justify-between p-4">
                <p className="font-semibold text-white">Cart</p>
                {lines.length > 0 && (
                    <button onClick={onClearAll} className="text-sm text-secondary">
                        Clear all
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto px-4">
                {lines.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-white/30">
                        <ShoppingCart className="size-10" />
                        <p className="text-sm">No Item Added</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 pb-4">
                        {lines.map((line) => (
                            <div key={line.id} className="rounded-lg bg-white/5 p-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="text-sm font-medium text-white">{line.name}</p>
                                        <p className="text-xs text-white/40">{line.variantLabel}</p>
                                    </div>
                                    <button
                                        onClick={() => onRemove(line.id)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>

                                <CartLineDetails line={line} className="mt-2" />

                                <div className="mt-2 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 rounded-md bg-white/10 px-1.5 py-1">
                                        <button
                                            onClick={() => onUpdateQty(line.id, line.qty - 1)}
                                            className="flex size-6 items-center justify-center rounded text-white"
                                        >
                                            <Minus className="size-3" />
                                        </button>
                                        <span className="w-5 text-center text-sm text-white">{line.qty}</span>
                                        <button
                                            onClick={() => onUpdateQty(line.id, line.qty + 1)}
                                            className="flex size-6 items-center justify-center rounded text-white"
                                        >
                                            <Plus className="size-3" />
                                        </button>
                                    </div>
                                    <p className="text-sm font-semibold text-white">
                                        {posCartLineTotal(line).toLocaleString()} kr.
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="border-t border-white/10 p-4">
                <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="text-white/50">{itemCount} Items</span>
                    <span className="font-semibold text-white">{total.toLocaleString()} kr.</span>
                </div>
                <Button
                    onClick={onCompleteOrder}
                    disabled={lines.length === 0}
                    className="h-11 w-full bg-secondary text-white hover:bg-secondary/90"
                >
                    Complete Order
                </Button>
            </div>
        </div>
    );
}
