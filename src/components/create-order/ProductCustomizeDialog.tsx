"use client";

import { useState } from "react";
import { ArrowLeft, ChevronRight, Minus, Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { buildGroups, toOrderItemToppings, toppingsTotal, ToppingGroupSection, type ToppingGroup } from "@/lib/toppingUtils";
import { getPizzaProducts } from "@/lib/mock/catalog.mock";
import type { Product } from "@/types/product.types";
import type { PosCartLine } from "@/store/pos-cart.store";

type HalfSlot = "first" | "second";

interface HalfState {
    product: Product;
    groups: ToppingGroup[];
}

function makeHalf(product: Product): HalfState {
    return { product, groups: buildGroups(product) };
}

function HalfCircleIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
        </svg>
    );
}

function PizzaPickerRow({ product, onSelect }: { product: Product; onSelect: () => void }) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-white/10 p-3">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-white/5 text-3xl">
                {product.image}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{product.name}</p>
                {product.description && (
                    <p className="truncate text-xs text-white/40">{product.description}</p>
                )}
                <div className="mt-1 flex gap-3">
                    {product.variants.map((v) => (
                        <span key={v.id} className="text-xs text-white/50">
                            {v.label} <span className="font-semibold text-white">{v.price.toLocaleString()} kr.</span>
                        </span>
                    ))}
                </div>
            </div>
            <Button onClick={onSelect} variant="outline" className="border-white/15 text-white">
                Select this one
            </Button>
        </div>
    );
}

export function ProductCustomizeDialog({
    product,
    allowHalfHalf = false,
    open,
    onOpenChange,
    onAddToCart,
}: {
    product: Product | null;
    allowHalfHalf?: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddToCart: (line: Omit<PosCartLine, "id">) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTitle className="sr-only">{product?.name ?? "Half & Half Pizza"}</DialogTitle>
            <DialogDescription className="sr-only">Choose a variant and toppings</DialogDescription>
            <DialogContent className="flex max-h-[85vh] w-11/12 max-w-lg flex-col border border-white/10 bg-[#1c1c1c] p-0 text-white">
                {open && (
                    <ProductCustomizeBody
                        key={product?.id ?? "half-half"}
                        product={product}
                        allowHalfHalf={allowHalfHalf}
                        onAddToCart={(line) => {
                            onAddToCart(line);
                            onOpenChange(false);
                        }}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}

function ProductCustomizeBody({
    product,
    allowHalfHalf,
    onAddToCart,
}: {
    product: Product | null;
    allowHalfHalf: boolean;
    onAddToCart: (line: Omit<PosCartLine, "id">) => void;
}) {
    const pizzaOptions = getPizzaProducts();

    const [mode, setMode] = useState<"single" | "half">(product ? "single" : "half");
    const [activeHalf, setActiveHalf] = useState<HalfSlot>("first");
    const [half1, setHalf1] = useState<HalfState | null>(product ? makeHalf(product) : null);
    const [half2, setHalf2] = useState<HalfState | null>(null);
    const [pickerFor, setPickerFor] = useState<HalfSlot | null>(null);
    const [variantIndex, setVariantIndex] = useState(0);
    const [qty, setQty] = useState(1);

    function toggleHalfHalf() {
        setMode((m) => (m === "single" ? "half" : "single"));
        setActiveHalf("first");
    }

    function selectTab(tab: HalfSlot) {
        if ((tab === "first" && !half1) || (tab === "second" && !half2)) {
            setPickerFor(tab);
            return;
        }
        setActiveHalf(tab);
    }

    function handleSelectPizza(chosen: Product) {
        if (!pickerFor) return;
        const half = makeHalf(chosen);
        if (pickerFor === "first") setHalf1(half);
        else setHalf2(half);
        setActiveHalf(pickerFor);
        setPickerFor(null);
    }

    const editTarget: HalfSlot = mode === "single" ? "first" : activeHalf;
    const activeState = editTarget === "second" ? half2 : half1;

    function updateQty(target: HalfSlot, gi: number, ti: number, delta: number) {
        const updater = (groups: ToppingGroup[]) =>
            groups.map((g, i) =>
                i !== gi
                    ? g
                    : { ...g, items: g.items.map((t, j) => (j !== ti ? t : { ...t, qty: Math.max(0, t.qty + delta) })) }
            );
        if (target === "first") setHalf1((prev) => (prev ? { ...prev, groups: updater(prev.groups) } : prev));
        else setHalf2((prev) => (prev ? { ...prev, groups: updater(prev.groups) } : prev));
    }

    function removeTopping(target: HalfSlot, gi: number, ti: number) {
        const updater = (groups: ToppingGroup[]) =>
            groups.map((g, i) => (i !== gi ? g : { ...g, items: g.items.map((t, j) => (j !== ti ? t : { ...t, qty: 0 })) }));
        if (target === "first") setHalf1((prev) => (prev ? { ...prev, groups: updater(prev.groups) } : prev));
        else setHalf2((prev) => (prev ? { ...prev, groups: updater(prev.groups) } : prev));
    }

    function resetToppings(target: HalfSlot) {
        if (target === "first") setHalf1((prev) => (prev ? { ...prev, groups: buildGroups(prev.product) } : prev));
        else setHalf2((prev) => (prev ? { ...prev, groups: buildGroups(prev.product) } : prev));
    }

    const half1Price = half1?.product.variants[variantIndex]?.price ?? 0;
    const half2Price = half2?.product.variants[variantIndex]?.price ?? 0;

    const basePrice =
        mode === "single" ? half1Price : half1 && half2 ? Math.round((half1Price + half2Price) / 2) : half1Price || half2Price;

    const toppingsSum =
        mode === "single" ? toppingsTotal(half1?.groups ?? []) : toppingsTotal(half1?.groups ?? []) + toppingsTotal(half2?.groups ?? []);

    const unitTotal = basePrice + toppingsSum;
    const canAddToCart = !pickerFor && (mode === "single" || (!!half1 && !!half2));
    const titleProduct = mode === "single" ? half1?.product ?? null : null;

    function handleAddToCart() {
        if (!canAddToCart || !half1) return;
        const isHalfHalf = mode === "half" && half1 && half2;

        if (isHalfHalf && half2) {
            onAddToCart({
                productId: `${half1.product.id}+${half2.product.id}`,
                name: `Half & Half: ${half1.product.name} + ${half2.product.name}`,
                variantLabel: half1.product.variants[variantIndex]?.label ?? "",
                image: "◐",
                qty,
                unitPrice: unitTotal,
                description: `1st: ${half1.product.name} — 2nd: ${half2.product.name}`,
            });
            return;
        }

        const { toppings, extraCount, extraPrice } = toOrderItemToppings(half1.groups);
        onAddToCart({
            productId: half1.product.id,
            name: half1.product.name,
            variantLabel: half1.product.variants[variantIndex]?.label ?? "",
            image: half1.product.image,
            qty,
            unitPrice: half1Price,
            toppings: toppings.length ? toppings : undefined,
            extraToppingsCount: extraCount || undefined,
            extraToppingsPrice: extraPrice || undefined,
        });
    }

    if (pickerFor) {
        return (
            <>
                <div className="flex items-center gap-3 border-b border-white/10 p-5">
                    <button
                        onClick={() => setPickerFor(null)}
                        className="flex size-8 items-center justify-center rounded-full text-white hover:bg-white/10"
                    >
                        <ArrowLeft className="size-4" />
                    </button>
                    <div>
                        <p className="text-sm font-bold text-white">
                            {pickerFor === "first" ? "1st Half" : "2nd Half"}
                        </p>
                        <p className="text-xs text-white/40">
                            Choose one pizza for {pickerFor === "first" ? "1st" : "2nd"} half
                        </p>
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="flex flex-col gap-2 p-5">
                        {pizzaOptions.map((p) => (
                            <PizzaPickerRow key={p.id} product={p} onSelect={() => handleSelectPizza(p)} />
                        ))}
                    </div>
                </ScrollArea>
            </>
        );
    }

    return (
        <>
            <div className="border-b border-white/10 p-5">
                <h2 className="text-lg font-bold text-white">
                    {titleProduct ? titleProduct.name : "Half & Half Pizza"}
                </h2>
                <p className="text-sm text-white/50">
                    {titleProduct ? titleProduct.description ?? "" : "Two cravings, One pizza"}
                </p>
            </div>

            <ScrollArea className="flex-1">
                <div className="flex flex-col gap-5 p-5">
                    <div className="flex items-center justify-center">
                        {mode === "single" ? (
                            <div className="flex size-32 items-center justify-center rounded-full bg-white/5 text-6xl">
                                {half1?.product.image}
                            </div>
                        ) : (
                            <div className="relative size-32">
                                <div className="absolute inset-0 overflow-hidden rounded-full" style={{ clipPath: "inset(0 50% 0 0)" }}>
                                    {half1 ? (
                                        <div className="flex size-full items-center justify-center bg-white/5 text-6xl">
                                            {half1.product.image}
                                        </div>
                                    ) : (
                                        <div className="size-full rounded-full border-2 border-dashed border-white/20" />
                                    )}
                                </div>
                                <div className="absolute inset-0 overflow-hidden rounded-full" style={{ clipPath: "inset(0 0 0 50%)" }}>
                                    {half2 ? (
                                        <div className="flex size-full items-center justify-center bg-white/5 text-6xl">
                                            {half2.product.image}
                                        </div>
                                    ) : (
                                        <div className="size-full rounded-full border-2 border-dashed border-white/20" />
                                    )}
                                </div>
                                <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/20" />
                            </div>
                        )}
                    </div>

                    {product && allowHalfHalf && (
                        <div className="flex justify-center">
                            <button
                                onClick={toggleHalfHalf}
                                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${mode === "half" ? "border-secondary text-secondary" : "border-white/20 text-white hover:border-white/40"
                                    }`}
                            >
                                {mode === "half" ? (
                                    <>✕ Quite Split</>
                                ) : (
                                    <>
                                        <HalfCircleIcon className="size-4" />
                                        Half & Half
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {mode === "half" && (
                        <div>
                            <div className="grid grid-cols-2 overflow-hidden rounded-full border border-white/15">
                                {(["first", "second"] as HalfSlot[]).map((slot) => (
                                    <button
                                        key={slot}
                                        onClick={() => selectTab(slot)}
                                        className={`py-2.5 text-sm font-semibold transition-colors ${activeHalf === slot ? "bg-white text-zinc-900" : "text-white/50 hover:text-white"
                                            }`}
                                    >
                                        {slot === "first" ? "1st Half" : "2nd Half"}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setPickerFor(activeHalf)}
                                className="mt-4 flex w-full items-center justify-between rounded-xl border border-white/15 px-4 py-3 text-left hover:border-white/30"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <HalfCircleIcon className="size-5 shrink-0 text-secondary" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-white">
                                            {activeState ? activeState.product.name : activeHalf === "first" ? "1st Half" : "2nd Half"}
                                        </p>
                                        <p className="truncate text-xs text-white/40">
                                            {activeState ? activeState.product.description ?? "" : "Choose a half pizza from pizza menu"}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="size-4 shrink-0 text-white/40" />
                            </button>
                        </div>
                    )}

                    {activeState && (
                        <>
                            <div>
                                <p className="mb-2 text-sm font-semibold text-white">Variants</p>
                                <div className="flex gap-2">
                                    {activeState.product.variants.map((v, i) => (
                                        <button
                                            key={v.id}
                                            onClick={() => setVariantIndex(i)}
                                            className={`flex-1 rounded-lg border px-3 py-2 text-center text-sm font-medium transition-colors ${variantIndex === i ? "border-secondary text-white" : "border-white/10 text-white/60 hover:border-white/30"
                                                }`}
                                        >
                                            {v.originalPrice && (
                                                <span className="mr-1 text-white/30 line-through">
                                                    {v.originalPrice.toLocaleString()} kr.
                                                </span>
                                            )}
                                            {v.price.toLocaleString()} kr.
                                            <br />
                                            <span className="text-xs text-white/40">{v.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {activeState.groups.length > 0 && (
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-white">Toppings</p>
                                            <p className="text-xs text-white/40">You can customize toppings</p>
                                        </div>
                                        <button onClick={() => resetToppings(editTarget)} className="text-xs font-semibold text-secondary">
                                            Reset Toppings
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {activeState.groups.map((group, gi) => (
                                            <ToppingGroupSection
                                                key={group.label}
                                                group={group}
                                                onInc={(ti) => updateQty(editTarget, gi, ti, 1)}
                                                onDec={(ti) => updateQty(editTarget, gi, ti, -1)}
                                                onRemove={(ti) => removeTopping(editTarget, gi, ti)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </ScrollArea>

            <div className="flex items-center gap-3 border-t border-white/10 p-5">
                <span className="text-lg font-bold text-white">{(unitTotal * qty).toLocaleString()} kr.</span>
                <div className="flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1">
                    <button onClick={() => setQty((q) => Math.max(q - 1, 1))} className="flex size-7 items-center justify-center rounded-md bg-white/10 text-white">
                        <Minus className="size-3.5" />
                    </button>
                    <span className="w-5 text-center text-white">{qty}</span>
                    <button onClick={() => setQty((q) => q + 1)} className="flex size-7 items-center justify-center rounded-md bg-white/10 text-white">
                        <Plus className="size-3.5" />
                    </button>
                </div>
                {canAddToCart ? (
                    <Button onClick={handleAddToCart} className="h-11 flex-1 bg-secondary text-white hover:bg-secondary/90">
                        Add to Cart
                    </Button>
                ) : (
                    <Button disabled className="h-11 flex-1 bg-secondary/40 text-white/60">
                        Add to Cart
                    </Button>
                )}
            </div>
        </>
    );
}
