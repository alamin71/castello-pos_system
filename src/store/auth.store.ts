"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OperationUserProfile } from "@/types/auth.types";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: OperationUserProfile | null;
  setAuth: (accessToken: string, refreshToken: string, user: OperationUserProfile) => void;
  updateUser: (patch: Partial<OperationUserProfile>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setAuth: (accessToken, refreshToken, user) => set({ accessToken, refreshToken, user }),
      updateUser: (patch) =>
        set((state) => (state.user ? { user: { ...state.user, ...patch } } : state)),
      clearAuth: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    { name: "castello-pos-auth" }
  )
);
