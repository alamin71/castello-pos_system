import apiClient from "@/lib/axios";
import { API } from "@/config/api.endpoints";
import type { ApiEnvelope } from "@/types/api.types";
import type {
    ChangePasswordPayload,
    LoginPayload,
    LoginResponse,
    OperationUserProfile,
    UpdateProfilePayload,
} from "@/types/auth.types";

export const posAuthService = {
    login: async (payload: LoginPayload) => {
        const res = await apiClient.post<ApiEnvelope<LoginResponse>>(API.posAuth.login, payload);
        return res.data.data;
    },

    forgotPassword: async (phone: string) => {
        await apiClient.post<ApiEnvelope<null>>(API.posAuth.forgotPassword, { phone });
    },

    verifyOtp: async (phone: string, otp: string) => {
        await apiClient.post<ApiEnvelope<null>>(API.posAuth.verifyOtp, { phone, otp });
    },

    resetPassword: async (phone: string, newPassword: string) => {
        await apiClient.post<ApiEnvelope<null>>(API.posAuth.resetPassword, { phone, newPassword });
    },

    getMe: async () => {
        const res = await apiClient.get<ApiEnvelope<OperationUserProfile>>(API.posAuth.me);
        return res.data.data;
    },

    updateProfile: async (payload: UpdateProfilePayload) => {
        const formData = new FormData();
        if (payload.name !== undefined) formData.append("name", payload.name);
        if (payload.image) formData.append("image", payload.image);

        const res = await apiClient.patch<ApiEnvelope<OperationUserProfile>>(API.posAuth.me, formData);
        return res.data.data;
    },

    removePhoto: async () => {
        const res = await apiClient.delete<ApiEnvelope<OperationUserProfile>>(API.posAuth.removePhoto);
        return res.data.data;
    },

    changePassword: async (payload: ChangePasswordPayload) => {
        await apiClient.patch<ApiEnvelope<null>>(API.posAuth.changePassword, payload);
    },
};
