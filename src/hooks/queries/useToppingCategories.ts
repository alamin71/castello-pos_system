import { useQuery } from "@tanstack/react-query";
import { toppingCategoryService } from "@/services/toppingCategory.service";

export function useToppingCategories() {
    return useQuery({
        queryKey: ["toppingCategories"],
        queryFn: () => toppingCategoryService.list({ status: "active", limit: 100 }),
    });
}
