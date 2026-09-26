export interface ToppingItemCategoryRef {
    _id: string;
    toppingCategoryId: string;
    name: string;
}

export interface ToppingItem {
    _id: string;
    toppingItemId: string;
    name: string;
    toppingCategoryId: ToppingItemCategoryRef;
    price: number;
    status: "active" | "inactive";
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ListToppingItemsParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
    status?: "active" | "inactive";
}
