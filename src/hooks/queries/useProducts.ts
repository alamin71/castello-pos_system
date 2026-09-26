import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import type { ListProductsParams } from "@/types/product.types";

export function useProducts(params?: ListProductsParams) {
    return useQuery({
        queryKey: ["products", params],
        queryFn: () => productService.list({ status: "active", limit: 100, ...params }),
    });
}
