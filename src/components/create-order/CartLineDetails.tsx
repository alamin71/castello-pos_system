import { OrderItemToppings } from "@/components/orders/OrderItemToppings";
import type { PosCartLine } from "@/store/pos-cart.store";

export function CartLineDetails({ line, className }: { line: PosCartLine; className?: string }) {
    if (line.bundleItems) {
        return (
            <div className={className}>
                <div className="flex flex-col gap-2">
                    {line.bundleItems.map((sub, i) => (
                        <div key={i} className="rounded-md bg-white/5 px-2.5 py-2">
                            <p className="text-xs font-medium text-white">
                                {sub.name}
                                {sub.variantLabel && <span className="text-white/40"> / {sub.variantLabel}</span>}
                            </p>
                            {sub.toppings && (
                                <OrderItemToppings
                                    toppings={sub.toppings}
                                    extraCount={sub.extraToppingsCount}
                                    extraPrice={sub.extraToppingsPrice}
                                    className="mt-1.5"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (line.toppings) {
        return (
            <OrderItemToppings
                toppings={line.toppings}
                extraCount={line.extraToppingsCount}
                extraPrice={line.extraToppingsPrice}
                className={className}
            />
        );
    }

    if (line.description) {
        return <p className={className ? `${className} text-xs text-white/40` : "text-xs text-white/40"}>{line.description}</p>;
    }

    return null;
}
