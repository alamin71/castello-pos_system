import { useQuery } from "@tanstack/react-query";
import { toppingItemService } from "@/services/toppingItem.service";

export function useToppingItems() {
    return useQuery({
        queryKey: ["toppingItems"],
        queryFn: () => toppingItemService.list({ status: "active", limit: 100 }),
    });
}
