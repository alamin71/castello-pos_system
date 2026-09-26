import { useMutation } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import type { CreateOrderPayload } from "@/types/orderPayload.types";

export function useCreateOrder() {
    return useMutation({
        mutationFn: (payload: CreateOrderPayload) => orderService.create(payload),
    });
}
