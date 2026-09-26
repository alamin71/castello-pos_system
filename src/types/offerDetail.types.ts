// Shapes returned by "Get Offer by ID" (`/admin/promotions/offers/:id`) — unlike the list
// endpoint, this fully populates each offer item's category, product, and variant refs so the
// bundle picker can show real names/images/prices without extra lookups.

export interface OfferItemCategoryRef {
    _id: string;
    categoryId: string;
    name: string;
}

export interface OfferItemProductRef {
    _id: string;
    productId: string;
    name: string;
    mainImage: string;
}

export interface OfferItemVariantRef {
    _id: string;
    variantItemId: string;
    name: string;
}

export interface OfferItemProductOption {
    productId: OfferItemProductRef;
    variantItemIds: OfferItemVariantRef[];
}

export interface OfferItemDetail {
    categoryId: OfferItemCategoryRef;
    isFixed: boolean;
    products: OfferItemProductOption[];
}

export interface OfferDetail {
    _id: string;
    offerId: string;
    title: string;
    description: string;
    price: number;
    mainImage: string;
    gallery: string[];
    offerItems: OfferItemDetail[];
    totalItems: number;
    status: "active" | "inactive";
}
