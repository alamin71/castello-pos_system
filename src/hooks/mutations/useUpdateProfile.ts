import { useMutation } from "@tanstack/react-query";
import { posAuthService } from "@/services/posAuth.service";
import type { UpdateProfilePayload } from "@/types/auth.types";

export function useUpdateProfile() {
    return useMutation({
        mutationFn: (payload: UpdateProfilePayload) => posAuthService.updateProfile(payload),
    });
}
