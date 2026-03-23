// src/store/use-auth-store/use-auth-store.ts
import type { IUser } from "@/services/api/auth.api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IAuthStore {
  // accessToken is NEVER persisted — it's short-lived and memory-only
  accessToken: string | null;
  user: IUser | null;
  isLoggedIn: boolean;
  setAccessToken: (token: string) => void;
  setUserDetails: (user: IUser & { token: string }) => void;
  clearUserDetails: () => void;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: get()?.user || null,
      isLoggedIn: get()?.isLoggedIn || false,

      setAccessToken: (token: string) =>
        set({ accessToken: token, isLoggedIn: true }),

      setUserDetails: (data: IUser & { token: string }) =>
        set({
          accessToken: data.token,
          isLoggedIn: true,
          user: {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
          },
        }),

      clearUserDetails: () =>
        set({ user: null, isLoggedIn: false }),
    }),
    {
      name: "auth-storage",
      // Only persist user + isLoggedIn — NOT the access token
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
