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
import { buildGroups, toOrderItemToppings, toToppingSelections, toppingsTotal, ToppingGroupSection } from "@/lib/toppingUtils";
import type { ToppingGroup } from "@/lib/pizzaData";
import { useOffer } from "@/hooks/queries/useOffer";
import { useProducts } from "@/hooks/queries/useProducts";
import { useCategories } from "@/hooks/queries/useCategories";
import { useToppingCategories } from "@/hooks/queries/useToppingCategories";
import { useToppingItems } from "@/hooks/queries/useToppingItems";
import type { Product } from "@/types/product.types";
import type { Category } from "@/types/category.types";
import type { ToppingCategory } from "@/types/toppingCategory.types";
import type { ToppingItem } from "@/types/toppingItem.types";
import type { OfferDetail } from "@/types/offerDetail.types";
import type {
    OfferItemDetail,
    OfferItemProductRef,
    OfferItemVariantRef,
} from "@/types/offerDetail.types";
import type { PosCartLine } from "@/store/pos-cart.store";
import type { BundleSelectionPayload } from "@/types/orderPayload.types";

interface SlotSelection {
    product: OfferItemProductRef;
    variant: OfferItemVariantRef | null;
    groups: ToppingGroup[];
}

function slotRequiresChoice(item: OfferItemDetail): boolean {
    const first = item.products[0];
    return item.products.length > 1 || (first?.variantItemIds.length ?? 0) > 1;
}

function buildSlotGroups(
    productRef: OfferItemProductRef,
    products: Product[],
    toppingCategories: ToppingCategory[],
    toppingItems: ToppingItem[]
): ToppingGroup[] {
    const real = products.find((p) => p._id === productRef._id);
    if (!real) return [];
    return buildGroups(
        {
            toppingCategoryIds: real.toppingCategoryIds.map((c) => c.toppingCategoryId),
            defaultToppings: real.defaultToppingItemIds.map((t) => ({
                toppingItemId: t.toppingItemId,
                price: t.price,
            })),
        },
        toppingCategories,
        toppingItems
    );
}

export function OfferDetailDialog({
    offerId,
    open,
    onOpenChange,
    onAddToCart,
}: {
    offerId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddToCart: (line: Omit<PosCartLine, "id">) => void;
}) {
    const { data: offer } = useOffer(open ? offerId ?? undefined : undefined);
    const { data: products } = useProducts();
    const { data: categories } = useCategories();
    const { data: toppingCategories } = useToppingCategories();
    const { data: toppingItems } = useToppingItems();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTitle className="sr-only">{offer?.title ?? "Offer"}</DialogTitle>
            <DialogDescription className="sr-only">Offer bundle details</DialogDescription>
            <DialogContent className="flex max-h-[85vh] w-11/12 max-w-lg flex-col border border-white/10 bg-[#1c1c1c] p-0 text-white">
                {offer && open && (
                    <OfferDetailBody
                        key={offer._id}
                        offer={offer}
                        products={products ?? []}
                        categories={categories ?? []}
                        toppingCategories={toppingCategories ?? []}
                        toppingItems={toppingItems ?? []}
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
    products,
    categories,
    toppingCategories,
    toppingItems,
    onAddToCart,
}: {
    offer: OfferDetail;
    products: Product[];
    categories: Category[];
    toppingCategories: ToppingCategory[];
    toppingItems: ToppingItem[];
    onAddToCart: (line: Omit<PosCartLine, "id">) => void;
}) {
    const [qty, setQty] = useState(1);
    const [explicitSelections, setExplicitSelections] = useState<Record<number, SlotSelection>>({});
    const [activeSlot, setActiveSlot] = useState<number | null>(null);
    const [draft, setDraft] = useState<{ productIndex: number; variantIndex: number; groups: ToppingGroup[] } | null>(null);

    const slotGroupsFor = (productRef: OfferItemProductRef) =>
        buildSlotGroups(productRef, products, toppingCategories, toppingItems);

    const getSlotSelection = (item: OfferItemDetail, index: number): SlotSelection | null => {
        if (explicitSelections[index]) return explicitSelections[index];
        if (slotRequiresChoice(item)) return null;
        const first = item.products[0];
        if (!first) return null;
        return {
            product: first.productId,
            variant: first.variantItemIds[0] ?? null,
            groups: slotGroupsFor(first.productId),
        };
    };

    const slotSelections = offer.offerItems.map(getSlotSelection);
    // Choosing a different product or variant within a slot never changes the price — the
    // offer's flat price already covers any listed alternative. Only extra/added toppings add on top.
    const toppingsSum = slotSelections.reduce((sum, sel) => sum + (sel ? toppingsTotal(sel.groups) : 0), 0);
    const total = (offer.price + toppingsSum) * qty;
    const canAddToCart = slotSelections.every((sel) => sel !== null);

    function openSlot(index: number) {
        const item = offer.offerItems[index];
        const current = getSlotSelection(item, index);
        const productIndex = current
            ? item.products.findIndex((p) => p.productId._id === current.product._id)
            : 0;
        const resolvedProductIndex = productIndex === -1 ? 0 : productIndex;
        const productOption = item.products[resolvedProductIndex];
        const variantIndex = current?.variant
            ? productOption.variantItemIds.findIndex((v) => v._id === current.variant?._id)
            : 0;

        setDraft({
            productIndex: resolvedProductIndex,
            variantIndex: variantIndex === -1 ? 0 : variantIndex,
            groups: current?.groups ?? slotGroupsFor(productOption.productId),
        });
        setActiveSlot(index);
    }

    function closeSlot() {
        setActiveSlot(null);
        setDraft(null);
    }

    function selectDraftProduct(productIndex: number) {
        if (activeSlot === null) return;
        const productOption = offer.offerItems[activeSlot].products[productIndex];
        setDraft({ productIndex, variantIndex: 0, groups: slotGroupsFor(productOption.productId) });
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
        const productOption = offer.offerItems[activeSlot].products[draft.productIndex];
        setDraft((prev) => (prev ? { ...prev, groups: slotGroupsFor(productOption.productId) } : prev));
    }

    function confirmSlot() {
        if (activeSlot === null || !draft) return;
        const item = offer.offerItems[activeSlot];
        const productOption = item.products[draft.productIndex];
        setExplicitSelections((prev) => ({
            ...prev,
            [activeSlot]: {
                product: productOption.productId,
                variant: productOption.variantItemIds[draft.variantIndex] ?? null,
                groups: draft.groups,
            },
        }));
        closeSlot();
    }

    function handleAddToCart() {
        if (!canAddToCart) return;

        const bundleItems: NonNullable<PosCartLine["bundleItems"]> = [];
        const bundleSelections: BundleSelectionPayload[] = [];

        offer.offerItems.forEach((item, i) => {
            if (item.isFixed) return; // backend auto-includes fixed slots server-side
            const sel = slotSelections[i];
            if (!sel) return;
            const { toppings, extraCount, extraPrice } = toOrderItemToppings(sel.groups);
            const { toppingSelections, removedDefaultToppingItemIds } = toToppingSelections(sel.groups);

            bundleItems.push({
                name: sel.product.name,
                variantLabel: sel.variant?.name,
                toppings: toppings.length ? toppings : undefined,
                extraToppingsCount: extraCount || undefined,
                extraToppingsPrice: extraPrice || undefined,
            });
            bundleSelections.push({
                slotIndex: i,
                productId: sel.product._id,
                variantItemId: sel.variant?._id,
                toppingSelections,
                removedDefaultToppingItemIds,
            });
        });

        onAddToCart({
            productId: offer._id,
            name: offer.title,
            variantLabel: "",
            image: offer.mainImage,
            qty,
            unitPrice: offer.price,
            extraToppingsPrice: toppingsSum || undefined,
            bundleItems: bundleItems.length ? bundleItems : undefined,
            orderPayload: {
                type: "offer",
                offerId: offer._id,
                bundleSelections: bundleSelections.length ? bundleSelections : undefined,
            },
        });
    }

    const activeItem = activeSlot !== null ? offer.offerItems[activeSlot] : undefined;
    const activeOption = activeItem && draft ? activeItem.products[draft.productIndex] : undefined;

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
                        <p className="text-sm font-bold text-white">Choose {activeItem.categoryId.name}</p>
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
                                        key={option.productId._id}
                                        onClick={() => selectDraftProduct(pi)}
                                        className={`flex w-20 shrink-0 flex-col items-center gap-1.5 rounded-xl border p-2 text-center transition-colors ${pi === draft.productIndex ? "border-secondary" : "border-white/15 hover:border-white/30"
                                            }`}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={option.productId.mainImage}
                                            alt={option.productId.name}
                                            className="size-12 rounded-lg bg-white/5 object-contain"
                                        />
                                        <p className="line-clamp-2 text-xs font-medium text-white">{option.productId.name}</p>
                                    </button>
                                ))}
                            </div>
                        )}

                        {activeOption.variantItemIds.length > 1 && (
                            <div>
                                <p className="mb-2 text-sm font-semibold text-white">Variants</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {activeOption.variantItemIds.map((v, vi) => (
                                        <button
                                            key={v._id}
                                            onClick={() => setDraft((prev) => (prev ? { ...prev, variantIndex: vi } : prev))}
                                            className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${draft.variantIndex === vi ? "border-secondary text-white" : "border-white/10 text-white/60 hover:border-white/30"
                                                }`}
                                        >
                                            {v.name}
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
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={offer.mainImage} alt={offer.title} className="size-32 rounded-full bg-white/5 object-contain p-2" />
                    </div>

                    <div>
                        <p className="mb-3 text-sm font-semibold text-white">Offer Items</p>
                        <div className="flex flex-col gap-3">
                            {offer.offerItems.map((item, i) => {
                                const sel = slotSelections[i];
                                const customizable = slotRequiresChoice(item) || (sel?.groups.length ?? 0) > 0;
                                const category = categories.find((c) => c.categoryId === item.categoryId.categoryId);

                                if (!customizable) {
                                    return (
                                        <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={sel?.product.mainImage || category?.image}
                                                alt={sel?.product.name ?? item.categoryId.name}
                                                className="size-10 shrink-0 rounded-lg bg-white/5 object-contain"
                                            />
                                            <p className="text-sm font-semibold text-white">{sel?.product.name ?? item.categoryId.name}</p>
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
                                            <p className="text-sm font-semibold text-white">{item.categoryId.name}</p>
                                            <ChevronRight className="size-4 shrink-0 text-white/40" />
                                        </button>
                                    );
                                }

                                const { toppings, extraCount, extraPrice } = toOrderItemToppings(sel.groups);

                                return (
                                    <div key={i} className="rounded-xl border border-white/15">
                                        <div className="flex items-center justify-between gap-3 px-4 py-3">
                                            <p className="truncate text-sm font-semibold text-white">
                                                {sel.product.name}
                                                {sel.variant && <span className="text-white/40"> / {sel.variant.name}</span>}
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
                                            <OrderItemToppings toppings={toppings} extraCount={extraCount} extraPrice={extraPrice} className="px-4 pb-3" />
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
