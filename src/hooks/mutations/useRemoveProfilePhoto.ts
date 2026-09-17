import { useMutation } from "@tanstack/react-query";
import { posAuthService } from "@/services/posAuth.service";

export function useRemoveProfilePhoto() {
    return useMutation({
        mutationFn: posAuthService.removePhoto,
    });
}
