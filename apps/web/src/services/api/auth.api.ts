// src/services/api/auth.api.ts
import type { loginFormSchema } from "@/lib/schema/login-form.zod";
import { apiClient } from "./client";
import type z from "zod";
// src/types/auth.types.ts
export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface IRefreshTokenResponse {
  success: boolean;
  data: { accessToken: string };
}

export interface ILoginResponse {
  success: boolean;
  data: { accessToken: string; user: IUser };
}

export interface IMeResponse {
  success: boolean;
  data: { user: IUser };
}

export const loginPost = (data: z.infer<typeof loginFormSchema>) =>
  apiClient<ILoginResponse>({ endpoint: "/auth/login", method: "POST", body: data });

export const getMe = () =>
  apiClient<IMeResponse>({ endpoint: "/auth/me", method: "GET" });

export const refreshTokenPost = () =>
  apiClient<IRefreshTokenResponse>({ endpoint: "/auth/refresh", method: "POST" });

export const logoutPost = () =>
  apiClient({ endpoint: "/auth/logout", method: "POST" });