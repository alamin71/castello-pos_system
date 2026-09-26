import apiClient from "@/lib/axios";
import { API } from "@/config/api.endpoints";
import type { PaginatedEnvelope } from "@/types/api.types";
import type { ListToppingCategoriesParams, ToppingCategory } from "@/types/toppingCategory.types";

export const toppingCategoryService = {
    list: async (params?: ListToppingCategoriesParams) => {
        const res = await apiClient.get<PaginatedEnvelope<ToppingCategory>>(API.toppings.categories, {
            params,
        });
        return res.data.data;
    },
};
