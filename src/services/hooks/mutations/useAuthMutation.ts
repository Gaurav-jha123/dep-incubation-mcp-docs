// src/hooks/mutations/useAuthMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/use-auth-store/use-auth-store";
import { useNavigate } from "react-router";
import { loginPost, logoutPost, refreshTokenPost, type ILoginResponse, type IRefreshTokenResponse } from "@/services/api/auth.api";


export const useAuthMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setUserDetails, clearUserDetails, setAccessToken } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: loginPost,
    onSuccess: (data: ILoginResponse) => {
      const { accessToken, user } = data.data;
      setUserDetails({ ...user, token: accessToken });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      navigate("/dashboard");
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
    mutationFn: refreshTokenPost,
    onSuccess: (data: IRefreshTokenResponse) => {
      setAccessToken(data.data.accessToken);
    },
    onError: () => {
      clearUserDetails();
      navigate("/login");
    },
  });

  return { loginMutation, logoutMutation, refreshMutation };
};