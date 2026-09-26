import { useQuery } from "@tanstack/react-query";
import { offerService } from "@/services/offer.service";
import type { ListOffersParams } from "@/types/offer.types";

export function useOffers(params?: ListOffersParams) {
    return useQuery({
        queryKey: ["offers", params],
        queryFn: () => offerService.list({ status: "active", limit: 100, ...params }),
    });
}
