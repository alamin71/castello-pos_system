"use client";

import { useState } from "react";
import { ArrowLeft, ChevronRight, Minus, Pencil, Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderItemToppings } from "@/components/orders/OrderItemToppings";
import {
    buildGroups,
    toOrderItemToppings,
    toppingsTotal,
    ToppingGroupSection,
    type ToppingGroup,
} from "@/lib/toppingUtils";
import type { Offer, OfferSlot, OfferSlotProductOption } from "@/types/offer.types";
import type { ProductVariant } from "@/types/product.types";
import type { PosCartLine } from "@/store/pos-cart.store";

interface SlotSelection {
    productIndex: number;
    variantIndex: number;
    groups: ToppingGroup[];
}

function getSlotVariants(option: OfferSlotProductOption): ProductVariant[] {
    if (!option.variantIds) return option.product.variants;
    return option.product.variants.filter((v) => option.variantIds!.includes(v.id));
}

function slotRequiresChoice(slot: OfferSlot): boolean {
    const first = slot.products[0];
    return slot.products.length > 1 || (first ? getSlotVariants(first).length > 1 : false);
}

function defaultSlotSelection(slot: OfferSlot): SlotSelection | null {
    const first = slot.products[0];
    if (!first) return null;
    return { productIndex: 0, variantIndex: 0, groups: buildGroups(first.product) };
}

export function OfferDetailDialog({
    offer,
    open,
    onOpenChange,
    onAddToCart,
}: {
    offer: Offer | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddToCart: (line: Omit<PosCartLine, "id">) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTitle className="sr-only">{offer?.title ?? "Offer"}</DialogTitle>
            <DialogDescription className="sr-only">Offer bundle details</DialogDescription>
            <DialogContent className="flex max-h-[85vh] w-11/12 max-w-lg flex-col border border-white/10 bg-[#1c1c1c] p-0 text-white">
                {offer && open && (
                    <OfferDetailBody
                        key={offer.id}
                        offer={offer}
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

function OfferDetailBody({
    offer,
    onAddToCart,
}: {
    offer: Offer;
    onAddToCart: (line: Omit<PosCartLine, "id">) => void;
}) {
    const [qty, setQty] = useState(1);
    const [explicitSelections, setExplicitSelections] = useState<Record<number, SlotSelection>>({});
    const [activeSlot, setActiveSlot] = useState<number | null>(null);
    const [draft, setDraft] = useState<SlotSelection | null>(null);

    function getSlotSelection(slot: OfferSlot, index: number): SlotSelection | null {
        if (explicitSelections[index]) return explicitSelections[index];
        if (slotRequiresChoice(slot)) return null;
        return defaultSlotSelection(slot);
    }

    const slotSelections = offer.slots.map(getSlotSelection);
    // Choosing a different product/variant within a slot never changes the price — only
    // extra/added toppings add on top of the offer's flat price.
    const toppingsSum = slotSelections.reduce((sum, sel) => sum + (sel ? toppingsTotal(sel.groups) : 0), 0);
    const total = (offer.price + toppingsSum) * qty;
    const canAddToCart = slotSelections.every((sel) => sel !== null);

    function openSlot(index: number) {
        const slot = offer.slots[index];
        const current = getSlotSelection(slot, index);
        setDraft(
            current ?? {
                productIndex: 0,
                variantIndex: 0,
                groups: buildGroups(slot.products[0].product),
            }
        );
        setActiveSlot(index);
    }

    function closeSlot() {
        setActiveSlot(null);
        setDraft(null);
    }

    function selectDraftProduct(productIndex: number) {
        if (activeSlot === null) return;
        const option = offer.slots[activeSlot].products[productIndex];
        setDraft({ productIndex, variantIndex: 0, groups: buildGroups(option.product) });
    }

    function updateDraftQty(gi: number, ti: number, delta: number) {
        setDraft((prev) =>
            prev
                ? {
                    ...prev,
                    groups: prev.groups.map((g, i) =>
                        i !== gi
                            ? g
                            : { ...g, items: g.items.map((t, j) => (j !== ti ? t : { ...t, qty: Math.max(0, t.qty + delta) })) }
                    ),
                }
                : prev
        );
    }

    function removeDraftTopping(gi: number, ti: number) {
        setDraft((prev) =>
            prev
                ? { ...prev, groups: prev.groups.map((g, i) => (i !== gi ? g : { ...g, items: g.items.map((t, j) => (j !== ti ? t : { ...t, qty: 0 })) })) }
                : prev
        );
    }

    function resetDraftToppings() {
        if (activeSlot === null || !draft) return;
        const option = offer.slots[activeSlot].products[draft.productIndex];
        setDraft((prev) => (prev ? { ...prev, groups: buildGroups(option.product) } : prev));
    }

    function confirmSlot() {
        if (activeSlot === null || !draft) return;
        setExplicitSelections((prev) => ({ ...prev, [activeSlot]: draft }));
        closeSlot();
    }

    function handleAddToCart() {
        if (!canAddToCart) return;
        const bundleItems = offer.slots.flatMap((slot, i) => {
            const sel = slotSelections[i];
            if (!sel) return [];
            const option = slot.products[sel.productIndex];
            const variants = getSlotVariants(option);
            const { toppings, extraCount, extraPrice } = toOrderItemToppings(sel.groups);
            return [
                {
                    name: option.product.name,
                    variantLabel: variants[sel.variantIndex]?.label,
                    toppings: toppings.length ? toppings : undefined,
                    extraToppingsCount: extraCount || undefined,
                    extraToppingsPrice: extraPrice || undefined,
                },
            ];
        });

        onAddToCart({
            productId: offer.id,
            name: offer.title,
            variantLabel: "",
            image: offer.image,
            qty,
            unitPrice: offer.price,
            extraToppingsPrice: toppingsSum || undefined,
            bundleItems,
        });
    }

    const activeItem = activeSlot !== null ? offer.slots[activeSlot] : undefined;
    const activeOption = activeItem && draft ? activeItem.products[draft.productIndex] : undefined;
    const activeVariants = activeOption ? getSlotVariants(activeOption) : [];

    if (activeItem && draft && activeOption) {
        return (
            <>
                <div className="flex items-center gap-3 border-b border-white/10 p-5">
                    <button
                        onClick={closeSlot}
                        className="flex size-8 items-center justify-center rounded-full text-white hover:bg-white/10"
                    >
                        <ArrowLeft className="size-4" />
                    </button>
                    <div>
                        <p className="text-sm font-bold text-white">Choose {activeItem.categoryName}</p>
                        <p className="text-xs text-white/40">
                            Choose one{draft.groups.length > 0 ? ", you can also customize toppings" : ""}
                        </p>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="flex flex-col gap-5 p-5">
                        {activeItem.products.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {activeItem.products.map((option, pi) => (
                                    <button
                                        key={option.product.id}
                                        onClick={() => selectDraftProduct(pi)}
                                        className={`flex w-20 shrink-0 flex-col items-center gap-1.5 rounded-xl border p-2 text-center transition-colors ${pi === draft.productIndex ? "border-secondary" : "border-white/15 hover:border-white/30"
                                            }`}
                                    >
                                        <div className="flex size-12 items-center justify-center rounded-lg bg-white/5 text-2xl">
                                            {option.product.image}
                                        </div>
                                        <p className="line-clamp-2 text-xs font-medium text-white">{option.product.name}</p>
                                    </button>
                                ))}
                            </div>
                        )}

                        {activeVariants.length > 1 && (
                            <div>
                                <p className="mb-2 text-sm font-semibold text-white">Variants</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {activeVariants.map((v, vi) => (
                                        <button
                                            key={v.id}
                                            onClick={() => setDraft((prev) => (prev ? { ...prev, variantIndex: vi } : prev))}
                                            className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${draft.variantIndex === vi ? "border-secondary text-white" : "border-white/10 text-white/60 hover:border-white/30"
                                                }`}
                                        >
                                            {v.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {draft.groups.length > 0 && (
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-white">Toppings</p>
                                        <p className="text-xs text-white/40">You can customize toppings</p>
                                    </div>
                                    <button onClick={resetDraftToppings} className="text-xs font-semibold text-secondary">
                                        Reset Toppings
                                    </button>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {draft.groups.map((group, gi) => (
                                        <ToppingGroupSection
                                            key={group.label}
                                            group={group}
                                            onInc={(ti) => updateDraftQty(gi, ti, 1)}
                                            onDec={(ti) => updateDraftQty(gi, ti, -1)}
                                            onRemove={(ti) => removeDraftTopping(gi, ti)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="border-t border-white/10 p-5">
                    <Button onClick={confirmSlot} className="h-11 w-full bg-white/10 text-white hover:bg-white/15">
                        Add to list
                    </Button>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="border-b border-white/10 p-5">
                <h2 className="text-lg font-bold text-white">{offer.title}</h2>
                <p className="text-sm text-white/50">{offer.description}</p>
            </div>

            <ScrollArea className="flex-1">
                <div className="flex flex-col gap-5 p-5">
                    <div className="flex items-center justify-center">
                        <div className="flex size-32 items-center justify-center rounded-full bg-white/5 text-6xl">
                            {offer.image}
                        </div>
                    </div>

                    <div>
                        <p className="mb-3 text-sm font-semibold text-white">Offer Items</p>
                        <div className="flex flex-col gap-3">
                            {offer.slots.map((slot, i) => {
                                const sel = slotSelections[i];
                                const customizable = slotRequiresChoice(slot) || (sel?.groups.length ?? 0) > 0;

                                if (!customizable) {
                                    const option = slot.products[sel?.productIndex ?? 0];
                                    return (
                                        <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xl">
                                                {option.product.image}
                                            </div>
                                            <p className="text-sm font-semibold text-white">{option.product.name}</p>
                                        </div>
                                    );
                                }

                                if (!sel) {
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => openSlot(i)}
                                            className="flex w-full items-center justify-between rounded-xl border border-white/15 px-4 py-3 text-left hover:border-white/30"
                                        >
                                            <p className="text-sm font-semibold text-white">{slot.categoryName}</p>
                                            <ChevronRight className="size-4 shrink-0 text-white/40" />
                                        </button>
                                    );
                                }

                                const option = slot.products[sel.productIndex];
                                const variants = getSlotVariants(option);
                                const { toppings, extraCount, extraPrice } = toOrderItemToppings(sel.groups);

                                return (
                                    <div key={i} className="rounded-xl border border-white/15">
                                        <div className="flex items-center justify-between gap-3 px-4 py-3">
                                            <p className="truncate text-sm font-semibold text-white">
                                                {option.product.name}
                                                {variants[sel.variantIndex] && (
                                                    <span className="text-white/40"> / {variants[sel.variantIndex].label}</span>
                                                )}
                                            </p>
                                            <button
                                                onClick={() => openSlot(i)}
                                                className="flex shrink-0 items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:border-white/30"
                                            >
                                                <Pencil className="size-3.5" />
                                                Edit
                                            </button>
                                        </div>
                                        {toppings.length > 0 && (
                                            <OrderItemToppings
                                                toppings={toppings}
                                                extraCount={extraCount}
                                                extraPrice={extraPrice}
                                                className="px-4 pb-3"
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </ScrollArea>

            <div className="flex items-center gap-3 border-t border-white/10 p-5">
                <span className="text-lg font-bold text-white">{total.toLocaleString()} kr.</span>
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
