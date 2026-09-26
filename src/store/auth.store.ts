"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OperationUserProfile } from "@/types/auth.types";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: OperationUserProfile | null;
  hasHydrated: boolean;
  setAuth: (accessToken: string, refreshToken: string, user: OperationUserProfile) => void;
  updateUser: (patch: Partial<OperationUserProfile>) => void;
  clearAuth: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      hasHydrated: false,
      setAuth: (accessToken, refreshToken, user) => set({ accessToken, refreshToken, user }),
      updateUser: (patch) =>
        set((state) => (state.user ? { user: { ...state.user, ...patch } } : state)),
      clearAuth: () => set({ accessToken: null, refreshToken: null, user: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "castello-pos-auth",
      // The route guards in (auth)/layout.tsx and (pos)/layout.tsx must not decide anything
      // until this fires — persist restores accessToken from localStorage a tick after the
      // store is created, and reading the pre-hydration `null` in that window was causing a
      // logged-in user to get bounced to /login and immediately back to "/" on a fresh
      // navigation (e.g. hard-loading /orders/new) before the real token had loaded.
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
