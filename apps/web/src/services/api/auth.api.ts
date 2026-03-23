// src/services/api/auth.api.ts
import type { loginFormSchema } from "@/lib/schema/login-form.zod";
import { apiClient } from "./client";
import type z from "zod";

export interface IUser {
  id: number;
  name: string;
  email: string;
}

export interface ILoginResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export type ISignupResponse = ILoginResponse;

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export type IMeResponse = IUser & { createdAt: string };

export const loginPost = (data: z.infer<typeof loginFormSchema>) =>
  apiClient<ILoginResponse>({ endpoint: "/auth/login", method: "POST", body: data });

export const signupPost = (data: { name: string; email: string; password: string }) =>
  apiClient<ISignupResponse>({ endpoint: "/auth/signup", method: "POST", body: data });

export const getMe = () =>
  apiClient<IMeResponse>({ endpoint: "/auth/me", method: "GET" });

export const refreshTokenPost = (refreshToken: string) =>
  apiClient<IRefreshTokenResponse>({
    endpoint: "/auth/refresh",
    method: "POST",
    body: { refreshToken },
  });

export const logoutPost = () =>
  apiClient<{ message: string }>({ endpoint: "/auth/logout", method: "POST" });