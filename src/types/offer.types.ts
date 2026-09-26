import type { CategoryRef } from "./category.types";

export interface OfferCategoryRef {
    _id: string;
    offerCategoryId: string;
    name: string;
}

export interface OfferItemProduct {
    productId: string;
    variantItemIds: string[];
}

export interface OfferItem {
    categoryId: CategoryRef;
    isFixed: boolean;
    products: OfferItemProduct[];
}

export interface Offer {
    _id: string;
    offerId: string;
    offerCategoryId: OfferCategoryRef;
    title: string;
    description: string;
    price: number;
    mainImage: string;
    gallery: string[];
    offerItems: OfferItem[];
}

export interface ListOffersParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
    status?: "active" | "inactive";
    offerCategoryId?: string;
}
