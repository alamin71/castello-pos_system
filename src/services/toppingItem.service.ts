import apiClient from "@/lib/axios";
import { API } from "@/config/api.endpoints";
import type { PaginatedEnvelope } from "@/types/api.types";
import type { ListToppingItemsParams, ToppingItem } from "@/types/toppingItem.types";

export const toppingItemService = {
    list: async (params?: ListToppingItemsParams) => {
        const res = await apiClient.get<PaginatedEnvelope<ToppingItem>>(API.toppings.items, {
            params,
        });
        return res.data.data;
    },
};
