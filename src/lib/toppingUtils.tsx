import type { Product } from "@/types/product.types";
import type { OrderItemTopping } from "@/types/order.types";

// ─── Runtime working types ──────────────────────────────────────────────────
// Same shape/logic as Castello-web's src/main/Menu/toppingUtils.tsx — a topping
// instance carries its own live `qty`, separate from the static catalog item.
export interface Topping {
    name: string;
    price: number;
    qty: number;
    isDefault?: boolean;
}

export interface ToppingGroup {
    label: string;
    items: Topping[];
}

// Builds a fresh, editable topping-group set for a product — defaults pre-selected at
// qty 1, everything else starts at qty 0. Called once per half when a pizza is chosen,
// and again by "Reset Toppings" to drop every customer change back to this preset.
export function buildGroups(product: Pick<Product, "toppingGroups">): ToppingGroup[] {
    return (product.toppingGroups ?? []).map((group) => ({
        label: group.name,
        items: group.items.map((item) => ({
            name: item.name,
            price: item.price,
            qty: item.isDefault ? 1 : 0,
            isDefault: item.isDefault,
        })),
    }));
}

// Default toppings are already baked into the product's base price — removing one is
// free (no refund), but asking for extra beyond the default qty of 1 charges for the
// extra units. Non-default (added) toppings always charge their full price per quantity.
export const toppingsTotal = (groups: ToppingGroup[]) =>
    groups.reduce(
        (sum, g) =>
            sum +
            g.items.reduce((s, t) => s + t.price * (t.isDefault ? Math.max(0, t.qty - 1) : t.qty), 0),
        0
    );

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
                        key={topping.name}
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
