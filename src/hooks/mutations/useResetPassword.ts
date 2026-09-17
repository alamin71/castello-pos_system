import { useMutation } from "@tanstack/react-query";
import { posAuthService } from "@/services/posAuth.service";

export function useResetPassword() {
    return useMutation({
        mutationFn: ({ phone, newPassword }: { phone: string; newPassword: string }) =>
            posAuthService.resetPassword(phone, newPassword),
    });
}
