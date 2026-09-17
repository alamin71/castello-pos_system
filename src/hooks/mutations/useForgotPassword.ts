import { useMutation } from "@tanstack/react-query";
import { posAuthService } from "@/services/posAuth.service";

export function useForgotPassword() {
    return useMutation({
        mutationFn: (phone: string) => posAuthService.forgotPassword(phone),
    });
}
