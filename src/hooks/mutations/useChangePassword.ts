import { useMutation } from "@tanstack/react-query";
import { posAuthService } from "@/services/posAuth.service";
import type { ChangePasswordPayload } from "@/types/auth.types";

export function useChangePassword() {
    return useMutation({
        mutationFn: (payload: ChangePasswordPayload) => posAuthService.changePassword(payload),
    });
}
