import type { CategoryRef } from "./category.types";

export interface ToppingCategoryRef {
    _id: string;
    toppingCategoryId: string;
    name: string;
}

export interface DefaultToppingItemRef {
    _id: string;
    toppingItemId: string;
    name: string;
    price: number;
}

export interface VariantCategoryRef {
    _id: string;
    name: string;
}

export interface VariantItemRef {
    _id: string;
    name: string;
}

export interface ProductVariant {
    _id: string;
    productId: string;
    variantCategoryId: VariantCategoryRef;
    variantItemId: VariantItemRef;
    price: number;
    status: "active" | "inactive";
    createdAt: string;
    updatedAt: string;
}

export interface ProductAvailability {
    website: boolean;
    pos: boolean;
    kiosk: boolean;
}

export interface Product {
    _id: string;
    productId: string;
    name: string;
    description: string;
    categoryId: CategoryRef;
    type: "single" | "variant";
    price?: number;
    mainImage: string;
    gallery: string[];
    toppingCategoryIds: ToppingCategoryRef[];
    defaultToppingItemIds: DefaultToppingItemRef[];
    availability: ProductAvailability;
    status: "active" | "inactive";
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    variants: ProductVariant[];
}

export interface ListProductsParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
    status?: "active" | "inactive";
    categoryId?: string;
}
