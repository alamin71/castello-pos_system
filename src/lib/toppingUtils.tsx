import type { ToppingCategory } from "@/types/toppingCategory.types";
import type { ToppingItem } from "@/types/toppingItem.types";
import type { OrderItemTopping } from "@/types/order.types";
import type { PizzaItem, Topping, ToppingGroup } from "./pizzaData";

// Builds the topping groups a given pizza/product slot should offer, from the real
// topping-categories/topping-items catalog — `toppingCategoryIds` (undefined = every
// category) picks which groups show, and `defaultToppings` (matched by real toppingItemId)
// marks which items are pre-selected with their real price. Ported from Castello-web's
// src/main/Menu/toppingUtils.tsx buildGroups, extended to carry each topping's real Mongo
// `id` (needed by POST /orders — web's cart doesn't submit an order directly, POS does).
export function buildGroups(
    pizza: Pick<PizzaItem, "toppingCategoryIds" | "defaultToppings">,
    toppingCategories: ToppingCategory[],
    toppingItems: ToppingItem[]
): ToppingGroup[] {
    const relevantCategories =
        pizza.toppingCategoryIds === undefined
            ? toppingCategories
            : toppingCategories.filter((c) => pizza.toppingCategoryIds!.includes(c.toppingCategoryId));

    const defaultMap = new Map((pizza.defaultToppings ?? []).map((d) => [d.toppingItemId, d.price]));

    return relevantCategories
        .map((category) => ({
            label: category.name,
            items: toppingItems
                .filter((item) => item.toppingCategoryId.toppingCategoryId === category.toppingCategoryId)
                .map((item): Topping => {
                    const isDefault = defaultMap.has(item.toppingItemId);
                    const realPrice = defaultMap.get(item.toppingItemId);
                    return {
                        id: item._id,
                        name: item.name,
                        // Prefer the real backend price for this product's default toppings;
                        // fall back to the topping catalog's own price for everything else.
                        price: isDefault && realPrice != null ? realPrice : item.price,
                        qty: isDefault ? 1 : 0,
                        isDefault,
                    };
                }),
        }))
        .filter((group) => group.items.length > 0);
}

// Default toppings are already baked into the product's base price — removing one is
// free (no refund), but asking for extra beyond the default qty of 1 charges for the
// extra units. Non-default (added) toppings always charge their full price per quantity.
export const toppingsTotal = (groups: ToppingGroup[]) =>
    groups.reduce(
        (sum, g) =>
            sum +
            g.items.reduce(
                (s, t) => s + t.price * (t.isDefault ? Math.max(0, t.qty - 1) : t.qty),
                0
            ),
        0
    );

// Converts live topping groups into the request body shape POST /orders expects.
export function toToppingSelections(groups: ToppingGroup[]): {
    toppingSelections: { toppingItemId: string; quantity: number }[];
    removedDefaultToppingItemIds: string[];
} {
    const toppingSelections: { toppingItemId: string; quantity: number }[] = [];
    const removedDefaultToppingItemIds: string[] = [];

    groups.forEach((group) => {
        group.items.forEach((t) => {
            if (t.isDefault && t.qty === 0) {
                removedDefaultToppingItemIds.push(t.id);
            } else if (t.qty > 0) {
                toppingSelections.push({ toppingItemId: t.id, quantity: t.qty });
            }
        });
    });

    return { toppingSelections, removedDefaultToppingItemIds };
}

// Converts live topping groups into the flat chip list the cart/order-details views
// already know how to render (OrderItemToppings), plus the "+N toppings / +price" summary.
export function toOrderItemToppings(groups: ToppingGroup[]): {
    toppings: OrderItemTopping[];
    extraCount: number;
    extraPrice: number;
} {
    const toppings: OrderItemTopping[] = [];
    let extraCount = 0;
    let extraPrice = 0;

    groups.forEach((group) => {
        group.items.forEach((t) => {
            if (t.isDefault) {
                if (t.qty === 0) {
                    toppings.push({ name: t.name, state: "removed" });
                } else if (t.qty === 1) {
                    toppings.push({ name: t.name, state: "default" });
                } else {
                    toppings.push({ name: t.name, state: "added", qty: t.qty });
                    extraCount += 1;
                    extraPrice += t.price * (t.qty - 1);
                }
            } else if (t.qty > 0) {
                toppings.push({ name: t.name, state: "added", qty: t.qty, isNew: true });
                extraCount += 1;
                extraPrice += t.price * t.qty;
            }
        });
    });

    return { toppings, extraCount, extraPrice };
}

// ─── UI ──────────────────────────────────────────────────────────────────────
export function ToppingCard({
    topping,
    onInc,
    onDec,
    onRemove,
}: {
    topping: Topping;
    onInc: () => void;
    onDec: () => void;
    onRemove: () => void;
}) {
    const active = topping.qty > 0;
    const isDefaultActive = !!topping.isDefault && active;
    const isAddedActive = !topping.isDefault && active;
    const isDefaultRemoved = !!topping.isDefault && !active;

    return (
        <div
            className={`relative overflow-hidden rounded-lg border p-2 transition-colors ${active
                ? "border-secondary"
                : isDefaultRemoved
                    ? "border-red-500"
                    : "border-white/15"
                }`}
        >
            {isAddedActive && (
                <span className="absolute top-0 right-0 rounded-bl-lg bg-secondary px-2 py-0.5 text-[9px] leading-tight font-bold text-white">
                    New
                </span>
            )}
            {isDefaultRemoved && (
                <span className="absolute top-0 right-0 rounded-bl-lg bg-red-500 px-2 py-0.5 text-sm leading-tight font-bold text-white">
                    ×
                </span>
            )}
            <p className="text-sm leading-tight text-white">{topping.name}</p>
            <div className="mt-1 flex items-center justify-between">
                <p className="text-xs text-white/60">
                    {topping.price.toLocaleString()} kr.{topping.qty > 1 ? ` × ${topping.qty}` : ""}
                </p>
                <div className="flex items-center gap-1">
                    {isDefaultActive && (
                        <>
                            <button
                                onClick={onRemove}
                                aria-label={`Remove ${topping.name}`}
                                className="flex h-7 w-7 items-center justify-center text-lg font-bold text-red-500 transition-colors hover:opacity-70"
                            >
                                ×
                            </button>
                            {topping.qty > 1 && (
                                <button
                                    onClick={onDec}
                                    className="flex h-7 w-7 items-center justify-center rounded text-white transition-colors hover:bg-white/10"
                                >
                                    −
                                </button>
                            )}
                        </>
                    )}
                    {isAddedActive && (
                        <button
                            onClick={onDec}
                            className="flex h-7 w-7 items-center justify-center rounded text-white transition-colors hover:bg-white/10"
                        >
                            −
                        </button>
                    )}
                    <button
                        onClick={onInc}
                        className="flex h-7 w-7 items-center justify-center rounded text-white transition-colors hover:bg-secondary"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
}

export function ToppingGroupSection({
    group,
    onInc,
    onDec,
    onRemove,
}: {
    group: ToppingGroup;
    onInc: (ti: number) => void;
    onDec: (ti: number) => void;
    onRemove: (ti: number) => void;
}) {
    const extraQty = (t: Topping) => (t.isDefault ? Math.max(0, t.qty - 1) : t.qty);
    const addedQty = group.items.reduce((sum, t) => sum + extraQty(t), 0);
    const addedPrice = group.items.reduce((sum, t) => sum + t.price * extraQty(t), 0);

    return (
        <div>
            <div className="mb-2 flex items-baseline justify-between">
                <span className="text-sm font-medium text-white/70">{group.label}</span>
                {addedQty > 0 && (
                    <span className="text-[10px] text-secondary">
                        +{addedQty} Qty · +{addedPrice.toLocaleString()} kr.
                    </span>
                )}
            </div>
            <div className="grid grid-cols-2 gap-2">
                {group.items.map((topping, ti) => (
                    <ToppingCard
                        key={topping.id}
                        topping={topping}
                        onInc={() => onInc(ti)}
                        onDec={() => onDec(ti)}
                        onRemove={() => onRemove(ti)}
                    />
                ))}
            </div>
        </div>
    );
}
