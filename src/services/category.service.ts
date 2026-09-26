import apiClient from "@/lib/axios";
import { API } from "@/config/api.endpoints";
import type { PaginatedEnvelope } from "@/types/api.types";
import type { Category, ListCategoriesParams } from "@/types/category.types";

export const categoryService = {
    list: async (params?: ListCategoriesParams) => {
        const res = await apiClient.get<PaginatedEnvelope<Category>>(API.menu.categories, {
            params,
        });
        return res.data.data;
    },
};
