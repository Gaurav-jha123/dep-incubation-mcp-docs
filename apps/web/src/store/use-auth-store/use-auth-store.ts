// src/store/use-auth-store/use-auth-store.ts
import type { IUser } from "@/services/api/auth.api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IAuthStore {
  // accessToken is NEVER persisted — it's short-lived and memory-only
  accessToken: string | null;
  // refreshToken is persisted — needed to re-authenticate after page reload
  refreshToken: string | null;
  user: IUser | null;
  isLoggedIn: boolean;
  setAccessToken: (accessToken: string, refreshToken?: string) => void;
  setUserDetails: (user: IUser & { accessToken: string; refreshToken: string }) => void;
  clearUserDetails: () => void;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: get()?.refreshToken || null,
      user: get()?.user || null,
      isLoggedIn: get()?.isLoggedIn || false,

      setAccessToken: (accessToken: string, refreshToken?: string) =>
        set({ accessToken, isLoggedIn: true, ...(refreshToken ? { refreshToken } : {}) }),

      setUserDetails: (data: IUser & { accessToken: string; refreshToken: string }) =>
        set({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isLoggedIn: true,
          user: {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role
          },
        }),

      clearUserDetails: () =>
        set({ user: null, isLoggedIn: false, accessToken: null, refreshToken: null }),
    }),
    {
      name: "auth-storage",
      // Persist user, isLoggedIn, and refreshToken (needed for re-auth after reload)
      // Do NOT persist accessToken — it's short-lived and memory-only
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
