// src/hooks/mutations/useAuthMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/use-auth-store/use-auth-store";
import { useNavigate } from "react-router";
import { loginPost, logoutPost, refreshTokenPost, type ILoginResponse, type IRefreshTokenResponse } from "@/services/api/auth.api";
import { ApiError } from "@/services/api/client";

export const useAuthMutation = (callbacks?: { onLoginError?: (message: string) => void }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setUserDetails, clearUserDetails, setAccessToken } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: loginPost,
    onSuccess: (data: ILoginResponse) => {
      const { accessToken, refreshToken, user } = data;
      setUserDetails({ ...user, accessToken, refreshToken });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      navigate("/dashboard");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError ? error.message : "Login failed. Please try again.";
      callbacks?.onLoginError?.(message);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutPost,
    onSuccess: () => {
      clearUserDetails();
      queryClient.clear();
      navigate("/login");
    },
    onError: () => {
      // Always clear local state even if API call fails
      clearUserDetails();
      queryClient.clear();
      navigate("/login");
    },
  });

  const refreshMutation = useMutation({
    mutationFn: () => {
      const storedRefreshToken = useAuthStore.getState().refreshToken;
      if (!storedRefreshToken) return Promise.reject(new Error("No refresh token"));
      return refreshTokenPost(storedRefreshToken);
    },
    onSuccess: (data: IRefreshTokenResponse) => {
      setAccessToken(data.accessToken, data.refreshToken);
    },
    onError: () => {
      clearUserDetails();
      navigate("/login");
    },
  });

  return { loginMutation, logoutMutation, refreshMutation };
};