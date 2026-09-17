"use client";

import type { Product } from "@/types/product.types";

function priceRangeLabel(product: Product) {
    const prices = product.variants.map((v) => v.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `${min.toLocaleString()} kr.`;
    return `${min.toLocaleString()} kr. - ${max.toLocaleString()} kr.`;
}

export function ProductGrid({
    products,
    onSelect,
}: {
    products: Product[];
    onSelect: (product: Product) => void;
}) {
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
                <button
                    key={product.id}
                    onClick={() => onSelect(product)}
                    className="flex flex-col overflow-hidden rounded-xl bg-white/5 text-left transition-colors hover:bg-white/10"
                >
                    <div className="flex h-28 items-center justify-center bg-white/5 text-5xl">
                        {product.image}
                    </div>
                    <div className="p-3">
                        <p className="text-sm font-medium text-white">{product.name}</p>
                        <p className="text-xs text-white/40">{priceRangeLabel(product)}</p>
                    </div>
                </button>
            ))}
        </div>
    );
}
