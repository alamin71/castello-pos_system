export interface ToppingCategory {
    _id: string;
    toppingCategoryId: string;
    name: string;
    status: "active" | "inactive";
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ListToppingCategoriesParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
    status?: "active" | "inactive";
}
