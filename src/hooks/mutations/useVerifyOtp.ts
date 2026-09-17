import { useMutation } from "@tanstack/react-query";
import { posAuthService } from "@/services/posAuth.service";

export function useVerifyOtp() {
    return useMutation({
        mutationFn: ({ phone, otp }: { phone: string; otp: string }) =>
            posAuthService.verifyOtp(phone, otp),
    });
}
