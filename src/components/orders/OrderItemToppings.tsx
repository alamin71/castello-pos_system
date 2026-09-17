import { cn } from "@/lib/utils";
import type { OrderItemTopping } from "@/types/order.types";

function ToppingChip({ topping }: { topping: OrderItemTopping }) {
    if (topping.state === "removed") {
        return (
            <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-red-400">
                − {topping.name}
            </span>
        );
    }

    if (topping.state === "added") {
        const label = topping.qty && topping.qty > 1 ? `${topping.qty} × ${topping.name}` : topping.name;
        return (
            <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-emerald-400">
                {topping.isNew && "+ "}
                {label}
            </span>
        );
    }

    return (
        <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-white/70">
            {topping.name}
        </span>
    );
}

export function OrderItemToppings({
    toppings,
    extraCount,
    extraPrice,
    className,
}: {
    toppings: OrderItemTopping[];
    extraCount?: number;
    extraPrice?: number;
    className?: string;
}) {
    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <div className="flex flex-wrap gap-1.5">
                {toppings.map((topping, i) => (
                    <ToppingChip key={`${topping.name}-${i}`} topping={topping} />
                ))}
            </div>
            {!!extraCount && (
                <p className="text-xs text-white/40">
                    +{extraCount} toppings
                    {typeof extraPrice === "number" && (
                        <>
                            {" "}| <span className="text-white/60">+{extraPrice.toLocaleString()} kr.</span>
                        </>
                    )}
                </p>
            )}
        </div>
    );
}
