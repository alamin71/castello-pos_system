import type { Product } from "@/types/product.types";

export interface SizeOption {
    label: string;
    price: number;
    originalPrice?: number;
    // Real VariantItem _id — required by POST /orders for a "variant" type product,
    // undefined for a "single" type product (its one implicit "Regular" size).
    variantItemId?: string;
}

// A topping that comes pre-selected with a product, keyed by its real backend id so it can
// be matched exactly against the real topping-items catalog (no name-matching guesswork).
export interface DefaultToppingSelection {
    toppingItemId: string;
    price: number;
}

export interface PizzaItem {
    // Real Product _id — required by POST /orders.
    id: string;
    title: string;
    description: string;
    sizes: SizeOption[];
    image?: string;
    gallery?: string[];
    // Real topping-category ids this product supports. `undefined` means "show every
    // topping category"; an empty array means this product has no toppings at all (drinks).
    toppingCategoryIds?: string[];
    defaultToppings?: DefaultToppingSelection[];
}

export interface Topping {
    // Real ToppingItem _id — required by POST /orders.
    id: string;
    name: string;
    price: number;
    qty: number;
    // Whether this topping came pre-selected with the product (vs added by the customer).
    isDefault?: boolean;
}

export interface ToppingGroup {
    label: string;
    items: Topping[];
}

// Maps a real API product (single or variant priced) into the shape the Create Order UI
// already knows how to render — same adapter Castello-web uses (src/main/Menu/pizzaData.ts),
// extended to also carry the real Mongo ids POST /orders needs.
export function productToMenuItem(product: Product): PizzaItem {
    const sizes: SizeOption[] =
        product.type === "variant" && product.variants.length > 0
            ? product.variants.map((v) => ({
                label: v.variantItemId.name,
                price: v.price,
                variantItemId: v.variantItemId._id,
            }))
            : [{ label: "Regular", price: product.price ?? 0 }];

    return {
        id: product._id,
        title: product.name,
        description: product.description,
        sizes,
        image: product.mainImage,
        gallery: product.gallery,
        toppingCategoryIds: product.toppingCategoryIds.map((c) => c.toppingCategoryId),
        defaultToppings: product.defaultToppingItemIds.map((t) => ({
            toppingItemId: t.toppingItemId,
            price: t.price,
        })),
    };
}
