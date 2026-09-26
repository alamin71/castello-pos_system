import apiClient from "@/lib/axios";
import { API } from "@/config/api.endpoints";
import type { PaginatedEnvelope } from "@/types/api.types";
import type { ListProductsParams, Product } from "@/types/product.types";

export const productService = {
    list: async (params?: ListProductsParams) => {
        const res = await apiClient.get<PaginatedEnvelope<Product>>(API.menu.products, {
            params,
        });
        return res.data.data;
    },
};
