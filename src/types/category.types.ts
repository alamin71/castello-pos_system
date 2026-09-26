// Lightweight category reference embedded in products/offers responses.
export interface CategoryRef {
    _id: string;
    categoryId: string;
    name: string;
}

export interface Category {
    _id: string;
    categoryId: string;
    name: string;
    image: string;
    status: "active" | "inactive";
    isDeleted: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
    totalProducts: number;
}

export interface ListCategoriesParams {
    page?: number;
    limit?: number;
    status?: "active" | "inactive";
    searchTerm?: string;
}
