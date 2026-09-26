import apiClient from "@/lib/axios";
import { API } from "@/config/api.endpoints";
import type { ApiEnvelope } from "@/types/api.types";
import type { CreateOrderPayload, CreateOrderResponse } from "@/types/orderPayload.types";

export const orderService = {
    create: async (payload: CreateOrderPayload) => {
        const res = await apiClient.post<ApiEnvelope<CreateOrderResponse>>(API.orders, payload);
        return res.data.data;
    },
};
