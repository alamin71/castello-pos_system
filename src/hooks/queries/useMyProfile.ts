import { useQuery } from "@tanstack/react-query";
import { posAuthService } from "@/services/posAuth.service";
import { useAuthStore } from "@/store/auth.store";

export function useMyProfile() {
    const accessToken = useAuthStore((s) => s.accessToken);

    return useQuery({
        queryKey: ["pos-auth", "me"],
        queryFn: posAuthService.getMe,
        enabled: !!accessToken,
    });
}
