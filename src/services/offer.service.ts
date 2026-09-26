import apiClient from "@/lib/axios";
import { API } from "@/config/api.endpoints";
import type { ApiEnvelope, PaginatedEnvelope } from "@/types/api.types";
import type { ListOffersParams, Offer } from "@/types/offer.types";
import type { OfferDetail } from "@/types/offerDetail.types";

export const offerService = {
    list: async (params?: ListOffersParams) => {
        const res = await apiClient.get<PaginatedEnvelope<Offer>>(API.promotions.offers, {
            params,
        });
        return res.data.data;
    },
    getById: async (id: string) => {
        const res = await apiClient.get<ApiEnvelope<OfferDetail>>(`${API.promotions.offers}/${id}`);
        return res.data.data;
    },
};
