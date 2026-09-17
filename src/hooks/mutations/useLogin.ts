import { useMutation } from "@tanstack/react-query";
import { posAuthService } from "@/services/posAuth.service";

export function useLogin() {
    return useMutation({
        mutationFn: posAuthService.login,
    });
}
